package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

public class MidLevel implements java.io.Serializable {

	private String name;
	private int weight; // out of 100
	private int percentage;
	private int mark;
	private int maxMark;
	private List<BottomLevel> bottomLevels;
	
	public MidLevel(String name, int weight) {
		this.bottomLevels = new ArrayList<BottomLevel>();
		this.name = name;
		this.weight = weight;
		
	}
	
	public void addBottomLevel(BottomLevel bottomLevel) {
		this.bottomLevels.add(bottomLevel);
		
	}
	
	public BottomLevel getBottom(int index) {
		return this.bottomLevels.get(index);
		
	}
	
	
}