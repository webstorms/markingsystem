package com.edu.markingsystem.db;

import java.util.ArrayList;

import org.mapdb.DB;
import org.mapdb.HTreeMap;

import com.edu.markingsystem.service.course.CourseStructure;
import com.esotericsoftware.minlog.Log;

public class MarksDB extends DBBase {

	public MarksDB(DB db, HTreeMap map) {
		super(db, map);
		
	}
	
	public void insert(String userID, String courseID, CourseStructure structure) {
		map.put(userID + courseID, structure);
		db.commit();
		
	}
	
	public void insertMark(String userID, String courseID, int top, int mid, int bottom, int mark) {
		CourseStructure marks = getMarks(userID, courseID);
		// TODO: Check if marks is null or not
		marks.getTop(top).getMid(mid).getBottom(bottom).setMark(mark);
		insert(userID, courseID, marks);
		db.commit();
		
	}
	
	/**
	 * Get a course object (student marks)
	 * @param userID
	 * @param courseID
	 * @return
	 */
	
	public CourseStructure getMarks(String userID, String courseID) {
		return (CourseStructure) map.get(userID + courseID);
				
	}
	
	
}