package com.ixigo;

import java.sql.Time;

public class DayHourIxigo {

	public String day;
	public Time openTime;
	public Time closeTime;
	
	public DayHourIxigo(String day,Time openTime,Time closeTime)
	{
		this.day=day;
		this.openTime=openTime;
		this.closeTime=closeTime;
	}
	
	@Override
	public String toString() {
		return "day:"+day+",openTime:"+openTime+",closeTime:"+closeTime;
	}
	
	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public Time getOpenTime() {
		return openTime;
	}
	public void setOpenTime(Time openTime) {
		this.openTime = openTime;
	}
	public Time getCloseTime() {
		return closeTime;
	}
	public void setCloseTime(Time closeTime) {
		this.closeTime = closeTime;
	}	
}
