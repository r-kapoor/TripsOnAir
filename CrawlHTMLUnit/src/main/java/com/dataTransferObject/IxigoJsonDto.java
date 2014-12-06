package com.dataTransferObject;

import java.util.ArrayList;

import com.ixigo.DayHourIxigo;


public class IxigoJsonDto {

	public String placeName;
	public String type;
	public double latitude;
	public double longitude;
	public String description;
	public String photoLink;
	public String unescoHeritage;	
	public String address;
	public String pincode;
	public int time2Cover;
	public ArrayList<DayHourIxigo> dayHourList= new ArrayList<DayHourIxigo>();
	public double score;
	public int numRatingSources;
	public int adultCharge;
	public int foreignerCharge;
	
	@Override
	public String toString() {
		String output = "placeName:"+placeName+"\ntype:"+type+"\nlatitude:"+latitude+"\nlongitude:"+longitude
				+"\ndescription:"+description+"\nphotoLink:"+photoLink+"\nunescoHeritage:"+unescoHeritage
				+"\naddress:"+address+"\npincode:"+pincode+"\ntime2Cover:"+time2Cover
				+"\ndayHourList:";
		for(int i = 0; i < dayHourList.size(); i++)
		{
			output += dayHourList.get(i)+"\n";
		}
		output+="score:"+score+"\nnumRatingSources:"+numRatingSources
				+"\nadultCharge:"+adultCharge+"\nforeignerCharge:"+foreignerCharge;
		return output;
	}
	public String getPlaceName() {
		return placeName;
	}
	public void setPlaceName(String placeName) {
		this.placeName = placeName;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getPhotoLink() {
		return photoLink;
	}
	public void setPhotoLink(String photoLink) {
		this.photoLink = photoLink;
	}
	public String getUnescoHeritage() {
		return unescoHeritage;
	}
	public void setUnescoHeritage(String unescoHeritage) {
		this.unescoHeritage = unescoHeritage;
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
	public int getTime2Cover() {
		return time2Cover;
	}
	public void setTime2Cover(int time2Cover) {
		this.time2Cover = time2Cover;
	}
	public ArrayList<DayHourIxigo> getDayHourList() {
		return dayHourList;
	}
	public void setDayHourList(ArrayList<DayHourIxigo> dayHourList) {
		this.dayHourList = dayHourList;
	}
	public double getScore() {
		return score;
	}
	public void setScore(double score) {
		this.score = score;
	}
	public int getNumRatingSources() {
		return numRatingSources;
	}
	public void setNumRatingSources(int numRatingSources) {
		this.numRatingSources = numRatingSources;
	}
	public int getAdultCharge() {
		return adultCharge;
	}
	public void setAdultCharge(int adultCharge) {
		this.adultCharge = adultCharge;
	}
	public int getForeignerCharge() {
		return foreignerCharge;
	}
	public void setForeignerCharge(int foreignerCharge) {
		this.foreignerCharge = foreignerCharge;
	}
	
}
