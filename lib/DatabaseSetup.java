import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseSetup {

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

        // Branch tables (e.g., computer_branch)
        String[] branchNames = {"Computer Science", "Mechanical Engineering", "Civil Engineering", "Architecture Engineering", "Instrumentation Control"};
        for (String branchName : branchNames) {
            sql = "CREATE TABLE " + branchName.toLowerCase() + "_branch (" +
                    "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                    "branch_name VARCHAR(255) NOT NULL," +
                    ")";
            statement = conn.createStatement();
            statement.execute(sql);
            statement.close();
        }

        // Semester tables within each branch
        for (String branchName : branchNames) {
            sql = "CREATE TABLE " + branchName.toLowerCase() + "_semester (" +
                    "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                    "semester_no INT," +
                    "branch_id INT REFERENCES " + branchName.toLowerCase() + "_branch(id)," + // Foreign key constraint
                    ")";
            statement = conn.createStatement();
            statement.execute(sql);
            statement.close();
        }

        // Student tables within each semester
        for (String branchName : branchNames) {
            sql = "CREATE TABLE " + branchName.toLowerCase() + "_semester_student (" +
                    "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                    "name VARCHAR(255) NOT NULL," +
                    "roll_no VARCHAR(255) NOT NULL," +
                    "semester_id INT REFERENCES " + branchName.toLowerCase() + "_semester(id)," + // Foreign key constraint
                    ")";
            statement = conn.createStatement();
            statement.execute(sql);
            statement.close();
        }

        // MLT Student table (without nested semesters)
        sql = "CREATE TABLE mlt_students (" +
                "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1)," +
                "name VARCHAR(255) NOT NULL," +
                "roll_no VARCHAR(255) NOT NULL," +
                "... (add columns for student information as needed)" + // Add more student info columns
                ")";
        statement = conn.createStatement();
        statement.execute(sql);
        statement.close();
    }
}
