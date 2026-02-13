import os
import psycopg2
from urllib.parse import urlparse

def check_db():
    # Production Azure DB URL
    db_url = "postgresql://elinityadmin:Nani2906@elinity-db-server.postgres.database.azure.com:5432/postgres?sslmode=require"
    
    print("🔍 Connecting to Azure Database to check for conflicts...")
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        email = "jatin@gmail.com"
        phone = "8200252850"
        
        # Check for email conflict
        cur.execute("SELECT id, email, phone FROM tenants WHERE email = %s", (email,))
        email_match = cur.fetchone()
        
        # Check for phone conflict
        cur.execute("SELECT id, email, phone FROM tenants WHERE phone = %s", (phone,))
        phone_match = cur.fetchone()
        
        print("\n--- RESULTS ---")
        if email_match:
            print(f"❌ CONFLICT: Email '{email}' already exists!")
            print(f"   User ID: {email_match[0]}")
            print(f"   Registered Phone: {email_match[2]}")
        else:
            print(f"✅ Email '{email}' is available.")
            
        if phone_match:
            print(f"❌ CONFLICT: Phone '{phone}' already exists!")
            print(f"   User ID: {phone_match[0]}")
            print(f"   Registered Email: {phone_match[1]}")
        else:
            print(f"✅ Phone '{phone}' is available.")

        if email_match or phone_match:
            print("\n💡 REASON FOR 500 ERROR:")
            print("The Azure server code is currently using an 'AND' check. Since only one of these exists, the server thinks it's a new user and tries to Save, but the Database blocks it because of the duplicate. This 'Save Crash' is what causes the 500 error.")
        else:
            print("\n✅ No conflicts found. Checking for other table errors...")
            # Check if all required profile tables exist
            tables = [
                "personal_info", "big_five_traits", "mbti_traits", "psychology", 
                "interests_hobbies", "values_beliefs_goals", "favorites", 
                "relationship_preferences", "friendship_preferences", 
                "collaboration_preferences", "personal_free_form", "intentions", 
                "aspiration_and_reflections", "ideal_characteristics"
            ]
            cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
            existing_tables = [t[0] for t in cur.fetchall()]
            
            missing = [t for t in tables if t not in existing_tables]
            if missing:
                print(f"❌ MISSING TABLES: {missing}")
                print("Registration crashes because it tries to initialize these profile sections.")
            else:
                print("✅ All secondary profile tables exist.")

        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ DATABASE ERROR: {e}")

if __name__ == "__main__":
    check_db()
