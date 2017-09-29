package com.edu.markingsystem.db;

import java.util.ArrayList;
import java.util.List;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

import com.esotericsoftware.minlog.Log;

public class UserCoursesDB extends DBBase {

	/**
	 * Database maps userIDs to courseIDs
	 * @param db
	 * @param map
	 */
	
	public UserCoursesDB(DB db, HTreeMap map) {
		super(db, map);

	}

	/**
	 * Ovewrites any existing courses associated with user.
	 * @param id
	 * @param courses
	 */
	
	public void insertCourses(String id, List<String> courses) {
		map.put(id, courses);
		db.commit();

	}

	/**
	 * Add a single course to the user
	 * @param id
	 * @param course
	 * @throws Exception 
	 */
	
	public void addCourse(String id, String course) {
		List<String> courses = (List<String>) map.get(id);
		if(courses == null) insertCourses(id, new ArrayList<String>());
		courses.add(course);
		map.replace(id, courses);
		db.commit();
		
	}

	/**
	 * Remove a single course from a user
	 * @param id
	 * @param course
	 * @throws Exception 
	 */
	
	public void removeCourse(String id, String course) {
		List<String> courses = (List<String>) map.get(id);
		if(courses == null) insertCourses(id, new ArrayList<String>());
		courses.remove(course);
		map.replace(id, courses);
		db.commit();
		
	}
	
	/**
	 * Delete user course records.
	 * @param id
	 * @param courses
	 */
	
	public void deleteCourses(String id) {
		map.remove(id);
		db.commit();
		
	}
	
	public List<String> getCourses(String id) {
		return (List<String>) map.get(id);
		
	}


}