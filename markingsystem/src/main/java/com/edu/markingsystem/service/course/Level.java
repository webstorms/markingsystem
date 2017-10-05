package com.edu.markingsystem.service.course;

import java.util.UUID;

public class Level {

	protected String name;
	protected String ID;
	protected int percentage;
	
	public Level(String name) {
		this.name = name;
		this.ID = UUID.randomUUID().toString();
		
	}
	
	
}