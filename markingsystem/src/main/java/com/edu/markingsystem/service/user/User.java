package com.edu.markingsystem.service.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.edu.markingsystem.PasswordUtil;
import com.edu.markingsystem.service.course.CourseStructure;

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
	
//	public void addCourses(List<String> courses) {
//		for(String course : courses) this.addCourse(course);
//		
//	}
	
	public void addCourse(String course, CourseStructure structure) {
		this.courses.add(course);
		this.marks.put(course, structure);
		
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