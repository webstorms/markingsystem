package com.edu.markingsystem.service;

import com.edu.markingsystem.Util;
import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.db.UserType;
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
			db.getUserDB().insertUser(userID, new User(password, UserType.valueOf(userType)));
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
			db.getCourseDB().deleteCourses(userID);
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