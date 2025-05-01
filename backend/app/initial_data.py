from sqlalchemy.orm import Session
from . import models, auth
from .database import SessionLocal

def init_db():
    db = SessionLocal()
    try:
        # Create initial genres if they don't exist
        initial_genres = [
            "Fiction",
            "Non-Fiction",
            "Science Fiction",
            "Mystery",
            "Romance",
            "Fantasy",
            "Biography",
            "History",
            "Science",
            "Technology",
            "Arts",
            "Philosophy",
            "Poetry",
            "Drama",
            "Children's"
        ]

        for genre_name in initial_genres:
            if not db.query(models.Genre).filter(models.Genre.name == genre_name).first():
                genre = models.Genre(name=genre_name)
                db.add(genre)
                print(f"Created genre: {genre_name}")
        
        db.commit()
        print("Database initialized successfully!")

    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing the database...")
    init_db() 