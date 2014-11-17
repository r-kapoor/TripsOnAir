package com.hibernate;

//default package
//Generated Oct 14, 2014 11:08:41 PM by Hibernate Tools 3.4.0.CR1

/**
* Trains generated by hbm2java
*/
public class Trains implements java.io.Serializable {

	private int trainNo;
	private String trainName;
	private String daysOfTravel;
	private byte pantry;
	private String type;

	public Trains() {
	}

	public Trains(int trainNo, String trainName, String daysOfTravel,
			byte pantry) {
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.daysOfTravel = daysOfTravel;
		this.pantry = pantry;
	}

	public Trains(int trainNo, String trainName, String daysOfTravel,
			byte pantry, String type) {
		this.trainNo = trainNo;
		this.trainName = trainName;
		this.daysOfTravel = daysOfTravel;
		this.pantry = pantry;
		this.type = type;
	}

	public int getTrainNo() {
		return this.trainNo;
	}

	public void setTrainNo(int trainNo) {
		this.trainNo = trainNo;
	}

	public String getTrainName() {
		return this.trainName;
	}

	public void setTrainName(String trainName) {
		this.trainName = trainName;
	}

	public String getDaysOfTravel() {
		return this.daysOfTravel;
	}

	public void setDaysOfTravel(String daysOfTravel) {
		this.daysOfTravel = daysOfTravel;
	}

	public byte getPantry() {
		return this.pantry;
	}

	public void setPantry(byte pantry) {
		this.pantry = pantry;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

}