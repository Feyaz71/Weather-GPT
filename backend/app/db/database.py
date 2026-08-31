import os
import aiosqlite
from app.core.config import settings
from app.core.logging import logger


DB_FILE = "weathergpt.db"

CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS alert_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    recipient_identifier TEXT NOT NULL,
    channel TEXT DEFAULT 'PUSH',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    query_text TEXT NOT NULL,
    intent TEXT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


async def init_db():
    try:
        async with aiosqlite.connect(DB_FILE) as db:
            await db.executescript(CREATE_TABLES_SQL)
            await db.commit()
        logger.info(f"Database schema initialized ({DB_FILE}).")
    except Exception as e:
        logger.warning(f"Database initialization exception: {e}")
