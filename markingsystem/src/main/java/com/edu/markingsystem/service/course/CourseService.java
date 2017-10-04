package com.edu.markingsystem.service.course;

import java.util.List;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
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
		
		Spark.post("/getAllCourses", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /getAllCourses " + req.ip());
			return getAllCourses(req, res);
		});
		
		Spark.post("/addUser", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /addUser " + req.ip());
			return addUser(req, res);
		});
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
			return Util.objectToJson(course);
			
		}
		
	}
	
	//TODO: Luke fix plis
	public Object addUser(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String role = json.get("role").getAsString();
		String userID = json.get("userID").getAsString();
		String courseID = json.get("courseID").getAsString();
	
		if(db.getUserDB().getUser(userID)==null){
			return Util.objectToJson("User does not exist");
		}
		else{
			Course course = db.getCourseDB().getCourse(courseID);
			if(course == null) {
				return Util.objectToJson("Course does not exist");		
			}
			else{ 
				
				//							not working
				/*
				 *
				db.getUserDB().getUser(userID).addCourse(course.getCourseID(), course.getStructure());
				switch(role){
				case "student":
					course.addStudent(userID);
					System.out.println("added student: "+userID);
					break;
				case "Lecturer":
					course.addLecturers(userID);
					break;
				case "TA":
					course.addTA(userID);
					break;
				case "Course Convener":
					if(course.getCourseConvenor()!=null){
						return Util.objectToJson("A course convener already exists");
					}
					else{
						course.setCourseConvenor(userID);
					}
					break;
				}
				
				db.getCourseDB().updateCourse(courseID);
				
				for ( String student : db.getCourseDB().getCourse(courseID).getStudents()) {
					System.out.println(student);
				}
				*
				*/
				
								
				return Util.objectToJson("success");
			}
		}
		
	}
	
	public Object getAllCourses(Request req, Response res) {		
		return Util.objectToJson(db.getCourseDB().getAllCourseIDs());
	}
	
	public Object addCourseMarks(Request req, Response res) {
		return null;

	}
	
	public Object getCourseMarks(Request req, Response res) {
		return null;

	}


}