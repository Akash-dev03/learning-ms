from app.database import SessionLocal
from app.seed_data import seed_database
from app.models import Book, Genre, User, LibrarySettings, BookLoan, Review, book_genres

def clear_database(db):
    print("Clearing existing data...")
    # Delete in correct order to handle foreign key constraints
    db.query(BookLoan).delete()
    db.query(Review).delete()
    # Delete book_genres association table entries first
    db.execute(book_genres.delete())
    db.query(Book).delete()
    db.query(Genre).delete()
    db.query(User).delete()
    db.query(LibrarySettings).delete()
    db.commit()
    print("Database cleared!")

def main():
    db = SessionLocal()
    try:
        clear_database(db)
        seed_database(db)
    finally:
        db.close()

if __name__ == "__main__":
    main() 