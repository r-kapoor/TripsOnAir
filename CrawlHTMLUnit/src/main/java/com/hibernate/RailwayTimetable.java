package com.hibernate;

import java.sql.Time;

/**
 * RailwayTimetable generated by hbm2java
 */
public class RailwayTimetable implements java.io.Serializable {

	/*private RailwayTimetableId id;

	
	public RailwayTimetable() {
	}

	public RailwayTimetable(RailwayTimetableId id) {
		this.id = id;
	}

	public RailwayTimetableId getId() {
		return this.id;
	}

	public void setId(RailwayTimetableId id) {
		this.id = id;
	}*/
	
	private int TrainNo;
	private String StationCode;
	private Time  ArrivalTime;
	private Time DepartureTime;
	private int DistanceCovered;
	private byte Day;
	private byte Route;
	
	
	public RailwayTimetable() {
	}

	public RailwayTimetable(int TrainNo, String StationCode,Time ArrivalTime,Time DepartureTime,int DistanceCovered,byte Day,byte Route) {
		this.TrainNo = TrainNo;
		this.StationCode = StationCode;
		this.ArrivalTime=ArrivalTime;
		this.DepartureTime=DepartureTime;
		this.DistanceCovered=DistanceCovered;
		this.Day=Day;
		this.Route=Route;		
	}

	public int getTrainNo() {
		return TrainNo;
	}

	public void setTrainNo(int trainNo) {
		TrainNo = trainNo;
	}

	public String getStationCode() {
		return StationCode;
	}

	public void setStationCode(String stationCode) {
		StationCode = stationCode;
	}

	public Time getArrivalTime() {
		return ArrivalTime;
	}

	public void setArrivalTime(Time arrivalTime) {
		ArrivalTime = arrivalTime;
	}

	public Time getDepartureTime() {
		return DepartureTime;
	}

	public void setDepartureTime(Time departureTime) {
		DepartureTime = departureTime;
	}

	public int getDistanceCovered() {
		return DistanceCovered;
	}

	public void setDistanceCovered(int distanceCovered) {
		DistanceCovered = distanceCovered;
	}

	public byte getDay() {
		return Day;
	}

	public void setDay(byte day) {
		Day = day;
	}

	public byte getRoute() {
		return Route;
	}

	public void setRoute(byte route) {
		Route = route;
	}	

}
