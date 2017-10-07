package com.edu.markingsystem.service.course;

import java.util.UUID;

public class Level implements java.io.Serializable {

	protected String name;
	protected String ID;
	protected Integer percentage;
	
	public Level(String name) {
		this.name = name;
		this.ID = UUID.randomUUID().toString();
		
	}
	
	protected Integer getPercentage() {
		return this.percentage;
		
	}
	
	public String getName() {
		return this.name;
		
	}
	
	
}