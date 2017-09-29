package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

public class CourseStructure implements java.io.Serializable {
	
	private String name;
	private String id;
	private int finalMark; // out of 100
	private List<TopLevel> topLevels;
	
	public CourseStructure(String name, String id) {
		this.name = name;
		this.topLevels = new ArrayList<TopLevel>();
		
	}
	
	public void addTopLevel(TopLevel topLevel) {
		this.topLevels.add(topLevel);
		
	}
	
	public TopLevel getTop(int index) {
		return this.topLevels.get(index);
		
	}
	
	
}