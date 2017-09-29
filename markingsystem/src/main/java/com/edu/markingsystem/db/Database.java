package com.edu.markingsystem.db;

import java.io.File;

import org.mapdb.DB;
import org.mapdb.DBMaker;

import com.edu.markingsystem.db.course.CourseDB;

public class Database {
	
	private static final String USER_DB = "user_db";
	
	private DB db;
	
	private UserDB userDB;
	private CourseDB courseDB;
	
	public Database(String name, String password) {
		db = DBMaker.fileDB(new File(name))
	            .closeOnJvmShutdown()
	            .encryptionEnable(password)
	            .make();
		
		userDB = new UserDB(db, db.hashMap(USER_DB));
		courseDB = new CourseDB(db, db.hashMap(USER_DB));
		
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