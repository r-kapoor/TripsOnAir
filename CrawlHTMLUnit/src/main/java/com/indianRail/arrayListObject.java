package com.indianRail;

import java.sql.Time;

/**
 * 
 * @author rajat
 * Data associated with each train
 */
public class arrayListObject {

	public String stationName;
	public String stationCode;
	public Time arrTime;
	public Time deptTime;
	public int distTravelled;
	public byte day;
	public byte route;
	public String getStationName() {
		return stationName;
	}
	public void setStationName(String stationName) {
		this.stationName = stationName;
	}
	public String getStationCode() {
		return stationCode;
	}
	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}
	public Time getArrTime() {
		return arrTime;
	}
	public void setArrTime(Time arrTime) {
		this.arrTime = arrTime;
	}
	public Time getDeptTime() {
		return deptTime;
	}
	public void setDeptTime(Time deptTime) {
		this.deptTime = deptTime;
	}
	public int getDistTravelled() {
		return distTravelled;
	}
	public void setDistTravelled(int distTravelled) {
		this.distTravelled = distTravelled;
	}
	public byte getDay() {
		return day;
	}
	public void setDay(byte day) {
		this.day = day;
	}
	public byte getRoute() {
		return route;
	}
	public void setRoute(byte route) {
		this.route = route;
	}
}
