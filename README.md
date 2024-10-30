# Invoice App

This project is a frontend application built with React and Material UI (MUI), providing an intuitive and responsive interface for managing invoices, templates, and user profiles. The application connects to a mock backend server (using JSON Server) to store and retrieve data for development and testing purposes.
Key Features

   ## User Authentication:
        Users can register and log in with their credentials.
        The frontend handles authentication and manages tokens using Cookies to maintain user sessions.
        Token-based access control ensures that only logged-in users can access protected routes.

   ## Dashboard:
        A central hub for users, displaying available invoice templates and existing invoices.
        Provides quick access to create, edit, or view invoices and templates.

   ## Template Management:
        Users can create and customize templates for invoices.
        Templates can include editable fields for supplier, customer details, itemized lists, and totals, all configurable from the UI.
        Real-time field population, enabling users to add or remove items dynamically, with a total recalculated automatically.

   ## Invoice Generation and Editing:
        Users can create new invoices from available templates, fill in details, and save them to the backend.
        Each invoice can be edited, with user-friendly input fields that mimic an actual invoice layout.
        Includes the ability to remove or add items to invoices directly.

   ## Profile Page:
        Allows users to view and update their profile details, including email and password.
        Password confirmation and live validation prevent errors during profile updates.

# Running the Frontend Locally

To start the frontend locally:

   ## Install dependencies:
    npm install
   ## Install JSON server
    npm install -g json-server
   ## Start the JSON server
    json-server --watch src/services/db.json --port 3001
   ## Start the Frontend
    npm start

The frontend will be accessible at http://localhost:3000 and will interact with the mock API running on http://localhost:3001.

# Technologies Used
React: For building dynamic user interfaces.
Material UI (MUI): To implement a consistent design and responsive layout.
React Router: For managing routing between pages.
Axios: For handling HTTP requests to the backend.
JSON Server: A mock backend server for local development.
Cookies: For storing authentication tokens and maintaining sessions.

