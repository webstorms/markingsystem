package com.edu.markingsystem.service.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.edu.markingsystem.PasswordUtil;
import com.edu.markingsystem.service.course.BottomLevel;
import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.course.MidLevel;
import com.edu.markingsystem.service.course.TopLevel;

public class User implements java.io.Serializable {
	
	private String passwordHash;
	private UserType userType;
	private List<String> courses; // All the courses the user is enrolled in
	private HashMap<String, CourseStructure> marks; // All the marks associated with those courses
	
	public User(String password, UserType userType) {
		this.passwordHash = PasswordUtil.hashPassword(password);
		this.userType = userType;
		this.courses = new ArrayList<String>();
		this.marks = new HashMap<String, CourseStructure>();
		
	}
	
	public List<String> getCourses() {
		return this.courses;
		
	}
	
	public CourseStructure getMarks(String courseID) {
		return this.marks.get(courseID);
		
	}
	
	public void addMark(String courseID, String top, String mid, String bottom, int mark) {
		
		CourseStructure marks = this.getMarks(courseID);
		
		// Find Top Level
		for(TopLevel topLevel : marks.getTopLevels()) {
			if(topLevel.getName().equals(top)) {
				
				// Find Mid Level
				for(MidLevel midLevel : topLevel.getMidLevels()) {
					if(midLevel.getName().equals(mid)) {
					
						// Find Bottom Level
						for(BottomLevel bottomLevel : midLevel.getBottomLevel()) {
							
							if(bottomLevel.getName().equals(bottom)) {
								System.out.println(top + " " + mid + " " + bottom);
								bottomLevel.setMark(mark);
								
							}
							
						}
						
						
					}
					
				}
				
			}
			
		}
		
		this.updateMarks(courseID, marks);
	}
	
	public void updateCourse(String courseID, CourseStructure newStructure) {
		CourseStructure currentStructure = this.getMarks(courseID);
		
		// Add existing marks from currentStructure to newStructure
		List<String> bottomIDs = new ArrayList<String>(newStructure.getBottomLevelIDs().keySet());
		
		for(String id : bottomIDs) {
			BottomLevel level = currentStructure.getBottomLevelIDs().get(id);
			// Does the new structure have the bottom level that was contained in the old structure
			if(level != null) {
				int mark = level.getMark();
				int maxMark = level.getMaxMark();
				newStructure.getBottomLevelIDs().get(id).setMark(mark);
				newStructure.getBottomLevelIDs().get(id).setMaxMark(maxMark);
				
			}
			
		}
		
		this.updateMarks(courseID, newStructure);
		
	}
	
	public void addCourse(String courseID, CourseStructure structure) {
		this.courses.add(courseID);
		this.marks.put(courseID, structure);
		
	}
	
	public void removeCourse(String courseID) {
		this.courses.remove(courseID);
		this.marks.remove(courseID);
		
	}
	
	public void updateMarks(String courseID, CourseStructure structure) {
		this.marks.put(courseID, structure);
		
	}
	
	public String getPassword() {
		return this.passwordHash;
		
	}
	
	public UserType getUserType(){
		return this.userType;
		
	}

	public void setPassword(String password) {
		this.passwordHash = PasswordUtil.hashPassword(password);
	}
	
	
}