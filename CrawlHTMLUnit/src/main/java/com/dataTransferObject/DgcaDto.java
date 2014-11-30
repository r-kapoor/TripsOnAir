package com.dataTransferObject;

import java.sql.Time;

public class DgcaDto {
	
	private String originCity;
	private String destinationCity;
	private String operator;
	private String flightNumber;
	private String daysOfTravel;
	private Time departureTime;
	private Time arrivalTime;
	private int hops;
	private String carrierType;
	
	public String getOriginCity() {
		return originCity;
	}
	public void setOriginCity(String originCity) {
		this.originCity = originCity;
	}
	public String getDestinationCity() {
		return destinationCity;
	}
	public void setDestinationCity(String destinationCity) {
		this.destinationCity = destinationCity;
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
	
	@Override
	public String toString() {
		return "OriginCity:"+this.originCity + ",destinationCity:" + this.destinationCity +",operator:"+this.operator +",flightNumber:" +this.flightNumber + ",daysOfTravel:" +
				this.daysOfTravel + ",departureTime:"+this.departureTime +",arrivalTime:"+this.arrivalTime +",hops:"+this.hops +",carrierType:"+this.carrierType;
	}
	
	

}
