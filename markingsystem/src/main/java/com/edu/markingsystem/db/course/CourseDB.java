package com.edu.markingsystem.db.course;

import java.util.List;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

import com.edu.markingsystem.db.DBBase;
import com.esotericsoftware.minlog.Log;

public class CourseDB extends DBBase {

	public CourseDB(DB db, HTreeMap map) {
		super(db, map);

	}

	/**
	 * Insert user course records.
	 * @param id
	 * @param courses
	 */
	
	public void insertCourses(String id, List<Course> courses) {
		map.put(id, courses);
		db.commit();

	}

	/**
	 * Add a single course to the user
	 * @param id
	 * @param course
	 * @throws Exception 
	 */
	
	public void addCourse(String id, Course course) {
		List<Course> courses = (List<Course>) map.get(id);
		if(courses == null) {
			Log.info("addCourse did not work. Call insertCourses first.");
			return;
		}
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
	
	public void removeCourse(String id, Course course) {
		List<Course> courses = (List<Course>) map.get(id);
		if(courses == null) {
			Log.info("removeCourse did not work. Call insertCourses first.");
			return;
		}
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
	
	public List<Course> getCourses(String id) {
		return (List<Course>) map.get(id);

	}


}