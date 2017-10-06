package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

public class MidLevel extends Level implements java.io.Serializable {
	
	private int weight; // out of 100
	private int mark;
	private int maxMark;
	private List<BottomLevel> bottomLevels;
	
	public MidLevel(String name, int weight) {
		super(name);
		this.bottomLevels = new ArrayList<BottomLevel>();
		this.weight = weight;
		
	}
	
	public void addBottomLevel(BottomLevel bottomLevel) {
		this.bottomLevels.add(bottomLevel);
		
	}

	public List<BottomLevel> getBottomLevel() {
		return this.bottomLevels;
		
	}
	
	public void calculatePercentages() {
		for(BottomLevel level : this.bottomLevels) {
			level.calculatePercentages();
			this.mark += level.getMark();
			this.maxMark += level.getMaxMark();
			
		}
		this.percentage = Math.round((float) this.mark / (float) this.maxMark);
		
	}
	
	public int getPercentage() {
		return this.percentage;
		
	}

	public int getWeight() {
		return this.weight;
		
	}
	
	
}