# Exam Committee Proposal System

A Java Swing desktop application for managing exam committee proposals for various courses in an educational institution. The application provides a step-by-step wizard interface to collect and organize exam-related information including course details, committee members, and examination staff assignments.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Security Improvements](#security-improvements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Multi-Step Wizard Interface**: Streamlined workflow through 5 intuitive forms
  1. **Exam Details**: Select degree, level, semester, and session
  2. **Course Selection**: Choose courses from database based on exam details
  3. **Exam Committee**: Assign committee members (Chairman, Member 1, Member 2) with designations
  4. **Exam Related Topics**: Assign question makers, internal teachers, scrutinizer, and external examiners
  5. **Final Summary**: View and generate complete proposal summary

- **Database Integration**: MySQL database for persistent data storage
- **Secure Data Handling**: Prepared statements to prevent SQL injection
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Data Validation**: Input validation to ensure data integrity

## 🛠️ Technology Stack

- **Language**: Java 20
- **GUI Framework**: Java Swing (JavaFX alternative)
- **Database**: MySQL
- **JDBC Driver**: MySQL Connector/J 8.3.0
- **IDE**: NetBeans (compatible with other IDEs)
- **Build Tool**: Ant (NetBeans default)

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

1. **Java Development Kit (JDK) 20 or higher**
   - Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
   - Verify installation: `java -version`

2. **MySQL Server 8.0 or higher**
   - Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
   - Ensure MySQL service is running

3. **MySQL Connector/J Driver**
   - Included in the project dependencies
   - Version: 8.3.0

4. **NetBeans IDE (Recommended)** or any Java IDE
   - Download from [NetBeans](https://netbeans.apache.org/)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/exam-committee-proposal-for-various-courses.git
cd exam-committee-proposal-for-various-courses
```

### Step 2: Import Project

**Using NetBeans:**
1. Open NetBeans IDE
2. Go to `File` → `Open Project`
3. Select the project folder
4. Click `Open Project`

**Using IntelliJ IDEA:**
1. Open IntelliJ IDEA
2. Go to `File` → `Open`
3. Select the project folder
4. Click `OK`

**Using Eclipse:**
1. Open Eclipse
2. Go to `File` → `Import`
3. Select `Existing Projects into Workspace`
4. Browse to the project folder
5. Click `Finish`

### Step 3: Configure Database

See [Database Setup](#database-setup) section for detailed instructions.

## ⚙️ Configuration

### Database Configuration

The application uses a `config.properties` file for database configuration. Create or modify this file in the project root:

```properties
# Database Configuration
db.url=jdbc:mysql://localhost:3306/hello?useSSL=false
db.username=root
db.password=your_password_here
```

**Note**: If `config.properties` is not found, the application will use default values:
- URL: `jdbc:mysql://localhost:3306/hello?useSSL=false`
- Username: `root`
- Password: `Databasepass2099`

### Security Note

⚠️ **Important**: For production use, ensure that `config.properties` is added to `.gitignore` to prevent committing sensitive credentials to version control.

## 🗄️ Database Setup

### Step 1: Create Database

```sql
CREATE DATABASE hello;
USE hello;
```

### Step 2: Create Required Tables

Execute the following SQL statements:

```sql
-- Exam table
CREATE TABLE exam_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree VARCHAR(50) NOT NULL,
    level VARCHAR(10) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    year VARCHAR(10) NOT NULL
);

-- Course table
CREATE TABLE course_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Exam committee table
CREATE TABLE exam_comittee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chairman VARCHAR(100) NOT NULL,
    cname VARCHAR(100) NOT NULL,
    mem1 VARCHAR(100) NOT NULL,
    name1 VARCHAR(100) NOT NULL,
    mem2 VARCHAR(100) NOT NULL,
    name2 VARCHAR(100) NOT NULL
);

-- Exam related table
CREATE TABLE exam_related (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rank VARCHAR(100) NOT NULL
);

-- External examiner table
CREATE TABLE external_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    uni VARCHAR(100) NOT NULL
);

-- Teacher name table
CREATE TABLE teacher_name (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Designation table
CREATE TABLE designation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- External table (for external examiner information)
CREATE TABLE external (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Teacher_name VARCHAR(100) NOT NULL,
    Department VARCHAR(100) NOT NULL,
    University VARCHAR(100) NOT NULL
);
```

### Step 3: Create Dynamic Course Tables

For each combination of level and semester, create tables like:
- `l_1_s_i` (Level 1, Semester I)
- `l_1_s_ii` (Level 1, Semester II)
- `l_2_s_i` (Level 2, Semester I)
- etc.

Example:

```sql
CREATE TABLE l_1_s_i (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(50) NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    credit VARCHAR(10) NOT NULL
);
```

### Step 4: Insert Sample Data (Optional)

```sql
-- Insert sample teachers
INSERT INTO teacher_name (name) VALUES 
('Dr. John Smith'),
('Prof. Jane Doe'),
('Dr. Robert Johnson');

-- Insert sample designations
INSERT INTO designation (name) VALUES 
('Professor'),
('Associate Professor'),
('Assistant Professor'),
('Lecturer');

-- Insert sample external examiners
INSERT INTO external (Teacher_name, Department, University) VALUES 
('Dr. External Name', 'Computer Science', 'Example University');
```

## 📖 Usage

### Running the Application

**From NetBeans:**
1. Right-click on the project
2. Select `Run` or press `F6`

**From Command Line:**
```bash
# Compile
javac -cp "mysql-connector-j-8.3.0.jar:." project/*.java

# Run
java -cp "mysql-connector-j-8.3.0.jar:." project.exam
```

### Application Workflow

1. **Start the Application**: Run `exam.java` as the main class
2. **Enter Exam Details**: Select degree, level, semester, and session
3. **Select Course**: Click "Choose Subject" to load courses, then select a course
4. **Assign Committee**: Click "Select Teacher" to load teachers and designations, then assign committee members
5. **Assign Staff**: Click "Select Teacher" to load data, then assign question makers, internal teachers, scrutinizer, and external examiner
6. **Generate Summary**: Click "Generate" to load and display all collected information

### Navigation

- **Next Page**: Proceed to the next step
- **Back**: Return to the previous step
- **Exit**: Close the application (with confirmation)

## 📁 Project Structure

```
exam-committee-proposal-for-various-courses/
├── src/
│   └── project/
│       ├── exam.java                    # Main entry point - Exam details form
│       ├── Course.java                  # Course selection form
│       ├── Exam_Committee.java          # Committee assignment form
│       ├── ExamRelatedTopics.java       # Exam staff assignment form
│       ├── Final.java                   # Summary/Generation form
│       └── DatabaseConnection.java      # Database utility class
├── config.properties                    # Database configuration (create this)
├── README.md                            # This file
├── build.xml                            # Ant build file
└── project.properties                   # NetBeans project configuration
```

## 🔒 Security Improvements

This version includes several security enhancements:

### ✅ SQL Injection Prevention
- All database queries now use `PreparedStatement` instead of string concatenation
- Parameterized queries prevent SQL injection attacks

### ✅ Centralized Database Management
- `DatabaseConnection` utility class manages all database connections
- Consistent error handling across the application

### ✅ Configuration Management
- Database credentials stored in `config.properties` file
- Easy to update without modifying source code

### ✅ Error Handling
- Comprehensive exception handling
- User-friendly error messages
- Proper resource cleanup (connections, statements, result sets)

### ✅ Input Validation
- Validation checks before database operations
- Prevents null pointer exceptions
- Ensures data integrity

## 🐛 Known Issues

- Dynamic table names based on level/semester: While validated with regex, consider using a unified course table with level/semester columns for better database design
- The `config.properties` file needs to be created manually - consider auto-generating it on first run

## 🔮 Future Improvements

- [ ] Add PDF export functionality for exam committee proposals
- [ ] Implement user authentication and role-based access
- [ ] Add ability to edit/update existing proposals
- [ ] Implement data backup and restore functionality
- [ ] Add report generation with charts and statistics
- [ ] Migrate to a unified course table structure instead of dynamic tables
- [ ] Add unit tests for database operations
- [ ] Implement logging framework (e.g., Log4j)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java naming conventions
- Add JavaDoc comments for public methods
- Use meaningful variable names
- Handle exceptions appropriately
- Test your changes before submitting



**Note**: This application was developed as an educational project for managing exam committee proposals in an academic environment. Ensure compliance with your institution's data protection policies before deploying in production.
