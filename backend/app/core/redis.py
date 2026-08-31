import json
import time
from typing import Any, Optional
from app.core.config import settings
from app.core.logging import logger

try:
    import redis.asyncio as aioredis
except ImportError:
    aioredis = None


class InMemoryCache:
    """High performance in-memory fallback cache with TTL support."""
    def __init__(self):
        self._store = {}
        self._expires = {}
        self._subscriptions = {}

    async def get(self, key: str) -> Optional[str]:
        now = time.time()
        if key in self._expires and now > self._expires[key]:
            self._store.pop(key, None)
            self._expires.pop(key, None)
            return None
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        self._store[key] = value
        if ex:
            self._expires[key] = time.time() + ex
        else:
            self._expires.pop(key, None)
        return True

    async def delete(self, key: str) -> bool:
        self._store.pop(key, None)
        self._expires.pop(key, None)
        return True

    async def publish(self, channel: str, message: str) -> int:
        return 1

    async def ping(self) -> bool:
        return True


class CacheService:
    def __init__(self):
        self._redis = None
        self._fallback = InMemoryCache()
        self._is_redis_active = False

    async def init(self):
        if aioredis and settings.REDIS_URL:
            try:
                self._redis = aioredis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=1.5
                )
                await self._redis.ping()
                self._is_redis_active = True
                logger.info("Connected to Redis cache successfully.")
            except Exception as e:
                logger.warning(f"Redis unavailable ({e}). Using in-memory fallback cache.")
                self._is_redis_active = False
        else:
            self._is_redis_active = False

    async def get(self, key: str) -> Optional[str]:
        if self._is_redis_active and self._redis:
            try:
                return await self._redis.get(key)
            except Exception:
                return await self._fallback.get(key)
        return await self._fallback.get(key)

    async def set(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        str_val = value if isinstance(value, str) else json.dumps(value)
        if self._is_redis_active and self._redis:
            try:
                return await self._redis.set(key, str_val, ex=ex)
            except Exception:
                return await self._fallback.set(key, str_val, ex=ex)
        return await self._fallback.set(key, str_val, ex=ex)

    async def get_json(self, key: str) -> Optional[Any]:
        val = await self.get(key)
        if val:
            try:
                return json.loads(val)
            except Exception:
                return None
        return None

    async def set_json(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        return await self.set(key, json.dumps(value), ex=ex)

    async def publish(self, channel: str, message: Any) -> int:
        str_msg = message if isinstance(message, str) else json.dumps(message)
        if self._is_redis_active and self._redis:
            try:
                return await self._redis.publish(channel, str_msg)
            except Exception:
                return await self._fallback.publish(channel, str_msg)
        return await self._fallback.publish(channel, str_msg)

    async def close(self):
        if self._redis and self._is_redis_active:
            try:
                await self._redis.close()
            except Exception:
                pass


cache_service = CacheService()
