import uvicorn
from app.main import app
from app.initial_data import init_db

if __name__ == "__main__":
    # Initialize the database with sample data
    init_db()
    
    # Run the application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,  # Enable auto-reload
        ssl_keyfile=None,  # Add SSL configuration if needed
        ssl_certfile=None,
    ) 