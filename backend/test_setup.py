# test_setup.py
from app.database import engine, Base
from app.models import User
from sqlalchemy.orm import sessionmaker

def test_database_connection():
    """Test if database connection works"""
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database connection successful!")
        print("✅ Tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_database_connection()