package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

/**
 * This claass contains the structure of a course.
 * @author admin
 *
 */

public class CourseStructure implements java.io.Serializable {
	
	private int percentage; // out of 100
	private boolean complete;
	private List<TopLevel> topLevels; // Exams, CourseWork, Tests
	
	public CourseStructure() {
		this.topLevels = new ArrayList<TopLevel>();
		
	}
	
	public String isValid() {
		String response = null;
		int weight = 0;
		for(TopLevel level : this.topLevels) weight += level.getWeight();
		
		if(weight != 100) {
			response = "topLevelWeightNot100";
		}
		
		for(TopLevel level : this.topLevels) {
			if(level.checkWeight()) {
				response =  level.getName() + "WeightNot100";
			}
		}
		
		return response;
		
	}
	
	public void calculatePercentages() {
		for(TopLevel level : this.topLevels) {
			level.calculatePercentages();
			this.percentage += level.getPercentage() * level.getWeight();
		}
		
	}
	
	public void addTopLevel(TopLevel topLevel) {
		this.topLevels.add(topLevel);
		
	}
	
	public TopLevel getTop(int index) {
		return this.topLevels.get(index);
		
	}
	
	
}