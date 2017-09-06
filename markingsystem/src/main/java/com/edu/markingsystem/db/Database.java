package com.edu.markingsystem.db;

import java.io.File;

import org.mapdb.DB;
import org.mapdb.DBMaker;

public class Database {
	
	private static final String USER_DB = "user_db";
	// private static final String MARKS_DB = "username_to_id";
	
	private DB db;
	
	private UserDB userDB;
	
	public Database(String name, String password) {
		db = DBMaker.fileDB(new File(name))
	            .closeOnJvmShutdown()
	            .encryptionEnable(password)
	            .make();
		
		userDB = new UserDB(db, db.hashMap(USER_DB));
		
	}
	
	public UserDB getUserDB() {
		return this.userDB;
		
	}
	
	public void close() {
		db.close();
		
	}
	
	
}