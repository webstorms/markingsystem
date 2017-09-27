package com.edu.markingsystem.service.course;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;

import spark.Request;
import spark.Response;

public class CourseService extends Service {

	public CourseService(Database db) {
		super(db);

	}

	@Override
	public void initializeREST() {

	}

	// Add a new course to the database
	// Needed: CourseDetails
	public Object addCourse(Request req, Response res) {
		return null;

	}
	
	// Get the details of a course (return CourseDetails object)
	// Needed: CourseID
	public Object getCourseDetails(Request req, Response res) {
		return null;

	}

	// Add marks from an excel sheet
	// Needed: CourseID, MarkSheet
	public Object addCourseMarks(Request req, Response res) {
		return null;

	}

	// Get excel sheet of all marks (return marksheet object)
	// Key: CourseID
	public Object getCourseMarks(Request req, Response res) {
		return null;

	}
	
	// Get all the students enrolled in a course (array of student ids)
	// Key: CourseID
	public Object getStudents(Request req, Response res) {
		return null;

	}

}
