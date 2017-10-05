package com.edu.markingsystem.service.course;

import java.util.List;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
import com.edu.markingsystem.service.user.User;
import com.edu.markingsystem.service.user.UserType;
import com.esotericsoftware.minlog.Log;
import com.google.gson.JsonObject;

import spark.Request;
import spark.Response;
import spark.Spark;

public class CourseService extends Service {

	/*
	 * At the moment all course details can be fetched from the getCourse API. Could split this up
	 * into multiple methods if it makes the front end easier.
	 */
	
	public CourseService(Database db) {
		super(db);

	}

	@Override
	public void initializeREST() {
		Spark.post("/createCourse", (req, res) -> { 
			Log.info(this.getClass().getName(), "POST /createCourse " + req.ip());
			return createCourse(req, res);
		});
		
		Spark.post("/getCourse", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /getCourse " + req.ip());
			return getCourse(req, res);
		});
		
		Spark.post("/addStudentToCourse", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /addStudentToCourse " + req.ip());
			return addStudentToCourse(req, res);
		});
		
	}

	public Object updateCourse(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());
			String courseID = json.get("courseID").getAsString();
			CourseStructure newStructure = Util.fromJson(json.get("structure").getAsString(), CourseStructure.class);
			newStructure.init();
			
			// Update the courses course structure
			Course course = this.db.getCourseDB().getCourse(courseID);
			course.setStructure(newStructure);
			this.db.getCourseDB().addCourse(course);
			
			// Update the marks of each user
			for(String id : course.getStudents()) {
				User user = this.db.getUserDB().getUser(id);
				user.updateCourse(courseID, newStructure);
				this.db.getUserDB().addUser(id, user);
				
			}
			
		}
		catch(Exception e) {
			response = e.getMessage();
		}
		
		return Util.objectToJson(response);
		
	}
	
	/*
	 * Note: 
	 * Make sure to pass JSONArrays for the lecturers, TAs and students.
	 * structure parameter needs to be in JSON format for the CourseStructure,
	 * Can see format by:
	 * CourseStructure marks = new CourseStructure();
	 * Util.objectToJson(marks)
	 * Note: cann set marks and percentages to 0 as these are computed automatically for each user.
	 */
	
	public Object createCourse(Request req, Response res) {
		String response = null;
		
		try {
			JsonObject json = Util.stringToJson(req.body());
			String courseName = json.get("courseName").getAsString();
			String courseID = json.get("courseID").getAsString();
			String year = json.get("year").getAsString();
			String period = json.get("period").getAsString();
			String courseConvenor = json.get("courseConvenor").getAsString();
			List<String> lecturers = Util.toList(json.get("lecturers").getAsJsonArray(), String.class);
			List<String> TAs = Util.toList(json.get("TAs").getAsJsonArray(), String.class);
			List<String> students = Util.toList(json.get("students").getAsJsonArray(), String.class);
			CourseStructure structure = Util.fromJson(json.get("structure").getAsString(), CourseStructure.class);
			String error = structure.isValid();
			if(error != null) {
				response = error;
				return Util.objectToJson(response);
				
			}
			// Create the course
			db.getCourseDB().addCourse(new Course(courseName, courseID, year, period, courseConvenor, lecturers, TAs, students, structure));       
			// Add course to each user
			db.getUserDB().getUser(courseConvenor).addCourse(courseID, structure);
			for(String id : lecturers) db.getUserDB().getUser(id).addCourse(courseID, structure);
			for(String id : TAs) db.getUserDB().getUser(id).addCourse(courseID, structure);
			for(String id : students) db.getUserDB().getUser(id).addCourse(courseID, structure);
			
		}
		catch(Exception e) {
			response = "Invalid parameters passed. Check formatting.";
		}
		if(response == null) response = "Successfully created the course";
		
		return Util.objectToJson(response);
		
	}
	
	public Object getCourse(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String courseID = json.get("courseID").getAsString();
		Course course = db.getCourseDB().getCourse(courseID);
		if(course == null) {
			return Util.objectToJson("courseDoesNotExist");
			
		}
		else{ 
			System.out.println(course.getCourseName());
			return Util.objectToJson(course);
			
		}
		
	}
	
	public Object addStudentToCourse(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		UserType role =  UserType.valueOf(json.get("role").getAsString());
		String courseID = json.get("courseID").getAsString();
		Course course = db.getCourseDB().getCourse(courseID);
		
		if(role == UserType.STUDENT && !course.getStudents().contains(userID)) course.getStudents().add(userID);
		else if(role == UserType.TA && !course.getTAs().contains(userID)) course.getTAs().add(userID);
		else if(role == UserType.LECTURER && !course.getLecturers().contains(userID)) course.getLecturers().add(userID);
		else if(role == UserType.CONVENOR) course.setCourseConvenor(userID);
		
		db.getUserDB().addCourse(userID, courseID);
		db.getCourseDB().addCourse(course);
		
		return Util.objectToJson("success");
		
	}
	
	public Object addCourseMarks(Request req, Response res) {
		return null;

	}
	
	public Object getCourseMarks(Request req, Response res) {
		return null;

	}


}