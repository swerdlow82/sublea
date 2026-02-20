import os
from datetime import datetime, timezone
from database import SessionLocal, engine, Base
from auth.models import User, Listing
from auth_utils import hash_password

# function to fill database with mock listing data to ensure API connection works
def seed_database():
    print("Connecting to database...")
    db = SessionLocal()

    try:
        test_user = db.query(User).filter(User.email == "test@uoregon.edu").first()

        if not test_user:
            print("Creating test user...")
            test_user = User(
                email="test@uoregon.edu",
                password_hash=hash_password("password123"),
                is_verified=True,
                age=21,
                first_name="Test",
                last_name="User",
                gender="N/A",
                # created_at=datetime.now(timezone.utc),
                # updated_at=datetime.now(timezone.utc)
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)

        print("Creating mock listings...")

        mock_listings = [
            Listing(
                user_id=test_user.id,
                title="Sunlit Loft near UO Campus",
                description="Beautiful, naturally lit loft just 2 blocks from the library. Perfect for a focused student.",
                rent=1450,
                address="1450 Alder St",
                city="Eugene",
                state="OR",
                zip_code="97401",
                country="USA",
                bedrooms=1,
                bathrooms=1,
                roommate_count=0,
                available_from=datetime(2025, 6, 1, tzinfo=timezone.utc),
                available_to=datetime(2025, 8, 31, tzinfo=timezone.utc),
                images="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
                anonymous_lister=False,
                lister_first_name=test_user.first_name,
                lister_last_name=test_user.last_name
            ),
            Listing(
                user_id=test_user.id,
                title="Cozy Room - 5 min walk to Library",
                description="One massive bedroom available in a 3 bedroom house. Sharing with two chill CS majors.",
                rent=900,
                address="890 Kincaid St",
                city="Eugene",
                state="OR",
                zip_code="97401",
                country="USA",
                bedrooms=1,
                bathrooms=1,
                roommate_count=2,
                available_from=datetime(2025, 5, 15, tzinfo=timezone.utc),
                available_to=datetime(2025, 8, 20, tzinfo=timezone.utc),
                images="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
                anonymous_lister=False,
                lister_first_name=test_user.first_name,
                lister_last_name=test_user.last_name
            ),
            Listing(
                user_id=test_user.id,
                title="Modern 2 Bed Apt - Downtown Eugene",
                description="Entire brand new apartment in the heart of downtown. In-unit washer/dryer.",
                rent=1800,
                address="500 E 13th Ave",
                city="Eugene",
                state="OR",
                zip_code="97401",
                country="USA",
                bedrooms=2,
                bathrooms=2,
                roommate_count=0,
                available_from=datetime(2025, 6, 1, tzinfo=timezone.utc),
                images="https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop",
                anonymous_lister=True
            )
        ]

        db.bulk_save_objects(mock_listings)
        db.commit()

        print("Mock listings created successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

        
