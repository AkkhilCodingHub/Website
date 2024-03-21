import java.sql.*;

public class db {
    public static void main(String[] args) {
        try (Connection connection = DriverManager.getConnection("jdbc:derby:mydatabase");
             Statement statement = connection.createStatement()) {

            // Insert data into the database
            statement.executeUpdate("INSERT INTO mytable(id, name) VALUES (1, 'John')");

            // Retrieve data from the database
            ResultSet resultSet = statement.executeQuery("SELECT * FROM mytable");
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                System.out.println("ID: " + id + ", Name: " + name);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
