# Project README

## Project Description

This project appears to be a Next.js web application, possibly a data management or administrative tool, using Shadcn UI components.  It includes user authentication and role-based access control.

## Setup Instructions

1.  **Prerequisites**
    * Node.js and npm installed on your system.
    * VS Code (or your preferred code editor)

2.  **Installation**
    * Open the project directory in your terminal.
    * Run the following commands:

        ```bash
        npx shadcn@latest init  # Initializes Shadcn UI (Note the corrected command)
        npx shadcn@latest add button # Adds the Button component
        npx shadcn@latest add card    # Adds the Card component
        npm install --legacy-peer-deps # Installs dependencies, resolving potential conflicts
        ```
        * **Important:** The `shadcn-ui` package is deprecated.  The commands above use the correct `shadcn` package.
        * The `--legacy-peer-deps` flag is used to bypass peer dependency resolution issues, specifically with `date-fns` and `react-day-picker`.  This allows for a potentially "broken" dependency resolution, so exercise caution and ensure your application works as expected.

3.  **Database Setup**
    * A SQL database (MySQL, PostgreSQL, etc.) is required.  See the `SQL Database Schema` section for an example schema.
        * Create a database (e.g., `ssei_ams_db`) in your chosen SQL server.
        * Use a database client or command-line tool to execute the SQL `CREATE TABLE` statements.
    * Configure your Next.js application to connect to the database (the specific steps for this depend on the database driver you choose and how you're managing your Next.js configuration).

4.  **Running the Application**
    * In your terminal, run:
        ```bash
        npm run dev
        ```
    * This starts the Next.js development server.
    * Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:3000`).

## Troubleshooting

* **`sh: next: command not found`**
    * This error indicates that the `next` command is not recognized.  This usually means that Next.js is not installed or not correctly included in your project's `node_modules`.
    * **Solution:**
        * Ensure you are in the project's root directory (where `package.json` is located).
        * Try running `npm install` again to make sure all dependencies, including Next.js, are installed.
        * If the problem persists, try deleting the `node_modules` folder and `package-lock.json` and then running `npm install` again.

* **`npm error code ERESOLVE` / `ERESOLVE unable to resolve dependency tree`**
    * This error indicates a conflict between the versions of dependencies required by different packages in your project.  In this case, there's a conflict between `date-fns` and `react-day-picker`.
     * **Solution:**
         * The `--legacy-peer-deps` flag was used to force the installation.  While this may allow the installation to complete, it's crucial to test the application thoroughly.
         * Ideally, you should try to resolve the root cause of the dependency conflict by updating the packages to compatible versions.
         * Check for updates:  Update `react-day-picker` and `date-fns` to their latest versions  `npm update date-fns react-day-picker`
         * Check compatibility:  Refer to the documentation for `react-day-picker` to see the exact compatible versions of `date-fns`.
         * Install specific versions:  If necessary, install specific versions of the packages that are known to work together:  `npm install date-fns@2.28.0 react-day-picker@8.10.1`

* **`Error: × Expected '>', got 'value'` in `lib/auth.ts`**
    * This is a syntax error in your Next.js code, specifically in the `lib/auth.ts` file.  It usually indicates a problem with the JSX syntax.
    * **Solution:**
        * Open `lib/auth.ts` in your code editor.
        * Carefully review the code, paying close attention to the lines indicated in the error message.
        * Look for the following:
            * Unbalanced or unclosed tags (`<div>` vs. `</div>`).
            * Incorrect nesting of components.
            * Missing parentheses or braces in JSX expressions.
            * Invalid attributes or tag names.
        * Ensure that your components are correctly structured and that all JSX syntax is valid.

* **404 Errors (e.g., `/dashboard/accounts/fix-fee/1 404`)**
    * These errors mean that the Next.js application is trying to access routes (pages or API endpoints) that do not exist.
    * **Solution:**
        * Create the missing routes in your Next.js application.
        * In Next.js, routes are typically defined by files in the `pages` directory (for Next.js versions before 13) or the `app` directory (Next.js 13 and later).
        * For example, to fix `/dashboard/accounts/fix-fee/1`, you would need to create a file or directory structure that matches this route.

## SQL Database Schema

The following SQL schema provides a basic structure for the project's database:

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS ssei_ams_db;
USE ssei_ams_db;

-- Create the Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    role ENUM('admin', 'user', 'editor') DEFAULT 'user'
);

-- Create the Accounts table
CREATE TABLE Accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    balance DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create the Sessions table
CREATE TABLE Sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

Table Details
Users:  Stores user data.  Passwords should be hashed.

Accounts:  Stores account information, linked to users.

Sessions:  Stores user session data for authentication.
