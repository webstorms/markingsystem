package com.edu.markingsystem.db;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

import com.edu.markingsystem.service.User;
import com.edu.markingsystem.service.course.CourseStructure;

public class CourseStructureDB extends DBBase {

	public CourseStructureDB(DB db, HTreeMap map) {
		super(db, map);
		
	}
	
	public void insertCourseStructure(String courseID, CourseStructure structure) {
		map.put(courseID, structure);
		db.commit();
		
	}
	
	public CourseStructure getCourseStructure(String courseID) {
		return (CourseStructure) map.get(courseID);
				
	}

	
}