package com.edu.markingsystem.service.course;

import java.util.ArrayList;
import java.util.List;

public class TopLevel implements java.io.Serializable {

	private String name;
	private int weight; // out of 100
	private int percentage;
	private int dp; // need atleast dp amount of pass
	private List<MidLevel> midLevels;
	
	public TopLevel(String name, int weight, int dp) {
		this.midLevels = new ArrayList<MidLevel>();
		this.name = name;
		this.weight = weight;
		this.dp = dp;
		
	}
	
	public void addMidLevel(MidLevel midLevel) {
		this.midLevels.add(midLevel);
		
	}
	
	public MidLevel getMid(int index) {
		return this.midLevels.get(index);
		
	}
	
	
}