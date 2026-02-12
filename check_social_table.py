from database.session import engine
from sqlalchemy import text

def check_table():
    with engine.connect() as conn:
        try:
            res = conn.execute(text("SELECT * FROM social_posts LIMIT 1"))
            print("Columns in social_posts:", res.keys())
        except Exception as e:
            print(f"Error checking social_posts: {e}")

if __name__ == "__main__":
    check_table()
