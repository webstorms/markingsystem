package com.edu.markingsystem.service.student;

import java.util.List;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.user.UserService;
import com.esotericsoftware.minlog.Log;
import com.google.gson.JsonElement;
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

//		Spark.post("/addMark", (req, res) -> {
//			Log.info(this.getClass().getName(), "POST /addMark " + req.ip());
//			return addMark(req, res);
//		});

		Spark.post("/getMarks", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /getStudentMarks " + req.ip());
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
		
		String userID;
		if(Util.stringToJson(req.body()).get("userID").getAsString().equals("")) userID = UserService.getIDFromSession(req);
		else userID = Util.stringToJson(req.body()).get("userID").getAsString();
		
		System.out.println(userID);
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
		System.out.println(userID);
		CourseStructure marks = db.getUserDB().getUser(userID).getMarks(courseID);		
		marks.calculatePercentages();
		marks.init();
		return Util.objectToJson(marks);
		
	}
	
	// Note: top, mid and bottom are indexes. When loading the course
	// Content it comes in a certain order. top, mid and bottom are the indeces
	// of that order
	// EXAMPLE: EXAME > EXAM1, EXAM2. EXAM1 > SECTONA, SECTIONB.
	// To add mark for SECTIONA top = 0, mid = 0, bottom = 0
	
//	public Object addMark(Request req, Response res) {
//		String response = "success";
//		try{
//			JsonObject json = Util.stringToJson(req.body());
//			String userID = json.get("userID").getAsString();
//			String courseID = json.get("courseID").getAsString();
//			int mark = json.get("mark").getAsInt();
//			int top = json.get("top").getAsInt();
//			int mid = json.get("mid").getAsInt();
//			int bottom = json.get("bottom").getAsInt();
//			CourseStructure marks = db.getUserDB().getUser(userID).getMarks(courseID);
//			marks.getTop(top).getMid(mid).getBottom(bottom).setMark(mark);
//			db.getUserDB().addMark(userID, courseID, marks);
//		}
//		catch(Exception e) {
//			response = "invalidParamters";
//		}
//		return Util.objectToJson(response);
//
//	}


}