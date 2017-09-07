package com.edu.markingsystem.db;

import com.edu.markingsystem.PasswordUtil;

public class User implements java.io.Serializable {
	
	// At the moment the User object only contains a single string
	// But this could be extended to contain more user details
	// if need be
	
	private String passwordHash;
	private String userType;
	
	public User(String password) {
		this.passwordHash = PasswordUtil.hashPassword(password);
		userType = "";
		
	}
	public User(String password, String userType) {
		this.passwordHash = PasswordUtil.hashPassword(password);
		this.userType = userType;
		
	}
	
	public String getPassword() {
		return this.passwordHash;
		
	}
	public String getUserType(){
		return this.userType;
	}

	
}