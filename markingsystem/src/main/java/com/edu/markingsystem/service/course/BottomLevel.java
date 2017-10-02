package com.edu.markingsystem.service.course;

public class BottomLevel implements java.io.Serializable {

	private String name;
	private int percentage;
	private int mark;
	private int maxMark;

	public BottomLevel(String name, int maxMark) {
		this.name = name;
		this.maxMark = maxMark;
		
	}
	
	public void setMark(int mark) {
		this.mark = mark;
		
	}

	public void calculatePercentages() {
		this.percentage = Math.round((float) this.mark / (float) this.maxMark);
	}

	public int getPercentage() {
		return this.percentage;
		
	}

	public int getMark() {
		return this.mark;
	}

	public int getMaxMark() {
		return this.maxMark;
	}
	
	
}