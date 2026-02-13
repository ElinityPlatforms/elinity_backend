import sys
import os
from sqlalchemy.orm import Session
from database.session import SessionLocal
from models.user import Tenant

def check_user(email, phone):
    db = SessionLocal()
    try:
        user_by_email = db.query(Tenant).filter(Tenant.email == email).first()
        user_by_phone = db.query(Tenant).filter(Tenant.phone == phone).first()
        
        print(f"--- DATABASE CHECK ---")
        print(f"Email '{email}' exists: {user_by_email is not None}")
        if user_by_email:
            print(f"  Owner Phone: {user_by_email.phone}")
            
        print(f"Phone '{phone}' exists: {user_by_phone is not None}")
        if user_by_phone:
            print(f"  Owner Email: {user_by_phone.email}")
        
        # Check for any other 500 triggers in the Tenant model
        print(f"--- SERVER-SIDE INTEGRITY ---")
        print("Checking if we can create a dry-run Tenant object...")
        t = Tenant(email="test_dry_run@test.com", password="hash")
        print("✅ Dry-run object created successfully.")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user("jatin@gmail.com", "8200252850")
