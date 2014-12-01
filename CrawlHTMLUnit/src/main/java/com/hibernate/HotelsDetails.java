package com.hibernate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

public class HotelsDetails implements java.io.Serializable {

	private int hotelID;
	private String name;
	private int cityID;
	private String locality;
	private double latitude;
	private double longitude;
	private double rating;
	private int numReviews;
	private String photoLink;
	private String hotelUrl;
	private int price;
	private String roomType;
	private int maxPersons;
	private int source;
	
	public HotelsDetails(){
		
	}
	
	public HotelsDetails(int hotelID,String name,int cityID,String locality,double latitude,double longitude,double rating,int numReviews,String photoLink,String hotelUrl,int price,String roomType,int maxPersons,int source)
	{
		this.hotelID=hotelID;
		this.name=name;
		this.cityID=cityID;
		this.locality=locality;
		this.latitude=latitude;
		this.longitude=longitude;
		this.rating = rating;
		this.numReviews=numReviews;
		this.photoLink=photoLink;
		this.hotelUrl=hotelUrl;
		this.price=price;
		this.roomType=roomType;
		this.maxPersons=maxPersons;
		this.source=source;
	}
	
	public int getHotelID() {
		return hotelID;
	}

	public void setHotelID(int hotelID) {
		this.hotelID = hotelID;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getCityID() {
		return cityID;
	}
	public void setCityID(int cityID) {
		this.cityID = cityID;
	}
	public String getLocality() {
		return locality;
	}
	public void setLocality(String locality) {
		this.locality = locality;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public double getRating() {
		return rating;
	}
	public void setRating(double rating) {
		this.rating = rating;
	}
	public int getNumReviews() {
		return numReviews;
	}
	public void setNumReviews(int numReviews) {
		this.numReviews = numReviews;
	}
	public String getPhotoLink() {
		return photoLink;
	}
	public void setPhotoLink(String photoLink) {
		this.photoLink = photoLink;
	}
	public String getHotelUrl() {
		return hotelUrl;
	}
	public void setHotelUrl(String hotelUrl) {
		this.hotelUrl = hotelUrl;
	}
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public String getRoomType() {
		return roomType;
	}
	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}
	public int getMaxPersons() {
		return maxPersons;
	}
	public void setMaxPersons(int maxPersons) {
		this.maxPersons = maxPersons;
	}
	public int getSource() {
		return source;
	}
	public void setSource(int source) {
		this.source = source;
	}
}
