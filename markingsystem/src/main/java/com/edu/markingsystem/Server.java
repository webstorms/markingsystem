package com.edu.markingsystem;

import com.edu.markingsystem.db.Database;
import com.edu.markingsystem.service.AdminService;
import com.edu.markingsystem.service.UserService;
import com.edu.markingsystem.service.course.CourseService;
import com.edu.markingsystem.service.student.StudentService;

import spark.Spark;

public class Server {
	
	private UserService userService;
	private AdminService adminService;
	private StudentService studentService;
	private CourseService courseService;
	
	public Server(Database db) {
		Spark.port(8000);
		Spark.staticFileLocation("/public");
		userService = new UserService(db);
		adminService = new AdminService(db);
		studentService = new StudentService(db);
		courseService = new CourseService(db);
		
	}
	
	
}