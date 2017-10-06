package com.edu.markingsystem.service.student;

import java.util.List;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.user.UserService;
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

		Spark.post("/getMarks", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /getMarks " + req.ip());
			return getMarks(req, res);
		});
		
	}

	/**
	 * Get all the courses associated with a user object. Supply userID. If no userID is passed it will be retrieved from the session.
	 * @param req
	 * @param res
	 * @return
	 */

	public Object getCourses(Request req, Response res) {
		String response = "success";
		try {
			String userID;
			if(Util.stringToJson(req.body()).get("userID").getAsString().equals("")) userID = UserService.getIDFromSession(req);
			else userID = Util.stringToJson(req.body()).get("userID").getAsString();
			List<String> courses = db.getUserDB().getUser(userID).getCourses();
			return Util.objectToJson(courses);
			
		}
		catch(Exception e) {
			e.printStackTrace();
			response = e.getMessage();

		}

		return Util.objectToJson(response);

	}
	
	/**
	 * Get the marks of a student for a given course. This will return a course structure object. Supply userID and courseID.
	 * If no userID is passed it will be retrieved from the session.
	 * @param req
	 * @param res
	 * @return
	 */
	
	public Object getMarks(Request req, Response res) {
		try {
			JsonObject json = Util.stringToJson(req.body());
			String userID;
			if(Util.stringToJson(req.body()).get("userID").getAsString().equals("")) userID = UserService.getIDFromSession(req);
			else userID = Util.stringToJson(req.body()).get("userID").getAsString();
			String courseID = json.get("courseID").getAsString();
			
			System.out.println(userID);
			System.out.println(courseID);
			
			CourseStructure marks = db.getUserDB().getUser(userID).getMarks(courseID);	
			marks.calculatePercentages();
			marks.init();
			return Util.objectToJson(marks);
			
		}
		catch(Exception e) {
			e.printStackTrace();
			return Util.objectToJson(e.getMessage());
			
		}
		
	}


}