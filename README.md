# ORYN — Full-Stack E-Commerce Platform

> A production-deployed full-stack e-commerce platform built with React, Node.js, Express, MongoDB, Cloudinary, and Razorpay, featuring responsive shopping, secure authentication, cloud-based media management, online payments, order management, and an analytics-driven admin dashboard.

---

## Overview

**ORYN** is a full-stack e-commerce platform built to provide a complete online shopping experience alongside a dedicated administrative management and analytics system.

Customers can browse products, filter the catalogue, view product details, manage their cart, proceed through checkout, make payments through Razorpay, view their order history, update their profile, and securely change their password.

The platform integrates **Cloudinary** for cloud-based image management and **Razorpay** for payment processing, making ORYN a practical full-stack e-commerce implementation rather than a simple CRUD application.

The administrative dashboard provides product management and business analytics including product statistics, current-year income, lifetime income, and product-wise revenue/performance.

A key data-modeling decision in ORYN is the preservation of product information inside order records. This allows historical order and revenue analytics to remain meaningful even when a product is later removed from the active product catalogue.

The application was developed locally, tested across its major workflows, and deployed as separate frontend and backend services on **Render**, with **MongoDB Atlas** providing persistent database storage.

---

## Key Features

### Authentication & User Accounts

- User registration
- User login and logout
- JWT-based authentication
- Protected backend routes
- Authentication middleware
- Secure password hashing with bcrypt
- Profile management
- Profile picture upload
- Authenticated password change
- Client-side authentication state management
- Environment-based API configuration

The current registration flow creates the user directly and does not depend on email verification or OTP delivery.

Password changes are handled from the authenticated user's Profile page through the dedicated **Password** tab.

---

### Product Discovery

- Product listing
- Product detail pages
- Product cards
- Product filtering
- Responsive product browsing
- Pagination
- Product-focused sections on the home page
- Responsive desktop and mobile layouts
- Navigation between product discovery and product details

---

### Shopping Cart

- Add products to cart
- Remove products from cart
- Update product quantities
- Cart total calculation
- Cart-to-checkout workflow
- Responsive cart interface

---

### Checkout & Razorpay Payments

ORYN integrates **Razorpay** as the payment gateway for the checkout workflow.

Implemented payment functionality includes:

- Razorpay payment gateway integration
- Payment initiation from checkout
- Backend payment/order handling
- Payment response handling
- Payment status tracking
- Payment method information
- Order creation associated with checkout
- Payment-aware order records

The payment layer is integrated with the order workflow while sensitive Razorpay credentials remain server-side through environment variables.

---

### Orders

- Order creation
- Order history
- Order status
- Payment status
- Payment method information
- Order total calculation
- Product quantity tracking
- Historical product information retained with orders
- User-specific order retrieval

Historical order data is independent of the currently active product catalogue. This allows previously generated revenue and order records to remain available for analytics even if a product is removed later.

---

### Cloudinary Media Management

ORYN uses **Cloudinary** for cloud-based image management rather than relying exclusively on local filesystem storage.

The implementation supports:

- Cloud-based image uploads
- Product image management
- Profile image uploads
- Cloud-hosted image URLs
- Backend-managed media handling
- Persistent image references stored with application data

This keeps uploaded media accessible independently of the deployed application server.

---

### User Profile

The Profile section is organized into dedicated tabs:

#### Profile

- First name
- Last name
- Email
- Phone number
- Address
- City
- ZIP code
- Profile picture
- Profile update functionality

#### Orders

- Previous orders
- Order IDs
- Product information
- Quantities
- Order status
- Payment status
- Payment method
- Total amount

#### Password

- Current password verification
- New password
- Password confirmation
- Authenticated password update
- Password validation feedback

---

### Admin Dashboard

The admin dashboard provides administrative product and business insights.

#### Product Management

- Product overview
- Product management
- Product-related information
- Administrative product interface

#### Analytics

- Total product overview
- Current-year income
- Lifetime income
- Product-wise analytics
- Historical revenue analysis
- Revenue derived from persisted order data

The analytics interface separates general dashboard information from detailed product statistics to keep the admin experience organized.

---

### Responsive UI

ORYN was designed for both desktop and mobile environments.

