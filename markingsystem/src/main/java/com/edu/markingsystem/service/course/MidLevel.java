package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

public class MidLevel extends Level implements java.io.Serializable {
	
	private int weight; // out of 100
	private Integer mark;
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
		boolean complete = true;
		this.mark = 0;
		this.maxMark = 0;
		
		for(BottomLevel level : this.bottomLevels) {
			level.calculatePercentages();
			if(level.getPercentage() == null) complete = false;
			else {
				this.mark += level.getMark();
				this.maxMark += level.getMaxMark();
			}
			
		}
		if(complete == false) {
			this.mark = null;
			this.percentage = null;
		}
		else this.percentage = Math.round(100f * ((float) this.mark / (float) this.maxMark));
		
	}

	public int getWeight() {
		return this.weight;
		
	}
	
	
}