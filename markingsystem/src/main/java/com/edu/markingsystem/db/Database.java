package com.edu.markingsystem.db;

import java.io.File;

import org.mapdb.DB;
import org.mapdb.DBMaker;

public class Database {
	
	private static final String USER_DB = "users";
	private static final String COURSES_DB = "courses";
	
	private DB db;
	
	private UserDB userDB;
	private CourseDB courseDB;
	
	public Database(String name, String password) {
		db = DBMaker.fileDB(new File(name))
	            .closeOnJvmShutdown()
	            .encryptionEnable(password)
	            .make();
		userDB = new UserDB(this, db, db.hashMap(USER_DB));
		courseDB = new CourseDB(this, db, db.hashMap(COURSES_DB));
		
	}
	
	public UserDB getUserDB() {
		return this.userDB;
		
	}
	
	public CourseDB getCourseDB() {
		return this.courseDB;
		
	}
	
	public void close() {
		db.close();
		
	}
	
	
}