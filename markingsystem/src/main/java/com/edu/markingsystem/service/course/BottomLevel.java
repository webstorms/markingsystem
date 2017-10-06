package com.edu.markingsystem.service.course;

public class BottomLevel extends Level implements java.io.Serializable {
	
	private int mark;
	private int maxMark;

	public BottomLevel(String name, int maxMark) {
		super(name);
		this.maxMark = maxMark;
		
	}
	
	public void setMark(int mark) {
		this.mark = mark;
		
	}

	public void setMaxMark(int maxMark) {
		this.maxMark = maxMark;
		
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