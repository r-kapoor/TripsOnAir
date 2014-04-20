package com.dataTransferObject;

import java.net.URL;
import java.util.ArrayList;

public class BookingdotComDto {

	public String name;
	public String address;
	public String phoneNo;
	public String rating;
	public String description;
	public String checkIn;
	public String checkOut;
	public ArrayList<URL> photoLink;


	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPhoneNo() {
		return phoneNo;
	}
	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(String checkIn) {
		this.checkIn = checkIn;
	}
	public String getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(String checkOut) {
		this.checkOut = checkOut;
	}
	public ArrayList<URL> getPhotoLink() {
		return photoLink;
	}
	public void setPhotoLink(ArrayList<URL> photoLink) {
		this.photoLink = photoLink;
	}

}
