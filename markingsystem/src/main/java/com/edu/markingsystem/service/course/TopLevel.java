package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

public class TopLevel extends Level implements java.io.Serializable {

	private int weight; // out of 100
	private int dp; // need atleast dp amount of pass
	private List<MidLevel> midLevels;
	
	public TopLevel(String name, int weight, int dp) {
		super(name);
		this.midLevels = new ArrayList<MidLevel>();
		this.weight = weight;
		this.dp = dp;
		
	}
	
	public void update(String name, int weight, int dp) {
		this.name = name;
		this.weight = weight;
		this.dp = dp;
		
	}
	
	public void addMidLevel(MidLevel midLevel) {
		this.midLevels.add(midLevel);
		
	}

	public int getPercentage() {
		return this.percentage;
		
	}

	public int getWeight() {
		return this.weight;
		
	}
	
	public List<MidLevel> getMidLevels() {
		return this.midLevels;
		
	}

	public void calculatePercentages() {
		for(MidLevel level : this.midLevels) {
			level.calculatePercentages();
			this.percentage += level.getPercentage() * level.getWeight();
		}
		
	}

	public boolean checkWeight() {
		int weight = 0;
		for(MidLevel level : this.midLevels) weight += level.getWeight();
		
		return weight == 100;
		
	}

	public String getName() {
		return this.name;
		
	}
	
	
}