Responsive work includes:

- Mobile-friendly navigation
- Responsive product cards
- Responsive filtering
- Mobile product browsing
- Responsive profile pages
- Responsive order history
- Responsive checkout
- Mobile-friendly home page content
- Adaptive spacing and layouts
- Responsive admin interface

---

## Technology Stack

### Frontend

- **React.js**
- **Vite**
- **JavaScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Redux**
- **Axios**
- **React Router**
- **Lucide React**
- **Sonner**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT**
- **bcrypt**
- **CORS**
- **dotenv**
- **Multer**

### Cloud, Payments & Deployment

- **MongoDB Atlas** — Cloud database
- **Cloudinary** — Cloud-based image/media management
- **Razorpay** — Payment gateway
- **Render** — Production deployment
- **Git**
- **GitHub**
- **Postman**

---

## Application Architecture

ORYN follows a client-server architecture with a separate frontend and backend and integrations with external cloud services.

```text
                         ┌────────────────────────┐
                         │        ORYN UI         │
                         │      React + Vite      │
                         └───────────┬────────────┘
                                     │
                                     │ REST API
                                     │ JWT
                                     ▼
                         ┌────────────────────────┐
                         │     Express Server     │
                         │        Node.js         │
                         └───────────┬────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
   Authentication              Products / Cart             Orders /
     Middleware                 / Checkout / Users         Analytics
          │                          │                          │
          └──────────────────────────┼──────────────────────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
          MongoDB Atlas          Cloudinary           Razorpay
          Data Storage           Media Storage        Payments
```

### Frontend Responsibilities

The React frontend handles:

- UI rendering
- Navigation
- Authentication state
- Product browsing
- Filtering
- Cart interactions
- Checkout interactions
- Razorpay payment initiation
- Profile management
- Order presentation
- Admin dashboard presentation
- API communication
- Responsive layouts
- Loading and error states

### Backend Responsibilities

The Node.js/Express backend handles:

- REST API routing
- Authentication
- Authorization
- JWT validation
- User operations
- Password operations
- Product operations
- Cart and order operations
- Checkout/payment operations
- Razorpay integration
- Cloudinary integration
- Business logic
- Database interaction
- File upload handling
- Analytics data processing

### External Services

| Service | Purpose |
|---|---|
| MongoDB Atlas | Persistent application data |
| Cloudinary | Cloud-based image storage and delivery |
| Razorpay | Online payment processing |
| Render | Frontend and backend deployment |

---

## Project Structure

```text
Oryn-ecommerce/
│
├── frontend/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── EmailVerify/
│   ├── database/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> The structure above represents the major application layers. Individual directories may contain additional project-specific files.

---

## Authentication Architecture

ORYN uses JWT-based authentication for protected resources.

### Registration

```text
User
 │
 │ Registration details
 ▼
React Signup Form
 │
 │ POST request
 ▼
Express API
 │
 ▼
User Controller
 │
 ▼
Password hashed with bcrypt
 │
 ▼
User stored in MongoDB
 │
 ▼
Account created
 │
 ▼
Login
```

The current signup implementation intentionally does not require email verification or OTP delivery.

### Login

```text
User
 │
 │ Email + Password
 ▼
React Login Form
 │
 │ POST request
 ▼
Express API
 │
 ▼
User lookup
 │
 ▼
bcrypt comparison
 │
 ├── Invalid → Error
 │
 └── Valid
       │
       ▼
   JWT generated
       │
       ▼
Returned to client
       │
       ▼
Authentication state
       │
       ▼
Protected API requests
```

### Password Change

```text
Profile
 │
 ▼
Password Tab
 │
 ▼
Current Password
New Password
Confirm Password
 │
 │ Authenticated request
 ▼
Authentication Middleware
 │
 ▼
Current Password Verification
 │
 ▼
New Password Hash
 │
 ▼
Database Update
 │
 ▼
Password Changed
```

---

## Payment Architecture

Razorpay is integrated into the checkout and order workflow.

```text
Customer
   │
   ▼
Checkout Page
   │
   │ Payment initiation
   ▼
Backend API
   │
   ▼
Razorpay
   │
   ▼
Payment Interface
   │
   ▼
