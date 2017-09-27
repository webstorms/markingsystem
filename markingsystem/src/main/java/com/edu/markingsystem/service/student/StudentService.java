package com.edu.markingsystem.service.student;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;

import spark.Request;
import spark.Response;

public class StudentService extends Service {
	
	public StudentService(Database db) {
		super(db);

	}

	@Override
	public void initializeREST() {
		
	}

	// get all the courses that are associated with a user
	// Needed: UserID
	public Object getCourses(Request req, Response res) {
		return null;

	}

	// add/modify user mark
	// Needed: StudentID, CourseID, Mark Details
	public Object addMark(Request req, Response res) {
		return null;

	}

	// Get the marks of an individual student (array of mark details)
	// Needed: StudentID, CourseID
	public Object getStudentMarks(Request req, Response res) {
		return null;
		
	}


}