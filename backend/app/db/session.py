from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.core.logging import logger
from app.db.models import Base

# Format database URL for SQLite / PostgreSQL
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite+aiosqlite:"):
    sync_db_url = db_url.replace("sqlite+aiosqlite:", "sqlite:")
elif db_url.startswith("postgresql+asyncpg:"):
    sync_db_url = db_url.replace("postgresql+asyncpg:", "postgresql:")
else:
    sync_db_url = db_url

engine = create_engine(
    sync_db_url,
    connect_args={"check_same_thread": False} if "sqlite" in sync_db_url else {},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
