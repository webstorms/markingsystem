package com.edu.markingsystem.service.course;

import java.util.List;

public class Course implements java.io.Serializable {
	
	private String courseName;
	private String courseID;
	private String year;
	private String period;
	
	private String courseConvenor;
	private List<String> lecturers;
	private List<String> TAs;
	private List<String> students;
	
	private CourseStructure structure;
	
	public Course(String courseName, String courseID, String year, String period, String courseConvenor, List<String> lecturers, List<String> TAs, List<String> students, CourseStructure structure) {
		this.courseName = courseName;
		this.courseID = courseID;
		this.year = year;
		this.period = period;
		this.courseConvenor = courseConvenor;
		this.lecturers = lecturers;
		this.TAs = TAs;
		this.students = students;
		this.structure = structure;
		
	}
	
	public void setCourseConvenor(String id) {
		this.courseConvenor = id;
		
	}
	
	public String getCourseName() {
		return courseName;
	}

	public String getCourseID() {
		return courseID;
	}

	public String getYear() {
		return year;
	}

	public String getPeriod() {
		return period;
	}

	public String getCourseConvenor() {
		return courseConvenor;
	}

	public List<String> getLecturers() {
		return lecturers;
	}
	
	public void addLecturers(String ID){
		this.lecturers.add(ID);
	}

	public List<String> getTAs() {
		return TAs;
	}

	public void addTA(String ID){
		this.TAs.add(ID);
	}
	
	public List<String> getStudents() {
		return students;
	}
	
	public void addStudent(String ID){
		this.students.add(ID);
	}

	public CourseStructure getStructure() {
		return structure;
	}

	public void setStructure(CourseStructure newStructure) {
		this.structure = newStructure;
		
	}
	
	
}