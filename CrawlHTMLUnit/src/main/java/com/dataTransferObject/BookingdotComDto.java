package com.dataTransferObject;

import java.net.URL;
import java.util.ArrayList;

/**
 * @author rajat
 */

public class BookingdotComDto {

	public String source;
	public String Locality;
	public String city;
	public String country;
	public String latitude;
	public String longitude;
	public String name;
	public String rating;
	public String numofreviews;
	public String photoLink;
	public String hotelUrl;
	public String price;
	public String roomType;
	public String maxPersons;
	
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
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getLongitude() {
		return longitude;
	}
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getRoomType() {
		return roomType;
	}
	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}
	public String getMaxPersons() {
		return maxPersons;
	}
	public void setMaxPersons(String maxPersons) {
		this.maxPersons = maxPersons;
	}

}
