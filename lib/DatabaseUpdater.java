import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.write.style.WriteCellStyle;
import com.alibaba.excel.write.style.WriteStyle;
import org.apache.poi.ss.usermodel.*;  // Import for cell styling (optional)
import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DatabaseUpdater {

    public static void main(String[] args) throws IOException, SQLException {

        // Replace with your actual database connection details
        String url = "jdbc:mysql://localhost:3306/your_database";
        String username = "your_username";
        String password = "your_password";

        // Replace with the actual path to your Excel file
        String filePath = "path/to/your/student_data.xlsx";

        try (Connection conn = DriverManager.getConnection(url, username, password)) {
            updateDatabaseFromExcel(conn, filePath);
            System.out.println("Database updated successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void updateDatabaseFromExcel(Connection conn, String filePath) throws IOException, SQLException {

        // Ensure file path ends with .xls or .xlsx
        if (!filePath.endsWith(".xls") && !filePath.endsWith(".xlsx")) {
            throw new IllegalArgumentException("Unsupported file format. FastExcel supports .xls and .xlsx files.");
        }

        // Data class to represent student information (optional)
        @Sheet(name = "Students")  // Optional: Set sheet name
        public static class Student {
            @ExcelProperty("Branch")
            private String branch;
            @ExcelProperty("Semester")
            private int semester;
            @ExcelProperty("Name")
            private String name;
            @ExcelProperty("Roll No")
            private String rollNo;
            // ... (Add other student information properties)

            // Getters and setters (omitted for brevity)
        }

        try (com.alibaba.excel.write.ExcelWriter writer = new com.alibaba.excel.write.ExcelWriter(null, new File(filePath))) {

            // Read data from Excel file (assuming data class Student)
            List<Student> students = ListUtils.newArrayList(); // Use newArrayList for better performance
            for (Student student : writer.read(Student.class)) {
                students.add(student);
            }

            // Prepare SQL statement (replace with your actual table and column names)
            String sql = "INSERT INTO your_table (branch, semester, name, roll_no) VALUES (?, ?, ?, ?)";

            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {

                for (Student student : students) {
                    pstmt.setString(1, student.getBranch());
                    pstmt.setInt(2, student.getSemester());
                    pstmt.setString(3, student.getName());
                    pstmt.setString(4, student.getRollNo());

                    pstmt.addBatch();
                }

                pstmt.executeBatch(); // Execute all updates in a single batch

            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
