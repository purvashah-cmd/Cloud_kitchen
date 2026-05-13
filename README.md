# Cloud Kitchen Management System 🍕🛵

A full-stack Node.js web application for managing a modern Cloud Kitchen, featuring a Customer Ordering Portal, an Admin Dashboard, and a live Delivery Partner system. 

Live Demo: [Cloud Kitchen Vercel App](https://cloud-kitchen-cyan.vercel.app/)

## Features 🌟
- **Customer Portal**: Browse the dynamic menu, search for items, add to cart, and place orders in real-time.
- **Admin Dashboard**: Kitchen managers can view live orders, track revenue, assign delivery partners, and analyze performance data.
- **Delivery Partner App**: A "Radar" view for delivery drivers to search for nearby orders, accept pickups, view maps, and track earnings.
- **Secure Authentication**: Role-based logins hidden safely on the backend server.
- **Cloud Database**: Integrated with MongoDB Atlas for persistent storage of users, orders, and products.

## Technology Stack 💻
- **Frontend**: Vanilla HTML, JavaScript, CSS, TailwindCSS, Leaflet.js (for Maps)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Deployment**: Vercel (Serverless Functions)

## How to Run
The project is configured for seamless deployment on Vercel. Connect your GitHub repository to a Vercel project to automatically build and host the application.

## Default Login Roles 🔒
*(For testing purposes only. Change inside database for production)*
- **Customer**: Create any account via the Signup page.
- **Admin**: `admin@gmail.com`
- **Delivery Partner**: `driver@gmail.com`
*(Contact repository owner for test passwords)*
