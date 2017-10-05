package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.sound.midi.Synthesizer;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
import com.edu.markingsystem.service.user.UserService;
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
		
		Spark.post("/removeUser", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /removeUser " + req.ip());
			return removeUser(req, res);
		});
		
		Spark.post("/isCourseConv", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /isCourseConv " + req.ip());
			return isCourseConv(req, res);
		});
	}

	public Object isCourseConv(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String courseID = json.get("courseID").getAsString();
		String courseConv = db.getCourseDB().getCourse(courseID).getCourseConvenor();
		
		//==========
		//	TODO: get ID from session
		//		String sessionID;
		//		if(sessionID.equalsIgnoreCase(courseConv)){
		//			return Util.objectToJson("true");
		//		}
		//		else{
		//			return Util.objectToJson("false");
		//		}
		//==========
		
		return Util.objectToJson("true");
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
		
		//try {
			JsonObject json = Util.stringToJson(req.body());
			String courseName = json.get("courseName").getAsString();
			String courseID = json.get("courseCode").getAsString();
			String year = json.get("courseYear").getAsString();
			String period = json.get("coursePeriod").getAsString();
			
			String courseConvenor = "";
			List<String> lecturers = new ArrayList<>();
			List<String> TAs = new ArrayList<>();
			List<String> students = new ArrayList<>();
			
			
			//	 String processing to get all users and build lists. membersTable is represented as:
			// 		{{<heading1>,<headin2>}#{<userID>,<role>}#{<userID>,<role>}#	...	#{<userID>,<role>}}
			 
			String membersTable = json.get("membersTable").getAsString();
			
			String data[] = membersTable.substring(1,membersTable.length()-1).split("#");
			for(int i=1; i<data.length; i++){
				String row = data[i].substring(1,data[i].length()-1);
				String[] cells = row.split(",");
				String userID = cells[0];
				String role = cells[1];
				
				if(role.equalsIgnoreCase("student")){
					students.add(userID);
				}
				else if(role.equalsIgnoreCase("lecturer")){
					lecturers.add(userID);
				}
				else if(role.equalsIgnoreCase("ta")){
					TAs.add(userID);
				}
				else if(role.equalsIgnoreCase("course convener")){
					courseConvenor = userID;
				}
			}
			
			//System.out.println(json.getAsJsonObject("courseStructure"));
			
			
			CourseStructure structure = Util.fromJson(json.getAsJsonObject("courseStructure").toString(), CourseStructure.class);
		
			
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
			
			
		//}
		//catch(Exception e) {
		//	System.out.println(e);
		//		response = "Invalid parameters passed. Check formatting.";
		//}
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
	
		//=======================
		//TODO: add user
		//=======================
		
		return Util.objectToJson("success");
	}
	
	public Object removeUser(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String courseID = json.get("courseID").getAsString();
	
		Course course = db.getCourseDB().getCourse(courseID);
		HashSet<String> users = new HashSet<>();
		users.add(course.getCourseConvenor());
		users.addAll(course.getLecturers());
		users.addAll(course.getStudents());
		users.addAll(course.getTAs());

		if(!users.contains(userID)){
			return Util.objectToJson("User is not in this course.");
		}
		else{

			//=======================
			//TODO: remove user
			//=======================
			
			return Util.objectToJson("success");
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