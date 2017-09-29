package com.edu.markingsystem.db;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

import com.edu.markingsystem.service.User;

public class UserDB extends DBBase {

	public UserDB(DB db, HTreeMap<String, User> map) {
		super(db, map);
		
	}
	
	public void insertUser(String id, User user) {
		map.put(id, user);
		db.commit();
		
	}
	
	public User getUser(String id) {
		return (User) map.get(id);
				
	}

	public void deleteUser(String id) {
		map.remove(id);
		db.commit();
		
	}
	
	public void changePassword(String userID, String password) {
		User u = (User) map.get(userID);
		u.setPassword(password);
		map.replace(userID, u);
		db.commit();
		
	}
	
	
}