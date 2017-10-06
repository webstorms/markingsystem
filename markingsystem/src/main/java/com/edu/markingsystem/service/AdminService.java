package com.edu.markingsystem.service;

import java.util.HashSet;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.course.Course;
import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.user.User;
import com.edu.markingsystem.service.user.UserService;
import com.edu.markingsystem.service.user.UserType;
import com.esotericsoftware.minlog.Log;
import com.google.gson.JsonObject;

import spark.Request;
import spark.Response;
import spark.Spark;

public class AdminService extends Service {
	
	public AdminService(Database db) {
		super(db);

	}

	@Override
	public void initializeREST() {
		Spark.post("/admin_createUser", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /admin_createUser " + req.ip());
			return admin_createUser(req, res);
		});
		
		Spark.post("/admin_removeUser", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /admin_removeUser " + req.ip());
			return admin_removeUser(req, res);
		});

		Spark.post("/admin_changePass", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /admin_changePass " + req.ip());
			return admin_changePass(req, res);
		});
		
		//=======	ADMINSTAFF ========
		// move to new adminstaff service class?
		Spark.post("/adminstaff_createCourseAddUser", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /adminstaff_createCourseAddUser " + req.ip());
			return createCourse_AddUserToCourse(req, res);
		});
		
		Spark.post("/createCourse_removeUserFromCourse", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /createCourse_removeUserFromCourse " + req.ip());
			return createCourse_removeUserFromCourse(req, res);
		});
		Spark.post("/manUsers_importUsers", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /manUsers_importUsers " + req.ip());
			return manUsers_importUsers(req, res);
		});
		//===============================

	}

	//	move to new adminstaff service class?
	//	checks if a user can be added to the course members
	 
	public Object createCourse_AddUserToCourse(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String add_userID = json.get("userID").getAsString();
		String add_role = json.get("role").getAsString();
		String table = json.get("table").getAsString();		
		
		
		boolean courseConvExists = false;
		
		if(!userExists(add_userID)){
			return Util.objectToJson("user does not exist");
		}
		
		String data[] = table.substring(1,table.length()-1).split("#");
		for(int i=1; i<data.length; i++){
			String row = data[i].substring(1,data[i].length()-1);
			String[] cells = row.split(",");
			String userID = cells[0];
			String role = cells[1];
			
			if(userID.equals(add_userID)) {
				return Util.objectToJson("you cannot add duplicate users");
			}
			
			if(role.equalsIgnoreCase("convener")) {
				if(courseConvExists){
					return Util.objectToJson("you cannot add more than one course convener");
				}
				else{
					courseConvExists = true;
				}
			}
			
		}
		
		return Util.objectToJson("success");
	}
	
	public Object manUsers_importUsers(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String file = json.get("file").getAsString();

		System.out.println(file);
		
		//TODO: import users 
		
		return Util.objectToJson("User not in table");
	
	}
	
	public Object createCourse_removeUserFromCourse(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String remove_userID = json.get("userID").getAsString();
		String table = json.get("table").getAsString();		
		
		
		String data[] = table.substring(1,table.length()-1).split("#");
		for(int i=1; i<data.length; i++){
			String row = data[i].substring(1,data[i].length()-1);
			String[] cells = row.split(",");
			String userID = cells[0];
			
			if(userID.equalsIgnoreCase(remove_userID)){
				return Util.objectToJson(i);
			}
		}
		
			return Util.objectToJson("User not in table");
	
	}
	//===============================
	
	
	public Object admin_createUser(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String password = json.get("password").getAsString();
		String userType = json.get("userType").getAsString().toUpperCase(); 
		String response = "";
		if(userExists(userID)){ 
			response = "userExists";
		}
		else{
			db.getUserDB().addUser(userID, new User(password, UserType.valueOf(userType)));
			response = Service.SUCCESS;
		}
		return Util.objectToJson(response);
		
	}

	public Object admin_removeUser(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String response = "";
		if(!userExists(userID)){
			response = "userDoesNotExist";
		}
		else {
			User user = this.db.getUserDB().getUser(userID);
			for(String courseID : user.getCourses()) {
				Course course = db.getCourseDB().getCourse(courseID);
				if(course.getStudents().contains(userID)) course.getStudents().remove(userID);
				else if(course.getTAs().contains(userID)) course.getTAs().remove(userID);
				else if(course.getLecturers().contains(userID)) course.getLecturers().remove(userID);
				if(course.getCourseConvenor().equals(userID)) course.setCourseConvenor("");
				db.getCourseDB().addCourse(course);
				
			}
			
			db.getUserDB().deleteUser(userID);			
			
			response = Service.SUCCESS;
			
		}
		return Util.objectToJson(response);
		
	}

	public Object admin_changePass(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = !json.has("userID") ? UserService.getIDFromSession(req) : json.get("userID").getAsString();
		String password = json.get("password").getAsString();
		String response = "";
		if(!userExists(userID)){
			response = "userDoesNotExist";
		}
		else{ 
			db.getUserDB().changePassword(userID,password);
			response = Service.SUCCESS;
		}
		return Util.objectToJson(response);
		
	}

	
	
}