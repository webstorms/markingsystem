package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
import com.edu.markingsystem.service.user.User;
import com.edu.markingsystem.service.user.UserService;
import com.edu.markingsystem.service.user.UserType;
import com.esotericsoftware.minlog.Log;
import com.google.gson.JsonArray;
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

		Spark.post("/manUsers_importUsers", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /manUsers_importUsers " + req.ip());
			return importUsers(req, res);
		});
		
		Spark.post("/updateMarks", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /updateMarks " + req.ip());
			return updateMarks(req, res);
		});
		
	}

	public Object updateMarks(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());	
			String courseID = json.get("courseID").getAsString();
			JsonArray array = json.get("data").getAsJsonObject().get("Students").getAsJsonArray();
			
			System.out.println("courseID: " + courseID);
			List<String> students = this.db.getCourseDB().getCourse(courseID).getStudents();
			
		    for (int i = 0 ; i < array.size(); i++) {
		    	CourseStructure d = Util.fromJson(array.get(i).toString(), CourseStructure.class);
		    	User user = this.db.getUserDB().getUser(students.get(i));
		    	user.updateMarks(courseID, d);
		    	this.db.getUserDB().addUser(students.get(i), user);
		    	
		    }
			
		}
		catch(Exception e) {
			e.printStackTrace();
			response = e.getMessage();
		}

		return Util.objectToJson(response);
	}
	
	public Object importUsers(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());
			String file = json.get("file").getAsString();
			String courseID = json.get("courseID").getAsString();
			
			System.out.println(file);
			file = file.substring(1, file.length() - 1);
			String[] obj = file.split(",");
			obj = new HashSet<String>(Arrays.asList(obj)).toArray(new String[0]); // remove duplicates
			
			Course course = this.db.getCourseDB().getCourse(courseID);
			
			for(String id : obj) {
				System.out.println(id);
				JsonObject j = Util.stringToJson(id);
				System.out.println(j.get("ID").getAsString());
				course.addStudent(j.get("ID").getAsString());
				
			}
			
			this.db.getCourseDB().addCourse(course);
			
		}
		catch(Exception e) {
			e.printStackTrace();
			response = e.getMessage();
			
		}
		
		return Util.objectToJson(response);
	
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

	public Object isCourseConv(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String courseID = json.get("courseID").getAsString();
		String convID = db.getCourseDB().getCourse(courseID).getCourseConvenor();
		String userID = UserService.getIDFromSession(req);
		System.out.println((new Boolean(userID.equals(convID))).toString());
		return Util.objectToJson((new Boolean(userID.equals(convID))).toString());
		
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
		
		if(response == null) response = "Successfully created the course";

		return Util.objectToJson(response);

	}

	public Object getCourse(Request req, Response res) {
		String response = "success";
		try {

			JsonObject json = Util.stringToJson(req.body());
			String courseID = json.get("courseID").getAsString();
			Course course = db.getCourseDB().getCourse(courseID);
			if(course == null) response = "courseDoesNotExist";
			else {
				System.out.println(course.getCourseName());
				return Util.objectToJson(course);

			}
		}
		catch(Exception e) {
			response = e.getMessage();
		}
		
		return Util.objectToJson(response);
		
	}

	public Object addUser(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());
			String userID = json.get("userID").getAsString();
			UserType role =  UserType.valueOf(json.get("role").getAsString().toUpperCase());
			String courseID = json.get("courseID").getAsString();
			
			System.out.println(userID);
			System.out.println(courseID);
			Course course = db.getCourseDB().getCourse(courseID);
			
			if(role == UserType.STUDENT && !course.getStudents().contains(userID)) course.getStudents().add(userID);
			else if(role == UserType.TA && !course.getTAs().contains(userID)) course.getTAs().add(userID);
			else if(role == UserType.LECTURER && !course.getLecturers().contains(userID)) course.getLecturers().add(userID);
			else if(role == UserType.CONVENER) course.setCourseConvenor(userID);

			db.getUserDB().addCourse(userID, courseID);
			db.getCourseDB().addCourse(course);
			
		}
		catch(Exception e) {
			e.printStackTrace();
			response = e.getMessage();
		}

		return Util.objectToJson(response);

	}

	public Object removeUser(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());
			String userID = json.get("userID").getAsString();
			String courseID = json.get("courseID").getAsString();
			
			Course course = db.getCourseDB().getCourse(courseID);
			if(course.getStudents().contains(userID)) course.getStudents().remove(userID);
			else if(course.getTAs().contains(userID)) course.getTAs().remove(userID);
			else if(course.getLecturers().contains(userID)) course.getLecturers().remove(userID);
			if(course.getCourseConvenor().equals(userID)) course.setCourseConvenor("");
			
			db.getUserDB().removeCourse(userID, courseID);
			db.getCourseDB().addCourse(course);
			
		}
		catch(Exception e) {
			response = e.getMessage();
		}

		return Util.objectToJson(response);

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