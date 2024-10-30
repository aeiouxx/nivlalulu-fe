# Invoice App

This project is a frontend application built with React and Material UI (MUI), providing an intuitive and responsive interface for managing invoices, templates, and user profiles. The application connects to a mock backend server (using JSON Server) to store and retrieve data for development and testing purposes.
Key Features

   ## User Authentication:
  Users can register and log in with their credentials.
  The frontend handles authentication and manages tokens using Cookies to maintain user sessions.
  Token-based access control ensures that only logged-in users can access protected routes.
  
  ![obrazek](https://github.com/user-attachments/assets/bbec6205-3195-453c-aba6-7d47b0c910a3)
  ![obrazek](https://github.com/user-attachments/assets/11ffb550-013f-4201-b751-7df904b3eb89)

   ## Dashboard:
  A central hub for users, displaying available invoice templates and existing invoices.
  Provides quick access to create, edit, or view invoices and templates.
  
  ![obrazek](https://github.com/user-attachments/assets/49fed290-8e99-4448-b7b2-d0d8087bf3f5)

   ## Invoice Generation and Editing:
  Users can create new invoices from available templates, fill in details, and save them to the backend.
  Includes the ability to remove or add items to invoices directly.
  
  ![obrazek](https://github.com/user-attachments/assets/25816666-c78f-470f-bd15-1c21a8121ef7)
  ![obrazek](https://github.com/user-attachments/assets/b261811b-2079-4ea8-b6e5-b11668fefa06)

   ## Profile Page:
  Allows users to view and update their profile details, including email and password.
  Password confirmation and live validation prevent errors during profile updates.
  
  ![obrazek](https://github.com/user-attachments/assets/e690f62b-dee9-4b72-944e-cf2e394bb628)

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
```
React: For building dynamic user interfaces.
Material UI (MUI): To implement a consistent design and responsive layout.
React Router: For managing routing between pages.
Axios: For handling HTTP requests to the backend.
JSON Server: A mock backend server for local development.
Cookies: For storing authentication tokens and maintaining sessions.
```
