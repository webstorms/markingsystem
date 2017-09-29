package com.edu.markingsystem;

import java.util.ArrayList;
import java.util.List;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.db.UserType;
import com.edu.markingsystem.service.User;
import com.edu.markingsystem.service.course.BottomLevel;
import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.course.MidLevel;
import com.edu.markingsystem.service.course.TopLevel;

public class App {
	
	private static final String DB_NAME = "db";
	private static final String DB_PASS = "1234"; // In real life setting not hardcoded but stored as system var
	
    public static void main(String[] args) {
    	
    	Database db = new Database(DB_NAME, DB_PASS);
    	
    	db.getUserDB().insertUser("student", new User("student", UserType.STUDENT));
    	
    	// Create a user
    	db.getUserDB().insertUser("admin", new User("admin", UserType.ADMIN));
    	
    	// Create a course
    	BottomLevel b1 = new BottomLevel("Section A", 50);
    	BottomLevel b2 = new BottomLevel("Section B", 50);
    	MidLevel midLevel = new MidLevel("Exam1", 100);
    	midLevel.addBottomLevel(b1);
    	midLevel.addBottomLevel(b2);
    	TopLevel topLevel = new TopLevel("Exams", 100, 50);
    	topLevel.addMidLevel(midLevel);
    	CourseStructure course = new CourseStructure("course1", "id1");
    	course.addTopLevel(topLevel);
    	db.getCourseStructureDB().insertCourseStructure("id1", course);
    	
    	// Add courses to user
    	List<String> courses = new ArrayList<String>();
    	courses.add("id1");
    	courses.add("id2");
    	db.getCourseDB().insertCourses("admin", courses);
    	for(String courseID : courses) {
    		db.getMarksDB().insert("admin", "id1", course);
    		
    	}
    	// Add mark to user
    	db.getMarksDB().insertMark("admin", "id1", 0, 0, 0, 45);
    	
    	new Server(db);
    	
    }
    
    
}