# 🛒 Node.js E-commerce API  

## 📌 Overview  
This is a **RESTful API** built with **Node.js, Express, and MongoDB** for a fully functional e-commerce platform. It includes features like **user authentication, product management, order handling, payment processing**, and more.

---

## 🚀 Features  
- **User Authentication**: Sign up, login, role-based access control (JWT).  
- **Product Management**: Create, update, delete, and filter products.  
- **Category & Subcategory Management**: Organize products efficiently.  
- **Brands Management**: Associate products with brands.  
- **Cart & Wishlist**: Users can add/remove products from their cart or wishlist.  
- **Orders & Payments**: Secure checkout process with **Stripe** integration.  
- **Reviews & Ratings**: Customers can review and rate products.  
- **Coupons & Discounts**: Apply promotional discounts.  
- **Address Management**: Users can manage their delivery addresses.  
- **Security & Best Practices**: **JWT authentication, bcrypt password hashing, input validation, and CORS support**.  

---

## 🛠️ Tech Stack  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB & Mongoose  
- **Authentication**: JWT, bcrypt  
- **File Uploads**: Multer & Sharp  
- **Payment Processing**: Stripe  
- **Validation**: Express-validator  
- **Logging**: Morgan  
- **Environment Management**: dotenv  
- **Code Quality**: ESLint, Prettier  

---

## 📂 API Routes  
| Endpoint | Description |
|----------|------------|
| `/api/v1/auth` | User authentication (Login/Register) |
| `/api/v1/users` | User management (Admin Only) |
| `/api/v1/categories` | Manage product categories |
| `/api/v1/subcategories` | Manage product subcategories |
| `/api/v1/brands` | Manage brands |
| `/api/v1/products` | CRUD operations for products |
| `/api/v1/cart` | User shopping cart |
| `/api/v1/wishlist` | Wishlist functionality |
| `/api/v1/reviews` | Product reviews & ratings |
| `/api/v1/coupons` | Coupon & discount management |
| `/api/v1/orders` | Order placement & history |
| `/api/v1/address` | User address management |

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the repository  
```sh
git clone https://github.com/mohamedlasheen92/NodeJS-Ecommerce-API.git
cd nodejs-ecommerce-api
```

### 2️⃣ Install dependencies  
```sh
npm install
```

### 3️⃣ Setup environment variables  
Create a `.env` file and add the following:  
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

### 4️⃣ Start the server  
For development:  
```sh
npm run start:dev
```
For production:  
```sh
npm run start:prod
```

---

## 🔑 Authentication  
- The API uses **JWT (JSON Web Tokens)** for authentication.  
- To access protected routes, include the token in the request headers:  
```sh
Authorization: Bearer <your_token>
```
