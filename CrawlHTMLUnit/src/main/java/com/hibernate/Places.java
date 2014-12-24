package com.hibernate;

public class Places {
	private int placeId;
	private String type;
	private String name;
	private String address;
	private int pinCode;
	private String phoneNo;
	private int cityId;
	private String description;
	private double score;
	private int scoreSources;
	private String broadCategory;
	private String website;
	private double latitude;
	private double longitude;
	private int time2Cover;
	private byte unescoHeritage;
	private byte ixigo;
	
	public Places()
	{}
	
	public Places(int placeId,String type,String name,String address,int pinCode,String phoneNo,
			int cityId,String description,double score,int scoreSources,String broadCategory,
			String website,double latitude,double longitude,int time2Cover,byte unescoHeritage,byte ixigo)
	{
		this.placeId=placeId;
		this.type=type;
		this.name=name;
		this.address=address;
		this.pinCode=pinCode;
		this.phoneNo=phoneNo;
		this.cityId=cityId;
		this.description=description;
		this.score=score;
		this.scoreSources=scoreSources;
		this.broadCategory=broadCategory;
		this.website=website;
		this.latitude=latitude;
		this.longitude=longitude;
		this.time2Cover=time2Cover;
		this.unescoHeritage=unescoHeritage;
		this.ixigo=ixigo;
	}
	public Places(String type,String name,String address,int pinCode,
			int cityId,String description,double score,int scoreSources,
			double latitude,double longitude,int time2Cover,byte unescoHeritage,byte ixigo)
	{
		this.type=type;
		this.name=name;
		this.address=address;
		this.pinCode=pinCode;
		this.cityId=cityId;
		this.description=description;
		this.score=score;
		this.scoreSources=scoreSources;
		this.latitude=latitude;
		this.longitude=longitude;
		this.time2Cover=time2Cover;
		this.unescoHeritage=unescoHeritage;
		this.ixigo=ixigo;
	}
	
	public int getPlaceId() {
		return placeId;
	}

	public void setPlaceId(int placeId) {
		this.placeId = placeId;
	}

	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
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
	public int getPinCode() {
		return pinCode;
	}
	public void setPinCode(int pinCode) {
		this.pinCode = pinCode;
	}
	public String getPhoneNo() {
		return phoneNo;
	}
	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}
	public int getCityId() {
		return cityId;
	}
	public void setCityId(int cityId) {
		this.cityId = cityId;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public double getScore() {
		return score;
	}
	public void setScore(double score) {
		this.score = score;
	}
	public int getScoreSources() {
		return scoreSources;
	}
	public void setScoreSources(int scoreSources) {
		this.scoreSources = scoreSources;
	}
	public String getBroadCategory() {
		return broadCategory;
	}
	public void setBroadCategory(String broadCategory) {
		this.broadCategory = broadCategory;
	}
	public String getWebsite() {
		return website;
	}
	public void setWebsite(String website) {
		this.website = website;
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
	public int getTime2Cover() {
		return time2Cover;
	}
	public void setTime2Cover(int time2Cover) {
		this.time2Cover = time2Cover;
	}
	public byte getUnescoHeritage() {
		return unescoHeritage;
	}
	public void setUnescoHeritage(byte unescoHeritage) {
		this.unescoHeritage = unescoHeritage;
	}
	public byte getIxigo() {
		return ixigo;
	}
	public void setIxigo(byte ixigo) {
		this.ixigo = ixigo;
	}
}