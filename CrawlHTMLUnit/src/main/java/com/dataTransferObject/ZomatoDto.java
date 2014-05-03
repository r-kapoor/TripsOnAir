package com.dataTransferObject;

import java.net.URL;
import java.util.ArrayList;

public class ZomatoDto {	 
	
	public String source; //one of Zomato or other sources
	public String city;
	public String country;
	public String locality;
	public String name;
	public String address;
	public String phone;
	public String rating;
	public String numofvotes;
	public String homeDelivery;
	public String dineIn;
	public String nonveg;
	public String ac;
	public String bar;
	public int cost;
	public String openinghrs;
	public String cuisines;
	public String description;
	public ArrayList<URL> photolink;
	public int CityID;
	public int RestaurantID;
	
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
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
	public String getLocality() {
		return locality;
	}
	public void setLocality(String locality) {
		this.locality = locality;
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
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public String getNumofvotes() {
		return numofvotes;
	}
	public void setNumofvotes(String numofvotes) {
		this.numofvotes = numofvotes;
	}
	public String getHomeDelivery() {
		return homeDelivery;
	}
	public void setHomeDelivery(String homeDelivery) {
		this.homeDelivery = homeDelivery;
	}
	public String getDineIn() {
		return dineIn;
	}
	public void setDineIn(String dineIn) {
		this.dineIn = dineIn;
	}
	public String getNonveg() {
		return nonveg;
	}
	public void setNonveg(String nonveg) {
		this.nonveg = nonveg;
	}
	public String getAc() {
		return ac;
	}
	public void setAc(String ac) {
		this.ac = ac;
	}
	public String getBar() {
		return bar;
	}
	public void setBar(String bar) {
		this.bar = bar;
	}
	public int getCost() {
		return cost;
	}
	public void setCost(int cost) {
		this.cost = cost;
	}
	public String getOpeninghrs() {
		return openinghrs;
	}
	public void setOpeninghrs(String openinghrs) {
		this.openinghrs = openinghrs;
	}
	public String getCuisines() {
		return cuisines;
	}
	public void setCuisines(String cuisines) {
		this.cuisines = cuisines;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public ArrayList<URL> getPhotolink() {
		return photolink;
	}
	public void setPhotolink(ArrayList<URL> photolink) {
		this.photolink = photolink;
	}
	public int getCityID() {
		return CityID;
	}
	public void setCityID(int cityID) {
		CityID = cityID;
	}
	public int getRestaurantID() {
		return RestaurantID;
	}
	public void setRestaurantID(int restaurantID) {
		RestaurantID = restaurantID;
	}
}
