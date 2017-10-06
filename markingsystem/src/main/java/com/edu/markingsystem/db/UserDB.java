package com.edu.markingsystem.db;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.user.User;

public class UserDB extends DBBase {

	public UserDB(Database database, DB db, HTreeMap<String, User> map) {
		super(database, db, map);
		
	}
	
	public void addUser(String id, User user) {
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
	
	public List<String> getUsers(String phrase) {
		Set<String> set = map.keySet();
		
		List<String> user = new ArrayList<String>();
		
		for(String id : set) {
			if(id.contains(phrase)) user.add(id);
			
		}
		
		return user;
		
	}
	
	public void changePassword(String userID, String password) {
		User u = (User) map.get(userID);
		u.setPassword(password);
		map.replace(userID, u);
		db.commit();
		
	}
	
	public void addCourse(String userID, String courseID) {
		User u = (User) getUser(userID);
		CourseStructure structure = this.dbCoordinator.getCourseDB().getCourse(courseID).getStructure();
		u.addCourse(courseID, structure);
		map.replace(userID, u);
		db.commit();
		
	}

	public void removeCourse(String userID, String courseID) {
		User u = (User) getUser(userID);
		u.removeCourse(courseID);
		map.replace(userID, u);
		db.commit();
		
	}
	
//	public void addMark(String userID, String courseID, CourseStructure structure) {
//		User u = (User) getUser(userID);
//		u.updateMarks(courseID, structure);
//		map.replace(userID, u);
//		db.commit();
//		
//	}
	
	
}