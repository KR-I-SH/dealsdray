# README for MERN Stack Project

# MERN Stack Employee Management System

This project is a simple Employee Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides basic CRUD (Create, Read, Update, Delete) functionalities, allowing users to manage employee records with fields such as name, email, mobile number, designation, gender, courses, and profile image.

 Table of Contents
- [Features]
- [Technologies Used]
- [Setup Instructions]
- [Usage]
- [Screenshots]
- [API Endpoints]
- [Validation]
- [contact]

 Features
- Create Employee: Add a new employee with a name, email, mobile number, designation, gender, courses, and profile image.
- Edit Employee: Update an existing employee's details.
- Delete Employee: Remove an employee from the system.
- Employee List: View a paginated list of all employees with options to search, sort, and filter.
- Login/Logout: Simple authentication system with user sessions.

 Technologies Used
- Frontend: React.js, HTML, CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Styling: CSS Modules

 Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mern-employee-management.git
    cd mern-employee-management
    ```

2. Install dependencies for both client and server:
    ```bash
    npm install
    cd client
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```bash
   MONGO_URI=your_mongo_connection_string
   ```

4. Run the server and client:
    ```bash
    npm run dev
    ```
   This will start both the backend server and the React client.

 Usage
- Login with your credentials.
- Navigate through the Home page to access the Employee List, Create Employee, and Logout.
- Create new employees by filling out the form on the Create Employee page.
- Edit employee details by clicking the Edit button in the Employee List.
- Delete an employee by clicking the Delete button in the Employee List.

 Screenshots
1. Login Page:
   - Explanation: This page is where users enter their credentials to access the system.
   - Screenshot: Include a screenshot showing the login form with email and password fields.
 

2. Home Page:
   - Explanation: After login, the home page displays a welcome message and navigation links to the Employee List, Create Employee, and Logout.
   - Screenshot: Show the home page with the navigation menu and welcome message.
 

3. Employee List:
   - Explanation: Displays all employee records in a table format, including options for searching, sorting, editing, and deleting.
   - Screenshot: Highlight the search bar, pagination, and action buttons.
 
 

4. Create Employee Page:
   - Explanation: This page allows users to add a new employee by filling in their details.
   - Screenshot: Show the form fields, including the name, email, mobile, designation, gender, course selection, and image upload.
 

5. Edit Employee Page:
   - Explanation: Users can update an existing employee's information, with the form pre-filled with current data.
   - Screenshot: Display the form with pre-filled data and the update button.
 
6. Delete Confirmation:
   - Explanation: A pop-up or modal that asks for confirmation before deleting an employee.
   - Screenshot: Include the confirmation dialog with options to confirm or cancel the deletion.
 
 

 API Endpoints
- GET /employees: Fetch all employees.
- POST /employees: Create a new employee.
- GET /employees/:id: Fetch a specific employee by ID.
- PUT /employees/:id: Update an employee's details.
- DELETE /employees/:id: Delete an employee.

 Validation
- Required Fields: Name, Email, Mobile, Designation, Gender, and Image are required fields.
- Email Validation: Ensures the email format is correct.
- Mobile Validation: Only numeric values are allowed.
- Image Validation: Only JPG/PNG files are allowed for profile images.

Contact
For any questions or feedback, please contact krishchaudhary482@gmail.com .


