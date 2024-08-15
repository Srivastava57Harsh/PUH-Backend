# Plateup Backend

## Overview

The Plateup Backend is a Node.js application that serves as the backend for the Plateup platform. It is responsible for managing authentication, bookings, notifications, and speaker-related functionalities. The backend is built with Express, and it utilizes MongoDB as its database.

## API Documentation

**For detailed API documentation, including request and response formats, please refer to the [Postman API documentation](https://documenter.getpostman.com/view/19203184/2sA3s7i8hc#intro).**

## Table of Contents

- [Overview](#overview)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- **Authentication**: User registration, login, and OTP-based verification.
- **Bookings Management**: Allows users to book sessions with speakers.
- **Notifications**: Handles sending notifications to users and speakers via Google APIs.
- **Speakers Management**: Manages speaker profiles and information.
- **Payload Validation**: Uses a validation schema and service to validate payloads using yup.
- **Centralized Logging**: Uses a logger to log important events and errors.
- **Environment Configuration**: Easily configurable environment variables.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/) (v4.x or higher)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Srivastava57Harsh/PUH-Backend.git
   cd PUH-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

    Create a .env file in the root directory and add the necessary environment variables. Refer to the [Configuration](#configuration) section for details.

4. **Run the application:**

    ```bash
    npm run dev
    ```

    The server will start on the port specified in your .env file (default is 8080).

## Configuration

The application uses environment variables for configuration. These variables should be defined in a .env file in the root directory.

Example .env file:

```bash
NODE_ENV = 'development'
JWT_SECRET ='m@c-@nd-c#eese'
MONGODB_URI='mongodb://localhost/plateup'
PORT=3000
SALT = '10'
LOG_LEVEL='debug'
GMAIL_USER='plateuptask@gmail.com'
GMAIL_PASS='your pass'
GOOGLE_CLIENT_ID='your client id'
GOOGLE_CLIENT_SECRET='your cliet secret'
GOOGLE_REDIRECT_URI='http://localhost:8080'
GOOGLE_REFRESH_TOKEN='refresh token from auth code'
```

### Key variables

- NODE_ENV: The environment in which the app is running (development, production, etc.).
- PORT: The port on which the server runs.
- MONGODB_URI: The MongoDB connection string.
- JWT_SECRET: Secret key used for JWT token generation.
- SALT: Salt Level for encrypting passwords.
- LOG_LEVEL: Level of log used by winston.
- GMAIL_USER: Host user email.
- GMAIL_PASS: Host user app password (Not your email account password, refer google api docs).
- GOOGLE_CLIENT_ID: Web app client id generated from Google API developer portal.
- GOOGLE_CLIENT_SECRET: Web app client secret generated from Google API developer portal.
- GOOGLE_REDIRECT_URI: Redirect URL entered at the Google API developer portal.
- GOOGLE_REFRESH_TOKEN: Refresh token generated from Google Auth Code (Refer Google API docs)

## API Endpoints

### Authentication
- POST /api/auth/signup: Register a new user/speaker.
- POST /api/auth/login: Login with email and password.
- POST /api/auth/verify: Verify the OTP sent to the email id.
- POST /api/auth/resendotp: Resend the OTP to the email id.
- GET /api/auth/profile: Fetch profile details.

### Bookings
- POST /api/book: Book a session with a speaker.

### Notifications
- POST /api/notifications/sendmail: Send a notification mail to both user and speaker.
Speakers
- POST /api/notifications/calendarinvite: Send a calendar invite to both user and speaker.

### Speakers
- POST /api/speakers/setup: Setup a speaker profile.
- GET /api/speakers/list: Get a list of all speakers.


## License

This project is licensed under the MIT License - see the LICENSE file for details.
