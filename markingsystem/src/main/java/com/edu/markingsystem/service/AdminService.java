package com.edu.markingsystem.service;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.course.CourseStructure;
import com.edu.markingsystem.service.user.User;
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
		
		//=======	TODO ========
		// move to new adminstaff service class?
		Spark.post("/adminstaff_createCourseAddUser", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /adminstaff_createCourseAddUser " + req.ip());
			return createCourse_AddUserToCourse(req, res);
		});
		//===============================


	}
	
	
	//=======	TODO  ========
	// move to new adminstaff service class?
	/*	checks if a user can be added to the course members
	 * 	checks:
	 * 		- does the user exist?
	 * 		- trying to add duplicates?
	 * 		- trying to add multiple course conveners?
	 * */	
	public Object createCourse_AddUserToCourse(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String role = json.get("role").getAsString();
		String table = json.get("table").getAsString();		

		System.out.println(userID);
		System.out.println(role);
		System.out.println(table);
		
		return Util.objectToJson("success");
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
		else{ 
			db.getUserDB().deleteUser(userID);
			// TODO: Delete user from all courses
			response = Service.SUCCESS;
		}
		return Util.objectToJson(response);
		
	}

	public Object admin_changePass(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
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