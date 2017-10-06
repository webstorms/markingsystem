package com.edu.markingsystem;

import java.util.ArrayList;
import java.util.List;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.course.BottomLevel;
import com.edu.markingsystem.service.course.Course;
import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.course.MidLevel;
import com.edu.markingsystem.service.course.TopLevel;
import com.edu.markingsystem.service.user.User;
import com.edu.markingsystem.service.user.UserType;

public class App {

	private static final String DB_NAME = "db";
	private static final String DB_PASS = "1234"; // In real life setting not hardcoded but stored as system var

	public static void main(String[] args) {
		Database db = new Database(DB_NAME, DB_PASS);
		initTestData(db);
		new Server(db);
		
	}

	private static void initTestData(Database db) {
		// Create admin
		db.getUserDB().addUser("admin", new User("1234", UserType.ADMIN));
		
		// Create admin staff
		db.getUserDB().addUser("adminstaff", new User("1234", UserType.ADMINSTAFF));

		// Create students
		db.getUserDB().addUser("student1", new User("1234", UserType.STUDENT));
		db.getUserDB().addUser("student2", new User("1234", UserType.STUDENT));
		for(int i=3; i<4; i++){
			db.getUserDB().addUser("student"+i, new User("1234", UserType.STUDENT));
		}

		// Create TA
		db.getUserDB().addUser("ta1", new User("1234", UserType.TA));

		// Create lecturer
		db.getUserDB().addUser("lec1", new User("1234", UserType.LECTURER));
		db.getUserDB().addUser("lec2", new User("1234", UserType.LECTURER));
		
		// Create a course
		BottomLevel b1 = new BottomLevel("Section A", 50);
		BottomLevel b2 = new BottomLevel("Section B", 50);
		MidLevel midLevel = new MidLevel("Exam1", 100);
		midLevel.addBottomLevel(b1);
		midLevel.addBottomLevel(b2);
		TopLevel topLevel = new TopLevel("Exams", 100, 50);
		topLevel.addMidLevel(midLevel);
		CourseStructure course = new CourseStructure();
		course.addTopLevel(topLevel);
		
		List<String> students = new ArrayList<String>();
		students.add("student1");
		List<String> TAs = new ArrayList<String>();
		TAs.add("ta1");
		List<String> lecturers = new ArrayList<String>();
		lecturers.add("lec1");
		
		Course courseA = new Course("Mam1000", "mam100017", "2017", "F", "lec1", lecturers, TAs, students, course);
		db.getCourseDB().addCourse(courseA);
		
		Course courseB = new Course("CSC1017", "csc100017", "2017", "F", "lec1", lecturers, TAs, students, course);
		db.getCourseDB().addCourse(courseB);
		
//		System.out.println(courseA.getStructure().toString());
//		
//		// Placeholder course to test functionality
//		Course courseB = new Course("CSC3003", "CSC300317", "2017", "S", "lec1", lecturers, TAs, students, course);
//		db.getCourseDB().addCourse(courseB);

		// Add courses to user
		db.getUserDB().addCourse("student1", "mam100017");
		db.getUserDB().addCourse("student2", "mam100017");
		db.getUserDB().addCourse("student1", "csc100017");
		db.getUserDB().addCourse("student2", "csc100017");

	}


}