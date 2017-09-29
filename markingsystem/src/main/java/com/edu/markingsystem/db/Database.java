package com.edu.markingsystem.db;

import java.io.File;

import org.mapdb.DB;
import org.mapdb.DBMaker;

public class Database {
	
	private static final String USER_DB = "users";
	private static final String COURSES_DB = "user_courses";
	private static final String MARKS_DB = "marks";
	private static final String COURSE_STRUCTURE_DB = "course_structure";
	
	private DB db;
	
	private UserDB userDB;
	private UserCoursesDB courseDB;
	private MarksDB marksDB;
	private CourseStructureDB courseStructureDB;
	
	public Database(String name, String password) {
		db = DBMaker.fileDB(new File(name))
	            .closeOnJvmShutdown()
	            .encryptionEnable(password)
	            .make();
		
		userDB = new UserDB(db, db.hashMap(USER_DB));
		courseDB = new UserCoursesDB(db, db.hashMap(COURSES_DB));
		marksDB = new MarksDB(db, db.hashMap(MARKS_DB));
		courseStructureDB = new CourseStructureDB(db, db.hashMap(COURSE_STRUCTURE_DB));
		
	}
	
	public UserDB getUserDB() {
		return this.userDB;
		
	}
	
	public UserCoursesDB getCourseDB() {
		return this.courseDB;
		
	}
	
	public MarksDB getMarksDB() {
		return this.marksDB;
		
	}
	
	public CourseStructureDB getCourseStructureDB() {
		return this.courseStructureDB;
		
	}
	
	public void close() {
		db.close();
		
	}
	
	
}