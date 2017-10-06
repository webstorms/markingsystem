package com.edu.markingsystem.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

	}
	
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