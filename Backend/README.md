# ZeroFoodWaste Backend API

A comprehensive Node.js + Express + MongoDB backend for the ZeroFoodWaste application that connects donors, NGOs, and volunteers to reduce food wastage.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Food Donation Management**: Complete CRUD operations for food donations
- **Location-Based Matching**: Find nearby NGOs and volunteers using geolocation
- **Achievement System**: Points, badges, and achievements for user engagement
- **Leaderboard**: Role-based leaderboards to encourage participation
- **Notification System**: Real-time notifications for important events
- **Admin Panel**: Admin routes for user and donation management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/zerofoodwaste
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   UPLOAD_PATH=uploads/
   MAX_FILE_SIZE=5242880
   MATCHING_RADIUS=10
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js          # Database connection
│   │   └── env.js         # Environment variables
│   ├── models/            # MongoDB models
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   ├── app.js             # Express app configuration
│   └── server.js          # Server entry point
├── .env                   # Environment variables (create from .env.example)
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "DONOR",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090,
    "address": "New Delhi, India"
  },
  "phone": "+91 1234567890"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Private |
| PUT | `/api/users/:id` | Update user profile | Private |
| PUT | `/api/users/:id/status` | Update user status | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Food Donations (`/api/donations`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/donations` | Create donation | Donor |
| GET | `/api/donations` | Get all donations | Private |
| GET | `/api/donations/:id` | Get donation by ID | Private |
| PUT | `/api/donations/:id` | Update donation | Donor/Admin |
| PUT | `/api/donations/:id/accept` | Accept donation | NGO |
| PUT | `/api/donations/:id/complete` | Complete donation | Donor/Volunteer/Admin |
| PUT | `/api/donations/:id/cancel` | Cancel donation | Donor/Admin |
| DELETE | `/api/donations/:id` | Delete donation | Donor/Admin |

**Create Donation Request Body:**
```json
{
  "foodType": "Vegetables",
  "quantity": "5 kg",
  "expiryDate": "2024-12-31T23:59:59.000Z",
  "description": "Fresh vegetables",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090,
    "address": "New Delhi, India"
  },
  "images": ["image1.jpg", "image2.jpg"]
}
```

### Matching (`/api/matching`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/matching/nearby-ngos` | Find nearby NGOs | Private |
| GET | `/api/matching/nearby-volunteers` | Find nearby volunteers | Private |
| GET | `/api/matching/nearby-donations` | Find nearby donations | Private |
| POST | `/api/matching/assign-volunteer` | Assign volunteer to donation | NGO/Admin |
| GET | `/api/matching/my-assignments` | Get my assignments | Volunteer |
| PUT | `/api/matching/assignments/:id/status` | Update assignment status | Volunteer |

**Query Parameters for nearby searches:**
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: Radius in km (optional, default: 10)

**Assign Volunteer Request Body:**
```json
{
  "donationId": "donation_id_here",
  "volunteerId": "volunteer_id_here"
}
```

### Achievements (`/api/achievements`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/achievements` | Get user achievements | Private |
| GET | `/api/achievements/badges` | Get user badges | Private |
| GET | `/api/achievements/stats` | Get user stats | Private |

**Query Parameters:**
- `userId`: User ID (optional, defaults to current user)
- `type`: Achievement type filter (optional)
- `badgeType`: Badge type filter (optional)

### Leaderboard (`/api/leaderboard`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/leaderboard` | Get leaderboard by role | Private |
| GET | `/api/leaderboard/my-rank` | Get my rank | Private |
| GET | `/api/leaderboard/top` | Get top users | Private |

**Query Parameters:**
- `role`: DONOR, NGO, or VOLUNTEER (default: DONOR)
- `limit`: Number of results (default: 100)

### Notifications (`/api/notifications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notifications` | Get user notifications | Private |
| GET | `/api/notifications/unread-count` | Get unread count | Private |
| PUT | `/api/notifications/:id/read` | Mark as read | Private |
| PUT | `/api/notifications/read-all` | Mark all as read | Private |
| DELETE | `/api/notifications/:id` | Delete notification | Private |

**Query Parameters:**
- `unreadOnly`: true/false (default: false)
- `limit`: Number of results (default: 50)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 👥 User Roles

- **DONOR**: Can create and manage food donations
- **NGO**: Can accept donations and assign volunteers
- **VOLUNTEER**: Can pick up and complete donations
- **ADMIN**: Full access to all resources

## 📊 Points System

Points are automatically awarded for:
- **Donation Created**: 10 points (Donor)
- **Donation Accepted**: 5 points (Donor)
- **Pickup Completed**: 15 points (Volunteer)
- **Donation Completed**: 20 points (Donor), 25 points (Volunteer)
- **Achievements**: Varies (5-500 points)
- **Milestones**: 25-500 points based on count

## 🏆 Achievement System

Achievements are automatically unlocked based on:
- Number of donations/pickups
- Streak days
- Milestone completions
- Special events

## 📍 Location-Based Matching

The system uses geolocation to:
- Find NGOs within a specified radius
- Find volunteers near donation locations
- Match donations with nearby recipients
- Calculate distances using Haversine formula

## 🔔 Notifications

Notifications are automatically created for:
- Donation accepted
- Volunteer assigned
- Badge earned
- Points earned
- Donation completed

## 🧪 Testing

### Sample API Calls

**Register a Donor:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "donor@example.com",
    "password": "password123",
    "role": "DONOR",
    "location": {
      "lat": 28.6139,
      "lng": 77.2090,
      "address": "New Delhi"
    }
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "password": "password123"
  }'
```

**Create Donation (with token):**
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "foodType": "Vegetables",
    "quantity": "5 kg",
    "expiryDate": "2024-12-31T23:59:59.000Z",
    "description": "Fresh vegetables",
    "location": {
      "lat": 28.6139,
      "lng": 77.2090,
      "address": "New Delhi"
    }
  }'
```

## 🐛 Error Handling

The API uses centralized error handling with appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection
- CORS configuration

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/zerofoodwaste |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration | 7d |
| EMAIL_HOST | Email server host | smtp.gmail.com |
| EMAIL_PORT | Email server port | 587 |
| EMAIL_USER | Email username | - |
| EMAIL_PASS | Email password | - |
| MATCHING_RADIUS | Default matching radius (km) | 10 |

## 🚀 Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `JWT_SECRET` with a strong secret key
3. Configure MongoDB connection string
4. Set up email credentials (optional)
5. Run `npm start`

## 📄 License

ISC

## 👨‍💻 Development

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Wire up routes in `src/app.js`
5. Add middleware if needed

### Code Style

- Use async/await for async operations
- Keep controllers thin, move logic to services
- Use meaningful variable names
- Add comments for complex logic
- Follow RESTful API conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.

