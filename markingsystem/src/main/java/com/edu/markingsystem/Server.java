package com.edu.markingsystem;

import java.util.HashMap;
import java.util.Map;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.db.Type;
import com.edu.markingsystem.db.User;
import com.esotericsoftware.minlog.Log;
import com.google.gson.JsonObject;

import spark.ModelAndView;
import spark.Request;
import spark.Response;
import spark.Spark;
import spark.template.freemarker.FreeMarkerEngine;

public class Server {

	private static final String USER_SESSION_ID = "session_id";
	
	private Database db;
	
	public Server(Database db) {
		Spark.port(8000);
		Spark.staticFileLocation("/public");
		initializeREST();
		this.db = db;
		

	}

	public void initializeREST() {

		Spark.get("/", (req, res) -> {
			Log.info(this.getClass().getName(), "GET / " + req.ip());
			return getHome(req, res); 
		}, new FreeMarkerEngine());

		Spark.post("/login", (req, res) -> { 
			Log.info(this.getClass().getName(), "POST /login " + req.ip());
			return login(req, res);
		});

		Spark.post("/logout", (req, res) -> {
			Log.info(this.getClass().getName(), "POST /login " + req.ip());
			return logout(req, res);
		});
		
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

	/**
	 * Called in attempt to login the user. If the details match a record in the db then the user id is attached to the session.
	 * Else an error message is returned:
	 * 1) No details found
	 * 2) Username found but password inccorect
	 * @param req
	 * @param res
	 * @return
	 */
	public Object login(Request req, Response res) {
		String response = "success";
		
		JsonObject json = Util.stringToJson(req.body());
		String username = json.get("username").getAsString();
		String password = json.get("password").getAsString();
		
		User user = db.getUserDB().getUser(username);
		if(user == null) response = "User ID not found";
		else if(!PasswordUtil.verifyPassword(password, user.getPassword())) response = "Incorrect password";
		else attachIDToSession(username, req); // Attach the user id the the session
		return Util.objectToJson(response);

	}
	
	public Object logout(Request req, Response res) {
		String response = "success";
		dettachIDToSession(req);
		return Util.objectToJson(response);

	}
	
	public Object admin_createUser(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String password = json.get("password").getAsString();
		String userType = json.get("userType").getAsString().toUpperCase();
		
		String response = "";
		//check if user exists:
		if(userExists(userID)){ 
			response = "userExists";
		}
		//success:
		else{
			db.getUserDB().insertUser(userID, new User(password,Type.userType.valueOf(userType)));
			response = "success";
		}
		return Util.objectToJson(response);
	}
	
	public Object admin_removeUser(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String response = "";
		//check for errors:
		if(!userExists(userID)){
			response = "userDoesNotExist";
		}
		else{ 
			//success:
			db.getUserDB().removeUser(userID);
			response = "success";
		}
		return Util.objectToJson(response);
	}
	
	public Object admin_changePass(Request req, Response res) {
		JsonObject json = Util.stringToJson(req.body());
		String userID = json.get("userID").getAsString();
		String password = json.get("password").getAsString();
		
		String response = "";
		//check for errors:
		if(!userExists(userID)){
			response = "userDoesNotExist";
		}
		else{ 
			//success:
			db.getUserDB().changePassword(userID,password);
			response = "success";
		}
		System.out.println(userID+" "+response);
		return Util.objectToJson(response);
	}
	
	
	
	public ModelAndView getHome(Request req, Response res) {
		Map<String, Object> map = new HashMap<String, Object>();
		String ID = getIDFromSession(req);
		if(ID != null) {
			// If user is signed in then retrieve the particular page
			// suitable for the user type
			// NOTE: If the user decides to refresh the page and is logged in
			// Then instead of being redirected to the login page the user is
			// taken to the suitable "main" viewing page
			String userType = db.getUserDB().getUser(ID).getUserType().toString();
			
			if(userType.equalsIgnoreCase("admin")){
				return new ModelAndView(map, "admin.html");
			}
			else if(userType.equalsIgnoreCase("student")){
				return new ModelAndView(map, "x"); // <- Jarad replace the x with the name of the student html page
			}
			else{
				return new ModelAndView(map, "main.ftl");
			}
			
		}
		else {
			// Retrieve login page as user is not signed in
			return new ModelAndView(map, "login.ftl");
			
		}
		

	}
	
	// These methods register, get and remove session IDs
	
	private String getIDFromSession(Request request) {
		return request.session().attribute(USER_SESSION_ID);
		
	}

	private void attachIDToSession(String id, Request request) {
		request.session().attribute(USER_SESSION_ID, id);

	}

	private void dettachIDToSession(Request request) {
		request.session().removeAttribute(USER_SESSION_ID);

	}
	
	//other:
	boolean userExists(String username){
		User user = db.getUserDB().getUser(username);
		return !(user == null);
	}
	
}