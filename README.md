# Company Directory

The **Company Directory** is a web-based application for managing personnel, departments, and locations within an organization. It provides a user-friendly interface to view, add, edit, and delete records dynamically.

---

## Features

- **Personnel Management**: Add, edit, and delete employee records.
- **Department Management**: Manage departments and their associated locations.
- **Location Management**: Add, edit, and delete office locations.
- **Search Functionality**: Quickly search through personnel, departments, and locations.
- **Responsive Design**: Fully responsive layout using Bootstrap 5.
- **Dynamic Content**: Data is dynamically loaded and updated using AJAX.

---

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (Bootstrap 5 for styling)
  - JavaScript (with jQuery for AJAX and DOM manipulation)
  - Font Awesome for icons

- **Backend**:
  - PHP (for server-side logic and database interaction)
  - MySQL (for data storage)

---

## Installation

### Prerequisites
- [XAMPP](https://www.apachefriends.org/index.html) or any LAMP/WAMP stack.
- A web browser (e.g., Chrome, Firefox).
- Git (optional, for cloning the repository).

---

### Steps to Set Up the Project

1. **Clone the Repository**  
   Clone the repository or download the project files:
   ```bash
   git clone https://github.com/phillipbrad/phillipBradshaw/companydirectory.git
   ```
   Place the project folder in your XAMPP `htdocs` directory:
   ```
   /Applications/XAMPP/xamppfiles/htdocs/companydirectory/
   ```

2. **Import the Database**  
   - Open phpMyAdmin by navigating to `http://localhost/phpmyadmin`.
   - Create a new database named `companydirectory`.
   - Import the SQL file located in `libs/sql/companydirectory.sql`.

3. **Configure the `config.example.php` File**  
   The `config.example.php` file contains the database connection details. You need to update it with your own credentials.

   - Open the `libs/php/config.example.php` file in a text editor.
   - Update the following variables with your own database details:
     ```php
     <?php
     // Database connection details
     $cd_host = "127.0.0.1";       // Hostname (use "localhost" or "127.0.0.1")
     $cd_port = 3306;              // Port number (default is 3306 for MySQL)
     $cd_socket = "";              // Leave empty unless using a specific socket

     // Database name, username, and password
     $cd_dbname = "companydirectory"; // Name of the database you created
     $cd_user = "your-username";      // Your MySQL username
     $cd_password = "your-password";  // Your MySQL password
     ?>
     ```

   **Note**: Replace `your-username` and `your-password` with the MySQL username and password you use to access your database. If you're using XAMPP, the default username is `root` and the password is usually empty (`""`).

   **Important**: If you are deploying this project to a live server, ensure you use secure credentials and restrict access to the `config.php` file.

4. **Start the XAMPP Server**  
   - Open the XAMPP control panel.
   - Start the **Apache** and **MySQL** services.

5. **Access the Application**  
   - Open your browser and navigate to:
     ```
     http://localhost/companydirectory
     ```

---

## Dynamic Content and Modals

### **Dynamic Tables**
The application dynamically populates the following tables using JavaScript and AJAX:
- **Personnel Table**: Populated in the `#personnelTableBody` element.
- **Department Table**: Populated in the `#departmentTableBody` element.
- **Location Table**: Populated in the `#locationTableBody` element.

### **Modals**
The application includes modals for adding, editing, and deleting records:
- **Edit Personnel Modal**: Allows editing employee details.
- **Edit Department Modal**: Allows editing department details.
- **Edit Location Modal**: Allows editing location details.
- **Delete Modals**: Confirm deletion of personnel, departments, or locations.
- **Add Modal**: Add new records to the database.

Each modal is dynamically populated with data using JavaScript.

---

## Usage

### Personnel Management
1. Navigate to the **Personnel** tab.
2. Use the **Add**, **Edit**, or **Delete** buttons to manage employee records.

### Department Management
1. Navigate to the **Departments** tab.
2. Use the **Add**, **Edit**, or **Delete** buttons to manage department records.

### Location Management
1. Navigate to the **Locations** tab.
2. Use the **Add**, **Edit**, or **Delete** buttons to manage location records.

### Search
- Use the search bar at the top of the page to filter records dynamically.

---


