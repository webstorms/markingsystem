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

		// Create students
		db.getUserDB().addUser("student1", new User("1234", UserType.STUDENT));
		db.getUserDB().addUser("student2", new User("1234", UserType.STUDENT));

		// Create TA
		db.getUserDB().addUser("ta1", new User("1234", UserType.TA));

		// Create lecturer
		db.getUserDB().addUser("lec1", new User("1234", UserType.LECTURER));

		// Create a course
		BottomLevel b1 = new BottomLevel("Section A", 50);
    	BottomLevel b2 = new BottomLevel("Section B", 50);
    	BottomLevel b3 = new BottomLevel("Section A", 100);
    	BottomLevel b4 = new BottomLevel("Section A", 50);
    	BottomLevel b5 = new BottomLevel("Section B", 50);
    	MidLevel midLevel = new MidLevel("Exam1", 100);
    	MidLevel midLevel2 = new MidLevel("Exam2", 100);
    	MidLevel midLevel3 = new MidLevel("Test1", 100);
    	MidLevel midLevel4 = new MidLevel("Test2", 100);
    	midLevel.addBottomLevel(b1);
    	midLevel.addBottomLevel(b2);
    	midLevel2.addBottomLevel(b3);
    	midLevel3.addBottomLevel(b4);
    	midLevel3.addBottomLevel(b5);
    	TopLevel topLevel = new TopLevel("Exams", 100, 50);
    	TopLevel topLevel1 = new TopLevel("Tests", 100, 50);
    	topLevel.addMidLevel(midLevel);
    	topLevel.addMidLevel(midLevel2);
    	topLevel1.addMidLevel(midLevel3);
    	topLevel1.addMidLevel(midLevel4);
		CourseStructure course = new CourseStructure();
		course.addTopLevel(topLevel);
		course.addTopLevel(topLevel1);
		
		List<String> students = new ArrayList<String>();
		students.add("student1");
		students.add("student2");
		List<String> TAs = new ArrayList<String>();
		TAs.add("ta1");
		List<String> lecturers = new ArrayList<String>();
		lecturers.add("lec1");
		
		Course courseA = new Course("Mam1000", "mam100017", "2017", "F", "lec1", lecturers, TAs, students, course);
		db.getCourseDB().addCourse(courseA);

		// Add courses to user
		db.getUserDB().addCourse("admin", "mam100017");
		db.getUserDB().addCourse("student1", "mam100017");
		db.getUserDB().addCourse("student2", "mam100017");
		
	}


}