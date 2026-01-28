# Sublea Backend Onboarding Report

## 1. Tech Stack

**Core Framework:**
- **FastAPI** (v0.109.0) - Main REST API framework
- **SQLAlchemy** (v2.0.25) - ORM for database interactions
- **Uvicorn** - ASGI server for running FastAPI

**Authentication & Security:**
- **python-jose[cryptography]** (v3.3.0) - JWT token handling
- **passlib[bcrypt]** (v1.7.4) - Password hashing
- **email-validator** (v2.3.0) - Email validation

**Additional Libraries:**
- **sendgrid** (v6.11.0) - Email service for sending emails
- **profanity-check** (v1.0.3) - Content moderation
- **googlemaps** (v4.10.0) - Geocoding API integration
- **jinja2** (v3.1.3) - Email templates
- **python-dotenv** - Environment variable management
- **pytest** + **pytest-asyncio** + **httpx** - Testing framework

**Database:**
- SQLAlchemy ORM (supports PostgreSQL, currently using SQLite for local dev per developer notes)

---

## 2. Project Structure

```
sublea/backend/
├── app.py                 # Main FastAPI application entry point
├── database.py            # Database configuration & session management
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container configuration
└── auth/                 # Authentication module
    ├── __init__.py       # (empty - module initializer)
    ├── models.py         # ✅ Database models (User, Listing, Message, Verification)
    ├── routes.py         # ⚠️ Empty (routes not implemented yet)
    ├── schemas.py        # ⚠️ Empty (Pydantic schemas not implemented yet)
    └── utils.py          # ⚠️ Empty (auth utilities not implemented yet)
```

**Current State:**
- ✅ Database models are fully defined in `auth/models.py`
- ⚠️ Routes, schemas, and utilities are not yet implemented (files are empty)
- ✅ Only the root endpoint exists in `app.py`

---

## 3. API Documentation

### Currently Implemented Endpoints:

#### **GET /** (Root/Health Check)
- **Method:** `GET`
- **Path:** `/`
- **Request:** None
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "Sublea Backend API is running."
  }
  ```

**Note:** Authentication, listing, and messaging endpoints are not yet implemented. The backend is in early setup phase.

---

## 4. Authentication

**Expected Implementation (based on dependencies):**
- JWT tokens using python-jose
- Password hashing with bcrypt (passlib)
- Email verification flow (Verification model exists)

**Current Status:** ⚠️ **Not yet implemented** - `auth/routes.py`, `auth/schemas.py`, and `auth/utils.py` are empty.

**Expected Pattern (when implemented):**
- JWT tokens likely sent in `Authorization: Bearer <token>` header
- Login endpoint to receive credentials and return JWT
- Protected endpoints requiring valid JWT

**Recommendation:** Coordinate with backend team on exact authentication flow before frontend implementation.

---

## 5. Database Models

Four main models are defined in `auth/models.py`:

### **User**
```python
- id: Integer (PK)
- email: String (unique, indexed)
- password_hash: String
- is_verified: Boolean (default: False)
- created_at: DateTime
```
**Relationships:**
- One-to-many with `Listing` (owner)
- One-to-many with `Message` (messages_sent, messages_received)
- One-to-many with `Verification`

### **Listing**
```python
- id: Integer (PK)
- user_id: Integer (FK → users.id)
- title: String(100)
- description: Text
- rent: Float
- address: String(200)
- latitude: Float (nullable)
- longitude: Float (nullable)
- bedrooms: Integer
- bathrooms: Integer
- roommate_count: Integer (default: 0)
- available_from: DateTime
- available_to: DateTime (nullable)
- images: Text (nullable) - Comma-separated image URLs
- created_at: DateTime
- deleted_at: DateTime (nullable) - Soft delete support
```
**Relationships:**
- Many-to-one with `User` (owner)
- One-to-many with `Message`

### **Message**
```python
- id: Integer (PK)
- sender_id: Integer (FK → users.id)
- recipient_id: Integer (FK → users.id)
- listing_id: Integer (FK → listings.id)
- content: Text
- sent_at: DateTime
- read: Boolean (default: False)
```
**Relationships:**
- Many-to-one with `User` (sender, recipient)
- Many-to-one with `Listing`

### **Verification**
```python
- id: Integer (PK)
- user_id: Integer (FK → users.id)
- code: String(6) - 6-digit verification code
- expires_at: DateTime
- verified: Boolean (default: False)
- created_at: DateTime
```
**Relationships:**
- Many-to-one with `User`

**Key Points:**
- Cascade deletes: Deleting a User will cascade delete related Listings, Messages, and Verifications
- Soft delete: Listings use `deleted_at` field for soft delete functionality
- Geocoding: Listings store `latitude`/`longitude` for map features
- Image storage: `images` field stores comma-separated URLs (not binary data)

---

## 6. Local Development Setup

**Prerequisites:**
- Python 3.11+
- Virtual environment

**Steps:**

1. **Navigate to backend directory:**
   ```bash
   cd sublea/backend
   ```

2. **Deactivate conda if active:**
   ```bash
   conda deactivate
   ```

3. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   ```

4. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

5. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Set up environment variables:**
   Create a `.env` file in `sublea/backend/` with:
   ```env
   DATABASE_URL=sqlite:///./sublea.db
   ```
   (For local SQLite) or use PostgreSQL:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/sublea
   ```

7. **Start the server:**
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

   The server will run at: `http://localhost:8000`

8. **Access API Documentation:**
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

**Note:** The database tables are created automatically on first run via `Base.metadata.create_all(bind=engine)` in `app.py`.

---

## Summary & Next Steps

**Current State:**
- ✅ Backend foundation is set up
- ✅ Database models are fully defined
- ⚠️ API endpoints are not yet implemented
- ⚠️ Authentication is not yet implemented

**Recommended Actions:**
1. ✅ Set up local development environment
2. ✅ Test the root endpoint to confirm connectivity
3. ⏳ Coordinate with backend team on endpoint implementation timeline
4. ⏳ Wait for route implementations before building frontend API integration
5. ⏳ Discuss API contract/design with backend team

**Questions for Backend Team:**
- When will authentication endpoints be ready?
- What will the listing CRUD endpoints look like?
- What will the messaging endpoints look like?
- What is the expected JWT token structure and expiration?

The foundation is solid, but most endpoints are pending implementation. Coordinate with the backend team on the implementation timeline before building frontend API integration.
