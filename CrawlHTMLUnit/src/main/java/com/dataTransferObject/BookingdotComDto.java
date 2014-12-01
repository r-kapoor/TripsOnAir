package com.dataTransferObject;

import java.net.URL;
import java.util.ArrayList;

/**
 * @author rajat
 */

public class BookingdotComDto {

	public int source;
	public String Locality;
	public String city;
	public String country;
	public double latitude;
	public double longitude;
	public String name;
	public double rating;
	public int numofreviews;
	public String photoLink;
	public String hotelUrl;
	public int price;
	public String roomType;
	public int maxPersons;
	public int getSource() {
		return source;
	}
	public void setSource(int source) {
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
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getRating() {
		return rating;
	}
	public void setRating(double rating) {
		this.rating = rating;
	}
	public int getNumofreviews() {
		return numofreviews;
	}
	public void setNumofreviews(int numofreviews) {
		this.numofreviews = numofreviews;
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
}
