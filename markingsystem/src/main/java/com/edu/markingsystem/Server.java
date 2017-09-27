package com.edu.markingsystem;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.AdminService;
import com.edu.markingsystem.service.UserService;
import spark.Spark;

public class Server {
	
	private UserService userService;
	private AdminService adminService;
	
	public Server(Database db) {
		Spark.port(8000);
		Spark.staticFileLocation("/public");
		userService = new UserService(db);
		adminService = new AdminService(db);

	}
	
	
}