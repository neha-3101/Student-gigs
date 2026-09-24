# Student-Gigs

Student-Gigs is a full-stack web application that connects students with opportunities to offer and request services within a student community.

The platform allows users to create gigs, browse available services, send service requests, communicate with other users, and manage their own gigs and requests.

## Features

- User registration and login
- User authentication and authorization
- Create and manage gigs
- Browse available student services
- Search and filter gigs by category
- View detailed gig information
- Send and manage service requests
- Real-time chat between users
- Notifications for requests and messages
- Image upload support
- Service and request status tracking
- Responsive React-based interface

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS
- React Router
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Multer for file uploads

## Project Structure

```text
Student-Gigs/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── db_seed.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB / MongoDB Atlas
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/neha-3101/Student-gigs.git
cd Student-gigs
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

Use the actual variable names required by the backend configuration.

> Never commit your `.env` file to GitHub.

### 4. Start the Backend

From the `backend` directory:

```bash
npm start
```

If the project uses the development script instead:

```bash
npm run dev
```

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The Vite development server will provide a local URL, usually:

```text
http://localhost:5173
```

## Database

Student-Gigs uses MongoDB for storing application data.

The backend connects to MongoDB using the connection string provided through the environment variables.

The application uses MongoDB models for managing:

- Users
- Gigs
- Service Requests
- Messages

## Authentication

The application uses token-based authentication to protect user-specific functionality.

Authentication is used for operations such as:

- Account registration
- Login
- Creating gigs
- Managing personal gigs
- Sending service requests
- Messaging
- Accessing protected resources

## Real-Time Communication

Socket.IO is used to support real-time communication features such as chat and notifications.

## API

The backend exposes REST API endpoints for:

- Authentication
- Gigs
- Service Requests
- Messages

The frontend communicates with these APIs through the backend service.

## Security

Sensitive configuration values such as:

- MongoDB credentials
- JWT secrets
- API keys

are stored in environment variables and excluded from version control using `.gitignore`.

## Development

To work on the project locally:

1. Start the backend server.
2. Start the frontend development server.
3. Make changes to the relevant frontend or backend files.
4. Test the functionality locally.
5. Commit and push changes to GitHub.

Example:

```bash
git add .
git commit -m "Describe your changes"
git push
```

## Contributors

- Neha Arora
- Kamlesh Patel
