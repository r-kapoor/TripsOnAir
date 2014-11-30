package com.hibernate;

import java.sql.Time;

public class FlightSchedule implements java.io.Serializable {
	
	private int flightID;
	private int originCityID;
	private int destinationCityID;
	private String operator;
	private String flightNumber;
	private String daysOfTravel;
	private Time departureTime;
	private Time arrivalTime;
	private int hops;
	private String carrierType;

	public FlightSchedule() {
	}
	
	public FlightSchedule(int OriginCityID, int DestinationCityID, String Operator, String FlightNumber, String DaysOfTravel, Time DepartureTime, Time ArrivalTime, int Hops) {
		this.originCityID = OriginCityID;
		this.destinationCityID = DestinationCityID;
		this.operator = FlightNumber;
		this.daysOfTravel = DaysOfTravel;
		this.departureTime = DepartureTime;
		this.arrivalTime = ArrivalTime;
		this.hops = Hops;
	}
	
	public FlightSchedule(int OriginCityID, int DestinationCityID, String Operator, String FlightNumber, String DaysOfTravel, Time DepartureTime, Time ArrivalTime, int Hops, String CarrierType) {
		this.originCityID = OriginCityID;
		this.destinationCityID = DestinationCityID;
		this.operator = FlightNumber;
		this.daysOfTravel = DaysOfTravel;
		this.departureTime = DepartureTime;
		this.arrivalTime = ArrivalTime;
		this.hops = Hops;
		this.carrierType = CarrierType;
	}

	public int getFlightID() {
		return flightID;
	}

	public void setFlightID(int flightID) {
		this.flightID = flightID;
	}
	
	public int getOriginCityID() {
		return originCityID;
	}

	public void setOriginCityID(int originCityID) {
		this.originCityID = originCityID;
	}

	public int getDestinationCityID() {
		return destinationCityID;
	}

	public void setDestinationCityID(int destinationCityID) {
		this.destinationCityID = destinationCityID;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getFlightNumber() {
		return flightNumber;
	}

	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}

	public String getDaysOfTravel() {
		return daysOfTravel;
	}

	public void setDaysOfTravel(String daysOfTravel) {
		this.daysOfTravel = daysOfTravel;
	}

	public Time getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(Time departureTime) {
		this.departureTime = departureTime;
	}

	public Time getArrivalTime() {
		return arrivalTime;
	}

	public void setArrivalTime(Time arrivalTime) {
		this.arrivalTime = arrivalTime;
	}

	public int getHops() {
		return hops;
	}

	public void setHops(int hops) {
		this.hops = hops;
	}

	public String getCarrierType() {
		return carrierType;
	}

	public void setCarrierType(String carrierType) {
		this.carrierType = carrierType;
	}

}