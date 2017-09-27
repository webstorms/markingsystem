package com.edu.markingsystem.service;

import com.edu.markingsystem.db.Database;

public abstract class Service {

	protected Database db;
	
	public Service(Database db) {
		this.db = db;
		this.initializeREST();
		
	}
	
	public abstract void initializeREST();
	
	
}