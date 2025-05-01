from fastapi import FastAPI, Depends, HTTPException, status, Query, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr
from . import models, schemas, auth
from .database import engine, get_db
from sqlalchemy import or_, func, desc
import os
from dotenv import load_dotenv
import random

# Load environment variables
load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

def create_default_settings(db: Session):
    # Check if settings exist
    settings = db.query(models.LibrarySettings).first()
    if not settings:
        # Create default settings
        default_settings = models.LibrarySettings(
            library_name="Libra Mind Library",
            admin_email="admin@libramind.com",
            max_books_per_user=5,
            loan_period_days=14,
            allow_reservations=True,
            auto_renewals_enabled=False,
            two_factor_required=False,
            force_password_reset_days=90,
            log_admin_activity=True,
            session_timeout_minutes=30,
            email_notifications_enabled=True,
            notification_settings={
                "due_date": True,
                "overdue": True,
                "availability": True,
                "news": False
            },
            reminder_days=3
        )
        db.add(default_settings)
        db.commit()

app = FastAPI(
    title="Library Management System API",
    description="API for managing books, users, and loans in a library system",
    version="1.0.0"
)

# CORS middleware configuration
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add any other origins you need
]

# Add CORS middleware with more specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    create_default_settings(db)

# Auth routes
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@app.get("/users/me/profile", response_model=schemas.UserProfile)
def get_user_profile(current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    # Get loan counts
    active_loans = db.query(func.count(models.BookLoan.id)).filter(
        models.BookLoan.user_id == current_user.id,
        models.BookLoan.is_returned == False
    ).scalar()
    
    total_loans = db.query(func.count(models.BookLoan.id)).filter(
        models.BookLoan.user_id == current_user.id
    ).scalar()
    
    return {
        **current_user.__dict__,
        "active_loans_count": active_loans,
        "total_loans_count": total_loans
    }

@app.get("/users/me/loans", response_model=List[schemas.BookLoan])
def get_user_loans(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db),
    active_only: bool = True
):
    query = db.query(models.BookLoan).filter(models.BookLoan.user_id == current_user.id)
    if active_only:
        query = query.filter(models.BookLoan.is_returned == False)
    return query.order_by(models.BookLoan.borrowed_date.desc()).all()

