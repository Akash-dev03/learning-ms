from sqlalchemy.orm import Session
from . import models, auth
from datetime import datetime

def create_sample_genres(db: Session):
    genres = [
        "Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Fantasy",
        "Romance", "Thriller", "Historical Fiction", "Biography", "Self-Help",
        "Science", "Technology", "Business", "Philosophy", "Poetry"
    ]
    
    db_genres = []
    for genre_name in genres:
        genre = models.Genre(name=genre_name)
        db.add(genre)
        db_genres.append(genre)
    
    db.commit()
    return db_genres

def create_sample_users(db: Session):
    users = [
        {"username": "Akash", "email": "admin@example.com", "password": "Password123!", "is_admin": True},
        {"username": "priya_sharma", "email": "priya@example.com", "password": "Password123!"},
        {"username": "arjun_patel", "email": "arjun@example.com", "password": "Password123!"},
        {"username": "zara_khan", "email": "zara@example.com", "password": "Password123!"},
        {"username": "vikram_singh", "email": "vikram@example.com", "password": "Password123!"},
        {"username": "neha_gupta", "email": "neha@example.com", "password": "Password123!"},
        {"username": "raj_malhotra", "email": "raj@example.com", "password": "Password123!"},
        {"username": "ananya_reddy", "email": "ananya@example.com", "password": "Password123!"},
        {"username": "aditya_joshi", "email": "aditya@example.com", "password": "Password123!"},
        {"username": "meera_iyer", "email": "meera@example.com", "password": "Password123!"}
    ]
    
    for user_data in users:
        is_admin = user_data.pop("is_admin", False)
        password = user_data.pop("password")
        db_user = models.User(
            **user_data,
            hashed_password=auth.get_password_hash(password),
            is_admin=is_admin
        )
        db.add(db_user)
    
    db.commit()

