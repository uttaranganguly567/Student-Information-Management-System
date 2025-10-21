# Student Information Management System

A comprehensive MERN stack application designed to manage all aspects of a modern educational institution. This system provides distinct portals for Administrators, Teachers, and Students, each with role-specific functionalities for managing courses, fees, assignments, and personal information.

This project is built based on the features outlined in the **Software Requirements Specification (SRS)**

## Features Implemented

The system is built around three main user roles as specified in the SRS:

### 🧑‍💻 Administrator (Admin)

The administrative backbone of the application.

  * **Full CRUD for Students:** Create, Read, Update, and Delete student profiles and academic records.
  * **Full CRUD for Courses:** Create, Read, Update, and Delete course listings.
  * **Full CRUD for Teachers:** Create, Read, Update, and Delete teacher profiles.
  * **Full CRUD for Fees:** Create, Read, Update, and Delete fee records for students.
  * **Assign Teachers:** Assign specific teachers to courses.
  * **Global Dashboard:** View system-wide statistics like total students, total courses, and total fees due.

### 👩‍🏫 Teacher

A portal for educators to manage their courses and student interactions.

  * **Teacher Dashboard:** View a list of all assigned courses.
  * **Create Assignments:** Create new assignments (with title, description, due date) for their assigned courses.
  * **View Enrolled Students:** See a list of all students enrolled in their specific courses.
  * **View Submissions:** View all student submissions for a specific assignment.
  * **Grade Submissions:** Enter a grade and text feedback for each student's submission.

### 🎓 Student

[cite\_start]A personal portal for students to manage their academic life [cite: 85-92].

  * **Student Dashboard:** View a personalized dashboard with key stats like "My Fees Due" and "Enrolled Courses Count".
  * **My Profile:** View and edit personal information (name, age, mobile).
  * **Enroll in Courses:** View a list of all available courses and enroll in them.
  * **My Assignments:** View a list of all assignments from enrolled courses, grouped by course.
  * **Submit Assignments:** Submit work (currently text-based) for assignments.
  * **View Grades:** View grades and feedback from teachers on the "My Assignments" page.
  * **Fee Status:** View a personalized list of their own fee records and payment status.

### 🌐 Core System Features

  * **Role-Based Authentication:** Secure login system with three distinct roles (Admin, Teacher, Student).
  * **Protected Routes:** Both frontend and backend routes are protected based on user role.
  * **Dark Mode:** A professional, persistent dark mode toggle is available on all pages.
  * **Collapsible Sidebar:** A responsive sidebar for easy navigation.
  * **Indian Currency & Numbering:** All fees are displayed using the Indian Rupee symbol (₹) and numbering system (Lakhs, Crores).

## Tech Stack

  * **Frontend:** React, React Router, Redux Toolkit
  * **Backend:** Node.js, Express
  * **Database:** MongoDB (managed on MongoDB Atlas)
  * **Authentication:** JWT (JSON Web Tokens) with `cookie-parser`
  * **Middleware:** CORS, Mongoose

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You will need the following installed on your machine:

  * [Node.js](https://nodejs.org/en) (which includes npm)
  * [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB server)
  * A code editor (like VS Code)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Install Backend Dependencies:**

      * Navigate to the `backend` folder and install the packages.


    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**

      * From the root folder, navigate to the `frontend` folder and install the packages.

    <!-- end list -->

    ```bash
    cd ../frontend
    npm install
    ```

### Environment Configuration

This project requires environment variables to connect to the database and secure authentication.

1.  Create a file named `.env` in the **root project folder** (the same level as `frontend` and `backend`).

2.  Add the following key-value pairs to the `.env` file. **Do not** add quotes.

    ```env
    # Your MongoDB Atlas connection string
    MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/YourDatabaseName?retryWrites=true&w=majority

    # A long, random, secret string for signing JWT tokens
    JWT_SECRET=this-is-a-very-long-and-secure-secret-key-12345

    # Set the environment to development
    NODE_ENV=development
    ```

## Running the Application

You must run both the backend and frontend servers simultaneously in two separate terminals.

1.  **Run the Backend Server:**

      * In your first terminal, navigate to the `backend` folder.

    ```bash
    cd backend
    npm run dev # Or 'nodemon server.js' if you have nodemon
    ```

    Your backend API should now be running on `http://localhost:5000`.

2.  **Run the Frontend Server:**

      * In your second terminal, navigate to the `frontend` folder.

    ```bash
    cd frontend
    npm start
    ```

    Your React application should now be running and will open automatically on `http://localhost:3000`.

## Contributors

This project was built based on the SRS prepared by:

  * **Uttaran Ganguly**
  * **Md. Farhann Akhter**
  * **Agniva Acherjee**
