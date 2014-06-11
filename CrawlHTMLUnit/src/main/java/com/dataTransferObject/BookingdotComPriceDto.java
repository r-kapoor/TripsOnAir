package com.dataTransferObject;

import java.util.ArrayList;

public class BookingdotComPriceDto {
	
	private String source;
	private String name;
	private String city;
	private String country;
	private ArrayList<String> roomType;
	private ArrayList<Integer> numberofSubtypes;
	private ArrayList<String> conditions;
	private ArrayList<Integer> maxCapacity;
	private ArrayList<String> price;
	private String checkinDate;
	private String checkoutDate;
	
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public ArrayList<String> getConditions() {
		return conditions;
	}
	public void setConditions(ArrayList<String> conditions) {
		this.conditions = conditions;
	}
	public ArrayList<Integer> getMaxCapacity() {
		return maxCapacity;
	}
	public void setMaxCapacity(ArrayList<Integer> maxCapacity) {
		this.maxCapacity = maxCapacity;
	}
	public ArrayList<String> getRoomType() {
		return roomType;
	}
	public void setRoomType(ArrayList<String> roomType) {
		this.roomType = roomType;
	}
	public ArrayList<Integer> getNumberofSubtypes() {
		return numberofSubtypes;
	}
	public void setNumberofSubtypes(ArrayList<Integer> numberofSubtypes) {
		this.numberofSubtypes = numberofSubtypes;
	}
	public ArrayList<String> getPrice() {
		return price;
	}
	public void setPrice(ArrayList<String> price) {
		this.price = price;
	}
	public String getCheckinDate() {
		return checkinDate;
	}
	public void setCheckinDate(String checkinDate) {
		this.checkinDate = checkinDate;
	}
	public String getCheckoutDate() {
		return checkoutDate;
	}
	public void setCheckoutDate(String checkoutDate) {
		this.checkoutDate = checkoutDate;
	}

}