def create_sample_books(db: Session):
    books = [
        # Fiction - All copies available
        {
            "title": "The White Tiger",
            "author": "Aravind Adiga",
            "isbn": "9781416562603",
            "description": "A darkly humorous perspective of India's class struggle",
            "published_year": 2008,
            "publisher": "Free Press",
            "genres": ["Fiction"],
            "total_copies": 5,
            "available_copies": 5,
            "is_archived": False
        },
        # Fiction - Some copies borrowed
        {
            "title": "The God of Small Things",
            "author": "Arundhati Roy",
            "isbn": "9780679457312",
            "description": "The story of two fraternal twins whose lives are destroyed by society's 'Love Laws'",
            "published_year": 1997,
            "publisher": "Random House",
            "genres": ["Fiction"],
            "total_copies": 4,
            "available_copies": 2,
            "is_archived": False
        },
        # Mystery - Archived book
        {
            "title": "The Da Vinci Code",
            "author": "Dan Brown",
            "isbn": "9780385504201",
            "description": "A thrilling mystery involving symbology and religious conspiracies",
            "published_year": 2003,
            "publisher": "Doubleday",
            "genres": ["Mystery", "Thriller"],
            "total_copies": 6,
            "available_copies": 0,
            "is_archived": True
        },
        # Mystery - All copies borrowed
        {
            "title": "Gone Girl",
            "author": "Gillian Flynn",
            "isbn": "9780307588371",
            "description": "A woman's disappearance sets off a chain of suspenseful events",
            "published_year": 2012,
            "publisher": "Crown Publishing",
            "genres": ["Mystery", "Thriller"],
            "total_copies": 4,
            "available_copies": 0,
            "is_archived": False
        },
        # Science Fiction - Limited availability
        {
            "title": "Dune",
            "author": "Frank Herbert",
            "isbn": "9780441172719",
            "description": "A science fiction masterpiece about politics, religion, and ecology",
            "published_year": 1965,
            "publisher": "Ace Books",
            "genres": ["Science Fiction"],
            "total_copies": 5,
            "available_copies": 1,
            "is_archived": False
        },
        # Science Fiction - Archived (old edition)
        {
            "title": "Foundation",
            "author": "Isaac Asimov",
            "isbn": "9780553293357",
            "description": "The story of humans scattered across the Milky Way",
            "published_year": 1951,
            "publisher": "Gnome Press",
            "genres": ["Science Fiction"],
            "total_copies": 3,
            "available_copies": 0,
            "is_archived": True
        },
        # Fantasy - New arrival, fully available
        {
            "title": "The Name of the Wind",
            "author": "Patrick Rothfuss",
            "isbn": "9780756404741",
            "description": "A young man grows to become the most notorious wizard his world has ever seen",
            "published_year": 2007,
            "publisher": "DAW Books",
            "genres": ["Fantasy"],
            "total_copies": 4,
            "available_copies": 4,
            "is_archived": False
        },
        # Fantasy - Popular book, limited availability
        {
            "title": "A Game of Thrones",
            "author": "George R.R. Martin",
            "isbn": "9780553103540",
            "description": "The first book in the epic fantasy series A Song of Ice and Fire",
            "published_year": 1996,
            "publisher": "Bantam Books",
            "genres": ["Fantasy"],
            "total_copies": 6,
            "available_copies": 1,
            "is_archived": False
        },
        # Self-Help - New arrival
        {
            "title": "Atomic Habits",
            "author": "James Clear",
            "isbn": "9780735211292",
            "description": "Tiny Changes, Remarkable Results",
            "published_year": 2018,
            "publisher": "Avery",
            "genres": ["Self-Help"],
            "total_copies": 5,
            "available_copies": 5,
            "is_archived": False
        },
        # Self-Help/Business - Classic
        {
            "title": "The 7 Habits of Highly Effective People",
            "author": "Stephen R. Covey",
            "isbn": "9780671708634",
            "description": "Powerful lessons in personal change",
            "published_year": 1989,
            "publisher": "Free Press",
            "genres": ["Self-Help", "Business"],
            "total_copies": 4,
            "available_copies": 3,
            "is_archived": False
        },
        # Technology - High demand
        {
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "isbn": "9780132350884",
            "description": "A Handbook of Agile Software Craftsmanship",
            "published_year": 2008,
            "publisher": "Prentice Hall",
            "genres": ["Technology"],
            "total_copies": 3,
            "available_copies": 0,
            "is_archived": False
        },
        # Technology - Archived (outdated)
        {
            "title": "Design Patterns",
            "author": "Erich Gamma et al.",
            "isbn": "9780201633610",
            "description": "Elements of Reusable Object-Oriented Software",
            "published_year": 1994,
            "publisher": "Addison-Wesley",
            "genres": ["Technology"],
            "total_copies": 3,
            "available_copies": 3,
            "is_archived": True
        },
        # Business - New edition coming
        {
            "title": "Zero to One",
            "author": "Peter Thiel",
            "isbn": "9780804139298",
            "description": "Notes on Startups, or How to Build the Future",
            "published_year": 2014,
            "publisher": "Crown Business",
            "genres": ["Business"],
            "total_copies": 4,
            "available_copies": 2,
            "is_archived": False
        },
        # Business - Archived (outdated content)
        {
            "title": "Good to Great",
            "author": "Jim Collins",
            "isbn": "9780066620992",
            "description": "Why Some Companies Make the Leap...And Others Don't",
            "published_year": 2001,
            "publisher": "HarperBusiness",
            "genres": ["Business"],
            "total_copies": 3,
            "available_copies": 3,
            "is_archived": True
        },
        # Philosophy - Classic
        {
            "title": "The Republic",
            "author": "Plato",
            "isbn": "9780872201361",
            "description": "Plato's masterwork on justice, government, and the good life",
            "published_year": -380,
            "publisher": "Hackett Publishing",
            "genres": ["Philosophy"],
            "total_copies": 3,
            "available_copies": 2,
            "is_archived": False
        },
        # Philosophy - Limited edition
        {
            "title": "Beyond Good and Evil",
            "author": "Friedrich Nietzsche",
            "isbn": "9780679724650",
            "description": "Prelude to a Philosophy of the Future",
            "published_year": 1886,
            "publisher": "Vintage Books",
            "genres": ["Philosophy"],
            "total_copies": 2,
            "available_copies": 1,
            "is_archived": False
        }
    ]
    
    # Get all genres
    genres = {genre.name: genre for genre in db.query(models.Genre).all()}
    
    for book_data in books:
        genre_names = book_data.pop("genres")
        book = models.Book(
            **book_data
        )
        book.genres = [genres[name] for name in genre_names]
        db.add(book)
    
    db.commit()

def seed_database(db: Session):
    # Create sample data only if the database is empty
    if db.query(models.User).count() == 0:
        print("Creating sample users...")
        create_sample_users(db)
    
    if db.query(models.Genre).count() == 0:
        print("Creating sample genres...")
        create_sample_genres(db)
    
    if db.query(models.Book).count() == 0:
        print("Creating sample books...")
        create_sample_books(db)
    
    if db.query(models.LibrarySettings).count() == 0:
        print("Creating default library settings...")
        settings = models.LibrarySettings()
        db.add(settings)
        db.commit()
    
    print("Database seeding completed!") 