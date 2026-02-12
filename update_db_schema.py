from database.session import engine
from sqlalchemy import text

def update_schema():
    print("Updating database schema...")
    with engine.connect() as conn:
        try:
            # Check for PostgreSQL or SQLite to use correct syntax
            # Assuming PostgreSQL based on the settings
            conn.execute(text("ALTER TABLE chats ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE"))
            conn.commit()
            print("Added is_read column to chats table.")
        except Exception as e:
            print(f"Error adding column (it might already exist): {e}")
            conn.rollback()

if __name__ == "__main__":
    update_schema()
