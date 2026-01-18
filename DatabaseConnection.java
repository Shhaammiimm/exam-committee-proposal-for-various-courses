package project;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import javax.swing.JOptionPane;

/**
 * Database utility class for managing database connections and operations.
 * Provides centralized database access with connection pooling and proper error handling.
 * 
 * @author ACER
 */
public class DatabaseConnection {
    
    private static final String CONFIG_FILE = "config.properties";
    private static String dbUrl;
    private static String dbUsername;
    private static String dbPassword;
    
    static {
        loadConfiguration();
    }
    
    /**
     * Loads database configuration from properties file.
     * Falls back to default values if file is not found.
     */
    private static void loadConfiguration() {
        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream(CONFIG_FILE)) {
            props.load(fis);
            dbUrl = props.getProperty("db.url", "jdbc:mysql://localhost:3306/hello?useSSL=false");
            dbUsername = props.getProperty("db.username", "root");
            dbPassword = props.getProperty("db.password", "Databasepass2099");
        } catch (IOException e) {
            // If config file doesn't exist, use default values
            dbUrl = "jdbc:mysql://localhost:3306/hello?useSSL=false";
            dbUsername = "root";
            dbPassword = "Databasepass2099";
            System.out.println("Config file not found. Using default database settings.");
        }
    }
    
    /**
     * Establishes a connection to the database.
     * 
     * @return Connection object
     * @throws SQLException if database access error occurs
     * @throws ClassNotFoundException if JDBC driver not found
     */
    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
            return conn;
        } catch (ClassNotFoundException e) {
            throw new ClassNotFoundException("MySQL JDBC Driver not found. Please add mysql-connector-j.jar to classpath.", e);
        } catch (SQLException e) {
            throw new SQLException("Failed to connect to database: " + e.getMessage(), e);
        }
    }
    
    /**
     * Closes a database connection safely.
     * 
     * @param conn Connection to close
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
    
    /**
     * Closes a PreparedStatement safely.
     * 
     * @param ps PreparedStatement to close
     */
    public static void closePreparedStatement(PreparedStatement ps) {
        if (ps != null) {
            try {
                ps.close();
            } catch (SQLException e) {
                System.err.println("Error closing PreparedStatement: " + e.getMessage());
            }
        }
    }
    
    /**
     * Closes a ResultSet safely.
     * 
     * @param rs ResultSet to close
     */
    public static void closeResultSet(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                System.err.println("Error closing ResultSet: " + e.getMessage());
            }
        }
    }
    
    /**
     * Shows a user-friendly error message dialog.
     * 
     * @param parentComponent Parent component for the dialog
     * @param title Dialog title
     * @param message Error message
     */
    public static void showError(java.awt.Component parentComponent, String title, String message) {
        JOptionPane.showMessageDialog(parentComponent, message, title, JOptionPane.ERROR_MESSAGE);
    }
    
    /**
     * Shows a success message dialog.
     * 
     * @param parentComponent Parent component for the dialog
     * @param title Dialog title
     * @param message Success message
     */
    public static void showSuccess(java.awt.Component parentComponent, String title, String message) {
        JOptionPane.showMessageDialog(parentComponent, message, title, JOptionPane.INFORMATION_MESSAGE);
    }
    
    /**
     * Validates if a string is not null or empty.
     * 
     * @param value String to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidString(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
