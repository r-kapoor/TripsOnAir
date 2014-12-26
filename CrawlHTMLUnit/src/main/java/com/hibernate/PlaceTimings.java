package com.hibernate;

import java.sql.Time;

public class PlaceTimings {

	private int timingID;
	private int placeID;
	private Time timeStart;
	private Time timeEnd;
	private String days;
	
	public PlaceTimings()
	{
		
	}
	public PlaceTimings(int timingsID,int placeID,Time timeStart,Time timeEnd,String days)
	{
		this.timingID=timingsID;
		this.placeID=placeID;
		this.timeStart=timeStart;
		this.timeEnd=timeEnd;
		this.days=days;
	}
	public PlaceTimings(int placeID,Time timeStart,Time timeEnd,String days)
	{
		this.placeID=placeID;
		this.timeStart=timeStart;
		this.timeEnd=timeEnd;
		this.days=days;
	}
	
	public int getTimingID() {
		return timingID;
	}

	public void setTimingID(int timingID) {
		this.timingID = timingID;
	}

	public int getPlaceID() {
		return placeID;
	}
	public void setPlaceID(int placeID) {
		this.placeID = placeID;
	}
	public Time getTimeStart() {
		return timeStart;
	}
	public void setTimeStart(Time timeStart) {
		this.timeStart = timeStart;
	}
	public Time getTimeEnd() {
		return timeEnd;
	}
	public void setTimeEnd(Time timeEnd) {
		this.timeEnd = timeEnd;
	}
	public String getDays() {
		return days;
	}
	public void setDays(String days) {
		this.days = days;
	}
}