Payment Response
   │
   ▼
Backend Order Handling
   │
   ▼
MongoDB Order Record
```

The frontend manages the customer-facing payment interaction, while the backend handles payment-related server operations and sensitive configuration.

Razorpay credentials are stored through environment variables and are never committed to the repository.

---

## Cloudinary Media Architecture

Cloudinary separates application media storage from the deployed application server.

```text
User/Admin
   │
   │ Image Upload
   ▼
React Frontend
   │
   ▼
Express Backend
   │
   ▼
Cloudinary
   │
   ▼
Hosted Image URL
   │
   ▼
Application Data
```

This makes uploaded product and profile images independent of the local filesystem of the Render server.

---

## Security

ORYN incorporates several security practices:

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Authentication middleware
- Authenticated password changes
- Environment variables for sensitive configuration
- `.env` excluded from version control
- MongoDB Atlas credentials kept outside source code
- JWT secrets kept outside source code
- Razorpay credentials kept outside source code
- Cloudinary credentials kept outside source code
- API URLs configured through environment variables
- CORS configuration between frontend and backend

### Frontend Environment

```env
VITE_API_URL=<backend-api-url>
```

### Backend Environment

```env
MONGO_URI=<mongodb-connection-string>
SECRET_KEY=<jwt-secret>

CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>

RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
```

> Never commit real credentials, API keys, database connection strings, or JWT secrets to the repository.

---

## REST API

The backend exposes RESTful APIs for the major application domains.

### Authentication

```text
POST   /api/v1/user/register
POST   /api/v1/user/login
POST   /api/v1/user/logout
POST   /api/v1/user/changePassword
```

### User Operations

```text
GET    /api/v1/user/getUser/:id
PUT    /api/v1/user/update/:id
GET    /api/v1/user/allUsers
```

### Product Operations

Product APIs handle:

- Product creation
- Product retrieval
- Product updating
- Product deletion
- Product browsing
- Product filtering

### Order & Payment Operations

Order/payment APIs handle:

- Order creation
- User order retrieval
- Checkout operations
- Razorpay payment operations
- Payment status
- Payment method information
- Order status
- Historical order records

### Media Operations

Media handling supports:

- Image upload
- Cloudinary storage
- Cloud-hosted image references
- Product/profile image management

### Analytics

Analytics APIs support:

- Product statistics
- Current-year income
- Lifetime income
- Product-wise revenue
- Historical revenue analysis

> Endpoint names should remain synchronized with the current route implementation in the backend.

---

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd Oryn-ecommerce
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure frontend environment

Create:

```text
frontend/.env
```

and add:

```env
VITE_API_URL=<backend-api-url>
```

### 4. Start the frontend

```bash
npm run dev
```

### 5. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 6. Configure backend environment

Create:

```text
backend/.env
```

and configure:

```env
MONGO_URI=<mongodb-connection-string>
SECRET_KEY=<jwt-secret>

CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>

RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
```

### 7. Start the backend

```bash
npm start
```

---

## Deployment

ORYN is deployed as separate frontend and backend services on **Render**.

```text
                         GitHub
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      Render Frontend              Render Backend
             │                           │
             │                           ├────► MongoDB Atlas
             │                           │
             │                           ├────► Cloudinary
             │                           │
             │                           └────► Razorpay
             │
             └──────── REST API ─────────►
