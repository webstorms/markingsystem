package com.edu.markingsystem.service.course;

public class BottomLevel extends Level implements java.io.Serializable {
	
	private Integer mark;
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
		// If mark is set we can compute the percentage
		if(this.mark != null) this.percentage = Math.round(100f * ((float) this.mark / (float) this.maxMark));
		
	}

	public Integer getMark() {
		return this.mark;
	}

	public int getMaxMark() {
		return this.maxMark;
	}
	
	
}