package com.edu.markingsystem;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.db.User;
import com.edu.markingsystem.db.UserType;

public class App {
	
	private static final String DB_NAME = "db";
	private static final String DB_PASS = "1234"; // In real life setting not hardcoded but stored as system var
	
    public static void main(String[] args) {
    	
    	Database db = new Database(DB_NAME, DB_PASS);
    	
    	// Test user object, not my real password bois ;)
    	// Feel free to add yourselves :)
    	// db.getUserDB().insertUser("tylchr011", new User("1234"));
    	db.getUserDB().insertUser("admin", new User("admin", UserType.ADMIN));
    	db.getUserDB().insertUser("student", new User("student", UserType.STUDENT));
    	
    	
    	new Server(db);
    	
    }
    
    
}