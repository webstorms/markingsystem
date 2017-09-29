package com.edu.markingsystem.service;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.db.UserType;

public abstract class Service {

	// Generic Responses
	public static final String RESPONSE_USER_DOES_NOT_EXIST = "UserDoesNotExist";
	public static final String SUCCESS = "Success";
	public static final String PRIVILEGE_ERROR = "PrivilegeError";
	
	protected Database db;

	public Service(Database db) {
		this.db = db;
		this.initializeREST();

	}

	public abstract void initializeREST();
	
	protected boolean userExists(String userID) {
		User user = db.getUserDB().getUser(userID);
		return user != null;

	}
	
	protected boolean userHasPrivilege(String userID, UserType type) {
		UserType t = db.getUserDB().getUser(userID).getUserType();
		return t == type;

	}
	
	
}