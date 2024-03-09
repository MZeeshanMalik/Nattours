# Natours Project

This project is based on the **Node.js course on Udemy** by **Jonas Schmedtmann**. I've learned a lot from Jonas's course and used it as a foundation to build this tour booking web app.

## Acknowledgements

- **Jonas Schmedtmann**: Thank you for creating an amazing course that taught me how to build a full-stack web app with Node.js. 🙌
About Nattours
Natours is a tour booking web app that you created as part of the Node.js course on Udemy by Jonas Schmedtmann. The app utilizes Node.js, Express, and MongoDB to create a RESTful API and a dynamic website. It also incorporates features such as authentication, authorization, security, payments, and email functionalities. Impressive work! 🌟
To get started with your README file, follow these steps:
- Clone the Repository:
    - Clone the Natours project repository to your local machine using the following command:

git clone /https://github.com/MZeeshanMalik/Nattours

    - Navigate to the project directory:

cd natours-project-MZeeshanMalik

- Install Dependencies:
    - Install the required dependencies using either npm install or yarn install.
- Environment Variables:
    - Create a .env file in the root folder.
    - Add the following environment variables to your .env file:

NODE_ENV=development
PORT=3000
DATABASE=<your-mongodb-connection-string>
DATABASE_PASSWORD=<your-mongodb-password>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=<your-email-username>
EMAIL_PASSWORD=<your-email-password>
EMAIL_HOST=<your-email-host>
EMAIL_PORT=<your-email-port>
EMAIL_FROM=<your-email-address>
STRIPE_SECRET_KEY=<your-stripe-secret-key>

- Run the App:
    - Start the app using either npm start or yarn start.
    - Open your browser and go to http://localhost:3000.
✨ Features of your Natours app include:
- User registration and login with JWT authentication
- Password reset with email verification
- User profile update and deletion
- User roles and permissions
- Tour creation, update, deletion, and filtering
- Tour image upload and processing
- Tour ratings and reviews
- Tour booking with Stripe integration
- Booking confirmation and invoice email
- Error handling and logging
🚀 Technologies used:
- Node.js
- Express
- MongoDB
- Mongoose
- Pug (templating engine)
- Sass (CSS preprocessor)
- Stripe (for payments)
- Nodemailer (for email functionality)
- Multer (for file uploads)
- Sharp (for image processing)
- Helmet (for security)
- Morgan (for logging)
- Bcrypt (for password hashing)
- Jsonwebtoken (for JWT authentication)
- Validator (for input validation)
🙌 Acknowledgements:
This project is based on the Node.js course on Udemy by Jonas Schmedtmann. Kudos to him for creating this awesome course and teaching you how to build a full-stack web app with Node.js! 🎉
