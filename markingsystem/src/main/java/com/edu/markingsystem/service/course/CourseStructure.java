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
	private List<TopLevel> topLevels; // Exams, CourseWork, Tests
	
	public CourseStructure() {
		this.topLevels = new ArrayList<TopLevel>();
		
	}
	
	public void addTopLevel(TopLevel topLevel) {
		this.topLevels.add(topLevel);
		
	}
	
	public TopLevel getTop(int index) {
		return this.topLevels.get(index);
		
	}
	
	
}