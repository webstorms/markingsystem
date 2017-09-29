package com.edu.markingsystem.db;

import com.edu.markingsystem.PasswordUtil;

public class User implements java.io.Serializable {
	
	// At the moment the User object only contains a single string
	// But this could be extended to contain more user details
	// if need be
	
	private String passwordHash;
	private UserType userType;
	
	public User(String password, UserType userType) {
		this.passwordHash = PasswordUtil.hashPassword(password);
		this.userType = userType;
		
	}
	
	public String getPassword() {
		return this.passwordHash;
		
	}
	
	public UserType getUserType(){
		return this.userType;
		
	}

	public void setPassword(String password){
		this.passwordHash = PasswordUtil.hashPassword(password);
	}
	
	
}