package com.hibernate;
/**
 * RailwayStation generated by hbm2java
 */
public class RailwayStation implements java.io.Serializable {

	private String stationCode;
	private String stationName;

	public RailwayStation() {
	}

	public RailwayStation(String stationCode, String stationName) {
		this.stationCode = stationCode;
		this.stationName = stationName;
	}

	public String getStationCode() {
		return this.stationCode;
	}

	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}

	public String getStationName() {
		return this.stationName;
	}

	public void setStationName(String stationName) {
		this.stationName = stationName;
	}

}