@app.put("/users/me", response_model=schemas.User)
def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if user_update.email:
        # Check if email is already taken
        existing_user = db.query(models.User).filter(
            models.User.email == user_update.email,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
    
    if user_update.username:
        # Check if username is already taken
        existing_user = db.query(models.User).filter(
            models.User.username == user_update.username,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_update.username
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.put("/users/me/password")
def update_password(
    password_update: schemas.PasswordUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if not auth.verify_password(password_update.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    current_user.hashed_password = auth.get_password_hash(password_update.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

# Book routes
@app.get("/books/", response_model=List[schemas.Book])
def get_books(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    genre_id: Optional[int] = None,
    available_only: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    query = db.query(models.Book)
    
    if search:
        search = f"%{search}%"
        query = query.filter(
            or_(
                models.Book.title.ilike(search),
                models.Book.author.ilike(search),
                models.Book.description.ilike(search)
            )
        )
    
    if genre_id:
        query = query.filter(models.Book.genres.any(models.Genre.id == genre_id))
    
    if available_only:
        query = query.filter(models.Book.available_copies > 0)
    
    return query.offset(skip).limit(limit).all()

@app.get("/books/{book_id}", response_model=schemas.Book)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.post("/books/", response_model=schemas.Book)
def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    db_book = models.Book(**book.dict(exclude={'genre_ids'}))
    
    # Add genres
    genres = db.query(models.Genre).filter(models.Genre.id.in_(book.genre_ids)).all()
    db_book.genres = genres
    
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@app.delete("/books/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}

# Loan routes
@app.get("/loans/", response_model=List[schemas.BookLoan])
def get_user_loans(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    query = db.query(models.BookLoan).filter(models.BookLoan.user_id == current_user.id)
    
    if active_only:
        query = query.filter(models.BookLoan.is_returned == False)
    
    return query.offset(skip).limit(limit).all()

@app.post("/loans/", response_model=schemas.BookLoan)
def create_loan(
    loan: schemas.BookLoanCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if book exists and is available
    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="Book is not available")
    
    # Check if user already has an active loan for this book
    active_loan = db.query(models.BookLoan).filter(
        models.BookLoan.user_id == current_user.id,
        models.BookLoan.book_id == loan.book_id,
        models.BookLoan.is_returned == False
    ).first()
    
    if active_loan:
        raise HTTPException(
            status_code=400,
            detail="You already have an active loan for this book"
        )
    
    # Create loan
    db_loan = models.BookLoan(
        user_id=current_user.id,
        book_id=loan.book_id,
        due_date=datetime.utcnow() + timedelta(days=14)  # 2 weeks loan period
    )
    
    # Update book availability
    book.available_copies -= 1
    
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

@app.put("/loans/{loan_id}/return", response_model=schemas.BookLoan)
def return_book(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    loan = db.query(models.BookLoan).filter(
        models.BookLoan.id == loan_id,
        models.BookLoan.user_id == current_user.id
    ).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.is_returned:
        raise HTTPException(status_code=400, detail="Book already returned")
    
    # Update loan
    loan.is_returned = True
    loan.returned_date = datetime.utcnow()
    
    # Update book availability
    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    book.available_copies += 1
    
    db.commit()
    db.refresh(loan)
    return loan

# Review routes
@app.get("/books/{book_id}/reviews", response_model=List[schemas.Review])
def get_book_reviews(
    book_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    reviews = db.query(models.Review).filter(
        models.Review.book_id == book_id
    ).offset(skip).limit(limit).all()
    return reviews

@app.post("/reviews/", response_model=schemas.Review)
def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if book exists
    book = db.query(models.Book).filter(models.Book.id == review.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if user has already reviewed this book
    existing_review = db.query(models.Review).filter(
        models.Review.user_id == current_user.id,
        models.Review.book_id == review.book_id
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this book")
    
    db_review = models.Review(
        **review.dict(),
        user_id=current_user.id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

# Genre routes
@app.get("/genres/", response_model=List[schemas.Genre])
def get_genres(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    return db.query(models.Genre).all()

@app.post("/genres/", response_model=schemas.Genre)
def create_genre(
    genre: schemas.GenreBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    db_genre = models.Genre(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

@app.get("/users/", response_model=List[schemas.User])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    """
    Get all users. Only accessible by admin users.
    """
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# Settings routes
@app.get("/settings/", response_model=schemas.LibrarySettings)
def get_library_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    try:
        settings = db.query(models.LibrarySettings).first()
        if not settings:
            # Create default settings if they don't exist
            create_default_settings(db)
            settings = db.query(models.LibrarySettings).first()
        return settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch library settings"
        )

@app.put("/settings/", response_model=schemas.LibrarySettings)
def update_library_settings(
    settings_update: schemas.UpdateLibrarySettings,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    try:
        settings = db.query(models.LibrarySettings).first()
        if not settings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Settings not found"
            )
        
        # Update only provided fields
        for field, value in settings_update.dict(exclude_unset=True).items():
            setattr(settings, field, value)
        
        db.commit()
        db.refresh(settings)
        return settings
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update library settings"
        )

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    book_recommendations: Optional[List[Dict]] = None

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Convert message to lowercase for easier matching
    query = message.message.lower()
    
    # Initialize response
    response = ""
    recommendations = []
    
    # Helper function to get book recommendations
    def get_book_recommendations(genres: List[str], limit: int = 3) -> List[Dict]:
        try:
            # First, get all available genres that match our input (case-insensitive)
            available_genres = (
                db.query(models.Genre)
                .filter(func.lower(models.Genre.name).in_([g.lower() for g in genres]))
                .all()
            )
            
            if not available_genres:
                # Fallback to random books if no matching genres
                books = (
                    db.query(models.Book)
                    .filter(
                        models.Book.is_archived == False,
                        models.Book.available_copies > 0
                    )
                    .order_by(func.random())
                    .limit(limit)
                    .all()
                )
            else:
                # Get books from matching genres
                books = (
                    db.query(models.Book)
                    .join(models.book_genres)
                    .join(models.Genre)
                    .filter(
                        models.Genre.id.in_([g.id for g in available_genres]),
                        models.Book.is_archived == False,
                        models.Book.available_copies > 0
                    )
                    .order_by(func.random())
                    .limit(limit)
                    .all()
                )

            return [
                {
                    "title": book.title,
                    "author": book.author,
                    "genres": [genre.name for genre in book.genres],
                    "available_copies": book.available_copies,
                    "description": book.description
                }
                for book in books
            ]
        except Exception as e:
            print(f"Error in get_book_recommendations: {str(e)}")
            return []

    # Check for recommendation requests with more variations
    if any(keyword in query for keyword in [
        "recommend", "suggestion", "suggest", "what should i read", 
        "looking for", "can you recommend", "show me", "find me"
    ]):
        if any(genre in query for genre in ["fiction", "novel", "story", "stories"]):
            response = "Here are some fiction books you might enjoy:"
            recommendations = get_book_recommendations(["Fiction", "Fantasy", "Science Fiction"])
        
        elif any(genre in query for genre in ["non-fiction", "nonfiction", "real", "factual"]):
            response = "Here are some non-fiction recommendations:"
            recommendations = get_book_recommendations(["Non-Fiction", "Self-Help", "Business"])
        
        elif any(genre in query for genre in ["mystery", "thriller", "suspense", "crime"]):
            response = "Check out these exciting mystery and thriller books:"
            recommendations = get_book_recommendations(["Mystery", "Thriller"])
        
        elif any(genre in query for genre in ["science fiction", "sci-fi", "scifi", "science", "space"]):
            response = "Here are some great science fiction titles:"
            recommendations = get_book_recommendations(["Science Fiction"])
        
        elif any(genre in query for genre in ["business", "management", "entrepreneurship"]):
            response = "These business books might interest you:"
            recommendations = get_book_recommendations(["Business"])
        
        elif any(genre in query for genre in ["fantasy", "magic", "adventure"]):
            response = "Here are some fantastic fantasy books:"
            recommendations = get_book_recommendations(["Fantasy"])
        
        elif any(genre in query for genre in ["self-help", "personal development", "motivation"]):
            response = "Here are some self-improvement books that might help:"
            recommendations = get_book_recommendations(["Self-Help"])
        
        elif "horry" in query or "horror" in query:
            response = "I apologize, but we focus on educational and general interest books. Here are some exciting mystery/thriller books instead:"
            recommendations = get_book_recommendations(["Mystery", "Thriller"])
        
        else:
            # General recommendations
            response = "Here are some popular books you might enjoy:"
            recommendations = get_book_recommendations(["Fiction", "Non-Fiction", "Mystery"])

        # If no recommendations were found, provide a fallback
        if not recommendations:
            response = "I found some interesting books you might like:"
            recommendations = get_book_recommendations(["Fiction", "Non-Fiction"], limit=5)

        # Add more context to the response if we have recommendations
        if recommendations:
            response += "\n\nI've selected these based on availability and ratings:"
        else:
            response = "I apologize, but I couldn't find any books matching your interests right now. Please try a different genre or ask about our available categories."

    # Check for library-related queries
    elif "how" in query and "borrow" in query:
        response = "To borrow a book: \n1. Browse our catalog \n2. Select the book you want \n3. Click 'Borrow' \n4. Pick up from the library within 24 hours"
    
    elif "return" in query and "book" in query:
        response = "To return a book: \n1. Bring it to the library desk \n2. Or use the self-service return kiosk \n3. Make sure to return before the due date to avoid fines"
    
    elif "opening" in query and ("hours" in query or "time" in query):
        response = "Library Hours:\nMonday-Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: Closed"
    
    elif "fine" in query or "fees" in query:
        response = "Late return fees are $0.50 per day per book. Maximum fine is $10 per book. Fines can be paid at the library desk or online."
    
    elif "membership" in query:
        response = "Library membership is free for all residents. Just bring a valid ID and proof of address to register."
    
    elif "lost" in query and "book" in query:
        response = "If you've lost a book, please report it immediately. You may need to pay the replacement cost. Contact the librarian for more details."
    
    # Search for specific books
    elif "find" in query or "search" in query or "looking for" in query:
        search_terms = query.replace("find", "").replace("search", "").replace("looking for", "").strip()
        if search_terms:
            books = (
                db.query(models.Book)
                .filter(
                    or_(
                        models.Book.title.ilike(f"%{search_terms}%"),
                        models.Book.author.ilike(f"%{search_terms}%")
                    ),
                    models.Book.is_archived == False
                )
                .limit(3)
                .all()
            )
            if books:
                response = "I found these books matching your search:"
                recommendations = [
                    {
                        "title": book.title,
                        "author": book.author,
                        "genres": [genre.name for genre in book.genres],
                        "available_copies": book.available_copies
                    }
                    for book in books
                ]
            else:
                response = "I couldn't find any books matching your search. Try different keywords or ask for recommendations in a specific genre."
    
    # Default response
    else:
        response = "Hello! I'm your library assistant. I can help you with:\n" \
                  "- Book recommendations\n" \
                  "- Finding specific books\n" \
                  "- Information about borrowing and returning\n" \
                  "- Library hours and policies\n" \
                  "- Membership questions\n\n" \
                  "What would you like to know?"

    return ChatResponse(
        response=response,
        book_recommendations=recommendations if recommendations else None
    ) 