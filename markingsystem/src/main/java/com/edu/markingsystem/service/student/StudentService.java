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

		Spark.post("/getStudentMarks", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /getStudentMarks " + req.ip());
			return getStudentMarks(req, res);
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
		if(!userExists(userID)) {
			response = Service.RESPONSE_USER_DOES_NOT_EXIST;
		}
		else { 
			List<String> courses = db.getCourseDB().getCourses(userID);
			response = Util.objectToJson(courses);
			System.out.println(userID + " " + courses);
			
		}
		return Util.objectToJson(response);
		
	}

	// Get the marks of an individual student (array of mark details)
	// Needed: StudentID, CourseID
	public Object getStudentMarks(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String courseID = json.get("courseID").getAsString();
		String response = "";
		if(!userExists(userID)) {
			response = Service.RESPONSE_USER_DOES_NOT_EXIST;
		}
		else { 
			CourseStructure marks = db.getMarksDB().getMarks(userID, courseID);
			response = Util.objectToJson(marks);
			
		}
		return Util.objectToJson(response);
		
	}

	// add/modify user mark
	// Needed: StudentID, CourseID, Mark Details
	public Object addMark(Request req, Response res) {
		return null;

	}


}