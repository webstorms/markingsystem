package com.edu.markingsystem.service.student;

import java.util.List;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
import com.edu.markingsystem.service.course.CourseStructure;
import com.esotericsoftware.minlog.Log;
import com.google.gson.JsonObject;

import spark.Request;
import spark.Response;
import spark.Spark;

public class StudentService extends Service {

	public StudentService(Database db) {
		super(db);

	}

	@Override
	public void initializeREST() {
		Spark.post("/getCourses", (req, res) -> { 
			Log.info(this.getClass().getName(), "POST /getCourses " + req.ip());
			return getCourses(req, res);
		});
		
		Spark.post("/addMark", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /addMark " + req.ip());
			return addMark(req, res);
		});

		Spark.post("/getMarks", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /getMarks " + req.ip());
			return getMarks(req, res);
		});

	}

	/**
	 * Get all the courses that are associated with a user. Request needs to specify: [userID]
	 * @param req
	 * @param res
	 * @return
	 */
	public Object getCourses(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String response = "";
		List<String> courses = db.getUserDB().getUser(userID).getCourses();
		response = Util.objectToJson(courses);
		
		return Util.objectToJson(response);
		
	}

	// Get the marks of an individual student (array of mark details)
	// Needed: StudentID, CourseID
	public Object getMarks(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String courseID = json.get("courseID").getAsString();
		String response = "";
		CourseStructure marks = db.getUserDB().getUser(userID).getMarks(courseID);
		response = Util.objectToJson(marks);
		
		return Util.objectToJson(response);
		
	}

	// add/modify user mark
	// Needed: StudentID, CourseID, Mark Details
	public Object addMark(Request req, Response res) {
		return null;

	}


}