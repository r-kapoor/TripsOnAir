package com.dataTransferObject;

import java.net.URL;
import java.util.ArrayList;

public class BookingdotComDto {

	public String source;
	public String Locality;
	public String city;
	public String country;
	public String name;
	public String address;
	public String pincode;
	public String phoneNo;
	public String rating;
	public String numofreviews;
	public String description;
	public String checkIn;
	public String checkOut;
	public ArrayList<URL> photoLink;


	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getLocality() {
		return Locality;
	}
	public void setLocality(String locality) {
		Locality = locality;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
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
	public String getPincode() {
		return pincode;
	}
	public void setPincode(String pincode) {
		this.pincode = pincode;
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
	public String getNumofreviews() {
		return numofreviews;
	}
	public void setNumofreviews(String numofreviews) {
		this.numofreviews = numofreviews;
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
