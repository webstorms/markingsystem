package com.edu.markingsystem.db;

import java.util.ArrayList;
import java.util.List;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

import com.edu.markingsystem.service.course.Course;

public class CourseDB extends DBBase {

	public CourseDB(Database dbCoordinator, DB db, HTreeMap map) {
		super(dbCoordinator, db, map);

	}

	/**
	 * Add a course.
	 * @param id
	 * @param course
	 * @throws Exception 
	 */
	
	public void addCourse(Course course) {
		map.put(course.getCourseID(), course);
		db.commit();
		
	}
	
	/**
	 * Delete course.
	 * @param id
	 * @param courses
	 */
	
	public void deleteCourse(String id) {
		map.remove(id);
		db.commit();
		
	}
	
	public Course getCourse(String id) {
		return (Course) map.get(id);

	}
	
	public List<String> getAllCourseIDs(){
		List<String> output = new ArrayList<String>(map.keySet());
		
		return output;
	}


}