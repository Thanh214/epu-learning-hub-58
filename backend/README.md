# EPU Learning Hub Backend

This is the backend API for the EPU Learning Hub built with Node.js and Express.

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MySQL (via XAMPP)

### Database Setup
1. Start XAMPP and ensure MySQL is running
2. Create a database named `epu_learning_hub`
3. Import the database structure from `database.sql`

### Installation

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=epu_learning_hub
JWT_SECRET=your_secret_key_here
PORT=5000
```

3. Start the development server:
```
npm run dev
```

## Troubleshooting

If you encounter issues with the database:

1. Make sure XAMPP is running and MySQL service is active
2. Check that the database `epu_learning_hub` exists in phpMyAdmin
3. Run the database check utility to diagnose issues:
```
node utils/dbCheck.js
```
4. If the table structure is missing, you can manually import the SQL file:
```
mysql -u root -p epu_learning_hub < database.sql
```
5. Verify your database credentials in the `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (requires authentication)

## Authentication

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
``` 