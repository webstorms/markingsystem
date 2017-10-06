package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.Service;
import com.edu.markingsystem.service.user.User;
import com.edu.markingsystem.service.user.UserService;
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