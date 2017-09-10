package com.edu.markingsystem.db;

import com.edu.markingsystem.PasswordUtil;
import com.edu.markingsystem.db.Type.userType;

public class User implements java.io.Serializable {
	
	// At the moment the User object only contains a single string
	// But this could be extended to contain more user details
	// if need be
	
	private String passwordHash;
	private userType userType;
	
	public User(String password) {
		this.passwordHash = PasswordUtil.hashPassword(password);
		userType = userType.NULL;
		
	}
	public User(String password, userType userType) {
		this.passwordHash = PasswordUtil.hashPassword(password);
		this.userType = userType;
		
	}
	
	public String getPassword() {
		return this.passwordHash;
		
	}
	public userType getUserType(){
		return this.userType;
	}

	
}