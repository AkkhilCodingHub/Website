import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class db {

    public static void createTables(Connection conn) throws SQLException {
        String sql;

        // Table 1: exam_incharges
        sql = "CREATE TABLE exam_incharges (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "contact_information VARCHAR(255)," +
                "designation VARCHAR(255)" +
                ")";
        Statement statement = conn.createStatement();
        statement.execute(sql);
        statement.close();

        // Table 2: computer_students (and similar for other branches)
        sql = "CREATE TABLE computer_students (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "roll_no VARCHAR(255) NOT NULL," +
                "semester INT," +
                "year INT," +
                "result_sem1 VARCHAR(255)," +
                "result_sem2 VARCHAR(255)" +
                ")";
        statement = conn.createStatement();
        statement.execute(sql);
        statement.close();

        sql = "CREATE TABLE mechanical_students (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "roll_no VARCHAR(255) NOT NULL," +
                "semester INT," +
                "year INT," +
                "result_sem1 VARCHAR(255)," +
                "result_sem2 VARCHAR(255)" +
                ")";
        statement = conn.createStatement();
        statement.execute(sql);
        statement.close();
        sql = "CREATE TABLE civil_students (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "roll_no VARCHAR(255) NOT NULL," +
                "semester INT," +
                "year INT," +
                "result_sem1 VARCHAR(255)," +
                "result_sem2 VARCHAR(255)" +
                ")";
        statement = conn.createStatement();
        statement.execute(sql);
        statement.close();
        sql = "CREATE TABLE computer_students (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "roll_no VARCHAR(255) NOT NULL," +
                "semester INT," +
                "year INT," +
                "result_sem1 VARCHAR(255)," +
                "result_sem2 VARCHAR(255)" +
                ")";
        statement = conn.createStatement();
        statement.execute(sql);
        statement.close();
        sql = "CREATE TABLE electronics_students (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "roll_no VARCHAR(255) NOT NULL," +
                "semester INT," +
                "year INT," +
                "result_sem1 VARCHAR(255)," +
                "result_sem2 VARCHAR(255)" +
                ")";
        statement = conn.createStatement();
        statement.execute(sql);
        statement.close();
        sql = "CREATE TABLE MLT_students (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "roll_no VARCHAR(255) NOT NULL," +
                "semester INT," +
                "year INT," +
                "result_sem1 VARCHAR(255)," +
                "result_sem2 VARCHAR(255)" +
                ")";
        statement = conn.createStatement();
        statement.execute(sql);
        statement.close();


        // Create tables for other branches following the same pattern

        // ...
    }
}
