# StyleHub - Full Stack E-Commerce Application

![Node.js](https://img.shields.io/badge/Node.js-Success?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Green?style=for-the-badge&logo=mongodb)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript)

## Project Description

**StyleHub** is a fully functional online clothing store built with a RESTful API backend and a responsive vanilla JavaScript frontend. 

The project demonstrates a complete **MVC (Model-View-Controller)** architecture, secure authentication using **JWT**, and **Role-Based Access Control (RBAC)** for Administrators and Customers.

### Key Features
* **Authentication:** Secure User Registration and Login (Bcrypt + JWT).
* **RBAC (Roles):** * **User:** Can browse products, filter by category, manage cart, and place orders.
    * **Admin:** Has access to a dashboard to **Create**, **Edit**, and **Delete** products.
* **Shopping Cart:** Persists data using LocalStorage.
* **Database:** MongoDB Atlas with relational data integrity (Users <-> Orders <-> Products).
* **Security:** Password hashing, protected routes, and environment variable management.

---

## Live Demo
**Deployed Project:** [https://backend-final-project-cqs9.onrender.com/]

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Tools:** Postman (Testing), Git & GitHub (Version Control), Render (Deployment)

---

## Installation & Local Run

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/stylehub-final.git](https://github.com/YOUR_USERNAME/stylehub-final.git)
cd stylehub-final

2. Install Dependencies
Bash

npm install

3. Configure Environment Variables

Create a .env file in the root directory and add the following:

PORT=3000
MONGO_URI=mongodb+srv://<your_db_user>:<your_password>@cluster0.mongodb.net/stylehub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_123

4. Start the Server
Bash

npm start

npm run dev

5. Open in Browser

Visit http://localhost:3000 to view the application.
 API Documentation

The API follows RESTful principles. Below are the available endpoints.
 Authentication
Method	Endpoint	Description	Body Parameters
POST	/api/auth/register	Register a new user	{ "username": "John", "email": "john@test.com", "password": "123" }
POST	/api/auth/login	Login user & get Token	{ "email": "john@test.com", "password": "123" }
 Products
Method	Endpoint	Description	Access
GET	/api/products	Get all products	Public
POST	/api/products	Create a new product	Admin Only (Token required)
PUT	/api/products/:id	Update product details	Admin Only (Token required)
DELETE	/api/products/:id	Delete a product	Admin Only (Token required)

Product Object Example:
JSON

{
  "name": "Black Hoodie",
  "price": 49.99,
  "category": "Men",
  "image": "[https://example.com/image.jpg](https://example.com/image.jpg)",
  "description": "High quality cotton hoodie."
}

Orders
Method	Endpoint	Description	Access
POST	/api/orders	Place a new order	User/Admin (Token required)
GET	/api/orders/myorders	Get logged-in user's history	User/Admin (Token required)
