# 📰 News Aggregator API

## 📘 Overview
This is a simple News Aggregator API built with **Node.js** and **Express.js**.  
It allows users to:
- Register and log in securely (JWT authentication)
- Save and update their news preferences (country & category)
- Fetch the latest news articles using the **NewsAPI**
- Cache results to reduce API calls

---

##  Installation

### 1️ Clone the Repository
```bash
git clone <your_repo_url>
cd news-aggregator-api
2️ Install Dependencies
bash
Copy code
npm install
3️ Create .env File
Inside your project folder, create a .env file and add:

ini
Copy code
JWT_SECRET=yourSecretKey
NEWS_API_KEY=yourNewsAPIkey
PORT=3000
4️ Run the Server
bash
Copy code
node app.js
Your server will start at: http://localhost:3000

🔐 Authentication APIs
👉 Register User
POST /api/auth/register

Body (JSON):

json
Copy code
{
  "username": "lokesh",
  "email": "lokesh@example.com",
  "password": "mypassword"
}
Response:

json
Copy code
{
  "message": "User registered successfully"
}
 Login User
POST /api/auth/login

Body (JSON):

json
Copy code
{
  "username": "lokesh",
  "password": "mypassword"
}
Response:

json
Copy code
{
  "token": "JWT_TOKEN",
  "preferences": {
    "country": "us",
    "category": "general"
  }
}
 Preferences APIs
 Get Preferences
GET /api/preferences

Header:

makefile
Copy code
Authorization: Bearer <JWT_TOKEN>
Response:

json
Copy code
{
  "country": "us",
  "category": "technology"
}
 Update Preferences
PUT /api/preferences

Header:

makefile
Copy code
Authorization: Bearer <JWT_TOKEN>
Body (JSON):

json
Copy code
{
  "country": "us",
  "category": "business"
}
Response:

json
Copy code
{
  "message": "Preferences updated successfully",
  "preferences": {
    "country": "us",
    "category": "business"
  }
}
 News APIs
 Fetch News
GET /api/news

Header:

makefile
Copy code
Authorization: Bearer <JWT_TOKEN>
Response:

json
Copy code
[
  {
    "title": "Latest Tech Updates",
    "author": "BBC News",
    "url": "https://bbc.com/...",
    "publishedAt": "2025-10-19T10:00:00Z"
  }
]
 Caching
The app caches news articles for each user’s preferences for 5 minutes to minimize external API requests.
If you request the same category within 5 minutes, results are served from the cache.

 Testing
Using Postman
Register → Login → Copy the JWT token.

Add Authorization: Bearer <your_token> in headers.

Test:

GET /api/preferences

PUT /api/preferences

GET /api/news (run twice quickly to see cache effect)

Using npm test (if tests exist)
bash
Copy code
npm run test
 Dependencies
express

axios

bcrypt

jsonwebtoken

dotenv

nodemon (dev)

Author
Lokesh Varkala
lokeshvarkala@gmail.com