package com.dataTransferObject;

import java.util.ArrayList;

import com.indianRail.arrayListObject;

public class IndianRailwayDto {

	public String name;
	public int trainNo;
	public String days;
	public byte pantry;
	public String type;
	public ArrayList<arrayListObject> stationsDetails;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getTrainNo() {
		return trainNo;
	}
	public void setTrainNo(int trainNo) {
		this.trainNo = trainNo;
	}
	public String getDays() {
		return days;
	}
	public void setDays(String days) {
		this.days = days;
	}
	public byte getPantry() {
		return pantry;
	}
	public void setPantry(byte pantry) {
		this.pantry = pantry;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public ArrayList<arrayListObject> getStationsDetails() {
		return stationsDetails;
	}
	public void setStationsDetails(ArrayList<arrayListObject> stationsDetails) {
		this.stationsDetails = stationsDetails;
	}	
	
}
