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
		
		Spark.post("/importMarks", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /updateMarks " + req.ip());
			return importMarks(req, res);
		});

	}
	
	public Object importMarks(Request req, Response res) {
		String response = "success";
		try {
//			JsonObject json = Util.stringToJson(req.body());
//			
//			System.out.println(json.toString());
//			System.out.println(json.get("file").getAsString());
//			
//			JsonArray array = json.get("file").getAsJsonArray();
//			String courseID = json.get("courseID").getAsString();
//			
//			for(int i = 0 ; i < array.size(); i++) {
//				System.out.println(array.get(i).toString());
//			}
//			
//			for(int i = 0 ; i < file.size(); i++) {
//				JsonObject record = file.get(i).getAsJsonObject();
//				String ID = record.get("ID").getAsString();
//				String Top = record.get("Top").getAsString();
//				String Mid = record.get("Mid").getAsString();
//				String Bot = record.get("Bot").getAsString();
//				String Mark = record.get("Mark").getAsString();
//				
//				System.out.println(ID + " " + Top + " " + Mid + " " + Bot + " " + Mark); 
//				
//			}
			
			JsonObject json = Util.stringToJson(req.body());
			String file = json.get("file").getAsString();
			String courseID = json.get("courseID").getAsString();
			
			file = file.substring(1, file.length() - 1);
			String[] obj = file.split(",");
			obj = new HashSet<String>(Arrays.asList(obj)).toArray(new String[0]); // remove duplicates

			for(String id : obj) {
				JsonObject j = Util.stringToJson(id);
				

			}

			
		}
		catch(Exception e) {
			e.printStackTrace();
			response = e.getMessage();

		}

		return Util.objectToJson(response);
		
	}
	
	/**
	 * Update the marks of all students from a given course. Supply courseID and data.
	 * data contains a student attribute which contains a list of CourseStructure objects all in JSON format.
	 * @param req
	 * @param res
	 * @return
	 */

	public Object updateMarks(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());	
			String courseID = json.get("courseID").getAsString();
			JsonArray array = json.get("data").getAsJsonObject().get("Students").getAsJsonArray();
			List<String> students = this.db.getCourseDB().getCourse(courseID).getStudents();

			for(int i = 0 ; i < array.size(); i++) {
				// TODO: Although this works at the moment as data order is preserved, ideally should
				// also pass in student IDs within the data object.
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

	/**
	 * Add a list of students to a course. Supply file and courseID.
	 * File is in csv format with the column titled "ID".
	 * @param req
	 * @param res
	 * @return
	 */
	
	public Object importUsers(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());
			String file = json.get("file").getAsString();
			String courseID = json.get("courseID").getAsString();
			
			file = file.substring(1, file.length() - 1);
			String[] obj = file.split(",");
			obj = new HashSet<String>(Arrays.asList(obj)).toArray(new String[0]); // remove duplicates

			Course course = this.db.getCourseDB().getCourse(courseID);

			for(String id : obj) {
				JsonObject j = Util.stringToJson(id);
				course.addStudent(j.get("ID").getAsString());
				db.getUserDB().addCourse(j.get("ID").getAsString(), courseID);

			}

			this.db.getCourseDB().addCourse(course);

		}
		catch(Exception e) {
			e.printStackTrace();
			response = e.getMessage();

		}

		return Util.objectToJson(response);

	}

	/**
	 * Update the course structure. Suply courseID and structure.
	 * structure is a CourseStructure in JSON format.
	 * @param req
	 * @param res
	 * @return
	 */
	
	public Object updateCourse(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());
			String courseID = json.get("courseID").getAsString();
			CourseStructure newStructure = Util.fromJson(json.get("structure").getAsString(), CourseStructure.class);
			newStructure.init();

			// Update the courses structure
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

	/**
	 * Check if a user is a course convenor. Supply courseID.
	 * UserID is retrieved from the session.
	 * @param req
	 * @param res
	 * @return
	 */
	
	public Object isCourseConv(Request req, Response res) {
		try {
			JsonObject json = Util.stringToJson(req.body());
			String courseID = json.get("courseID").getAsString();
			String convID = db.getCourseDB().getCourse(courseID).getCourseConvenor();
			String userID = UserService.getIDFromSession(req);
			return Util.objectToJson((new Boolean(userID.equals(convID))).toString());
		}
		catch(Exception e) {
			return Util.objectToJson(e.getMessage());
			
		}

	}

	/**
	 * Create a course object. Supply courseName, courseCode, courseYear, coursePeriod and courseStructure. 
	 * courseStructure is a CourseStructure in JSON format.
	 * @param req
	 * @param res
	 * @return
	 */
	
	public Object createCourse(Request req, Response res) {
		try {
			String response = null;
			
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

			System.out.println("Successfully created the course");
			
			if(response == null) response = "Successfully created the course";

			return Util.objectToJson(response);
		}
		catch(Exception e) {
			e.printStackTrace();
			return Util.objectToJson(e.getMessage());
			
		}

	}

	/**
	 * Get a course object. Supply courseID.
	 * @param req
	 * @param res
	 * @return
	 */
	
	public Object getCourse(Request req, Response res) {
		String response = "success";
		try {
			JsonObject json = Util.stringToJson(req.body());
			String courseID = json.get("courseID").getAsString();
			Course course = db.getCourseDB().getCourse(courseID);
			if(course == null) response = "courseDoesNotExist";
			else {
				return Util.objectToJson(course);
				
			}
			
		}
		catch(Exception e) {
			response = e.getMessage();
		}

		return Util.objectToJson(response);

	}

	/**
	 * Add any user to a course. Supply userID, role and courseID. Different roles
	 * can be found in the UserType class.
	 * @param req
	 * @param res
	 * @return
	 */
	
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

	/**
	 * Remove any user from a course. Supply: userID and courseID
	 * @param req
	 * @param res
	 * @return
	 */
	
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
			db.getCourseDB().addCourse(course); // Overwrite the existing course with the updated one

		}
		catch(Exception e) {
			response = e.getMessage();
		}

		return Util.objectToJson(response);

	}

	/**
	 * Get all courseIDs in the database.
	 * @param req
	 * @param res
	 * @return
	 */
	
	public Object getAllCourses(Request req, Response res) {		
		return Util.objectToJson(db.getCourseDB().getAllCourseIDs());

	}


}