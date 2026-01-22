import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY") or "dev-secret"
JWT_HASH_ALGORITHM = os.getenv("JWT_HASH_ALGORITHM") or "HS256"

# Safe int parsing with sensible defaults so missing envs don't crash imports.
def _int_env(name: str, default: int) -> int:
    v = os.getenv(name)
    try:
        return int(v) if v is not None else default
    except Exception:
        return default

JWT_ACCESS_TOKEN_EXPIRE_MINUTES = _int_env("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 30)
JWT_REFRESH_TOKEN_EXPIRE_DAYS = _int_env("JWT_REFRESH_TOKEN_EXPIRE_DAYS", 7)
HASH_ALGORITHM = os.getenv("HASH_ALGORITHM") or "bcrypt"

GOOGLE_APPLICATION_CREDENTIALS=os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
GCS_BUCKET_NAME=os.getenv("GCS_BUCKET_NAME")

# Redis connection
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = _int_env("REDIS_PORT", 6379)
REDIS_DB = _int_env("REDIS_DB", 0)
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)
REDIS_URL = os.getenv("REDIS_URL", f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}")

# PostgreSQL Database connection
# PostgreSQL Database connection
# Priority: Check DB_URL first (used by our Supabase config), then DATABASE_URL, then construct from parts
_env_db_url = os.getenv("DB_URL") or os.getenv("DATABASE_URL")

if _env_db_url:
    DATABASE_URL = _env_db_url
else:
    DATABASE_URL = (
        f"postgresql://{os.getenv('DB_USER','') }:{os.getenv('DB_PASSWORD','')}"
        f"@{os.getenv('DB_HOST','localhost')}:{os.getenv('DB_PORT','5432')}/{os.getenv('DB_NAME','') }"
    )

# Ensure SSL for managed Postgres hosts (Supabase, Render, AWS RDS, etc.).
# We apply this if SSL is mandated by env or if host looks external.
ssl_mode_env = os.getenv("DB_SSL_MODE", "disable")

if ssl_mode_env == "require" or (
    "localhost" not in DATABASE_URL and 
    "127.0.0.1" not in DATABASE_URL and 
    "db:" not in DATABASE_URL and 
    "postgres:" not in DATABASE_URL
):
    if 'sslmode' not in DATABASE_URL:
        connector = '&' if '?' in DATABASE_URL else '?'
        DATABASE_URL = f"{DATABASE_URL}{connector}sslmode=require"