```

### Frontend

The frontend is built with Vite and deployed as its own Render service.

The production backend URL is supplied through:

```env
VITE_API_URL=<deployed-backend-url>
```

### Backend

The backend runs the Express server through:

```bash
npm start
```

with:

```text
backend/server.js
```

as the server entry point.

### Production Configuration

Deployment required:

- Separate frontend/backend Render services
- Correct service root directories
- Production environment variables
- MongoDB Atlas connectivity
- Cloudinary configuration
- Razorpay configuration
- CORS configuration
- Production API URL
- Vite production build configuration
- SPA route handling
- Backend startup configuration

---

## Testing

ORYN was tested across customer, payment, media, administrative, and deployment workflows.

### Authentication

- Registration
- Login
- Logout
- JWT authentication
- Protected routes
- Password change
- Password validation

### Customer Experience

- Home page
- Product listing
- Product filtering
- Product details
- Cart
- Checkout
- Razorpay payment flow
- Order creation
- Order history
- Profile updates
- Profile picture upload
- Cloudinary media handling

### Administration

- Admin dashboard
- Product management
- Analytics
- Current-year income
- Lifetime income
- Product-wise statistics
- Historical order-based revenue

### Responsive Testing

- Desktop layouts
- Mobile layouts
- Product cards
- Filter interface
- Profile interface
- Orders
- Checkout
- Navigation
- Home page sections
- Admin dashboard

### Production Testing

After deployment, the application was tested against the live Render services to validate:

- Frontend/backend communication
- Authentication
- Database connectivity
- Production API configuration
- SPA routing
- Password updates
- User profile operations
- Product operations
- Order retrieval
- Razorpay integration
- Cloudinary media handling
- Admin functionality

---

## Engineering Decisions

### Client-Server Separation

Frontend and backend responsibilities are isolated, allowing independent development and deployment.

### JWT Authentication

JWTs provide authenticated access to protected backend resources.

### Password Security

Passwords are hashed using bcrypt rather than stored directly.

### Cloud-Based Media Storage

Cloudinary keeps uploaded media separate from the application server, making image storage suitable for a deployed environment where local server storage should not be treated as permanent.

### Payment Gateway Integration

Razorpay provides payment infrastructure for the checkout workflow, allowing ORYN to implement an actual payment flow rather than a simulated checkout.

### Environment-Based Configuration

Production-specific values such as API URLs, database credentials, Cloudinary credentials, Razorpay credentials, and authentication secrets are supplied through environment variables.

### Historical Analytics

Analytics are based on persisted order information rather than only the current product catalogue.

This means that removing a product does not erase its historical contribution to:

- Revenue
- Orders
- Product performance
- Historical analytics

### Responsive Design

The UI was developed for both desktop and mobile users.

### Tab-Based Profile Experience

Profile functionality is separated into:

```text
Profile
Orders
Password
```

This keeps account management organized while retaining related operations within one profile experience.

---

## Development Challenges

Building ORYN involved solving several practical full-stack engineering problems.

### Localhost → Production

The application initially depended on local API URLs. These were migrated to environment-based configuration so the frontend could communicate with the deployed backend.

### Render Deployment

The project uses separate frontend and backend directories, requiring correct Render root directories, build commands, start commands, and environment variables.

### Production Build Debugging

Deployment exposed issues that did not appear during local development, including:

- Case-sensitive import paths
- Missing component imports
- Backend startup errors
- Duplicate declarations
- Production environment configuration
- SPA route refresh behavior

### Authentication Refactoring

The initial authentication design included email verification/OTP-related functionality. Production email delivery introduced additional infrastructure requirements.

The authentication flow was simplified to:

```text
Signup
   ↓
Account Created
   ↓
Login
   ↓
Authenticated Profile
   ↓
Password Tab
```

This removed the dependency on email verification for account creation while retaining authenticated password changes.

### Payment Integration

Razorpay integration required coordinating frontend checkout interactions with backend payment operations and order creation while keeping sensitive payment credentials server-side.

### Cloudinary Integration

Cloudinary integration separated image storage from the application server and provided persistent cloud-hosted media references for product and profile images.

### Historical Analytics

Product deletion raised an important data-modeling concern: analytics should not lose historical revenue when an active product is removed.

The solution was to retain sufficient product information inside order records so historical orders can continue to support analytics.

---

## Future Improvements

Potential next iterations include:

- Wishlist
- Product reviews and ratings
- Advanced search
- Inventory management
- Stock alerts
- Coupons and discounts
- Order cancellation
- Returns and refunds
- Shipping tracking
- Customer analytics
- Advanced admin reporting
- Automated frontend/backend testing
- Improved application logging
- Refresh-token authentication
- Role-based access control improvements
- Image optimization
- Production transactional email integration
- Progressive Web App support

---

## Author

**Sweta Dash**

B.Tech Computer Science & Engineering

**Full-Stack Developer | Java | React | Node.js | MongoDB | Blockchain**

---

## License

This project was developed as a full-stack e-commerce application for learning, portfolio, and practical software development purposes.
