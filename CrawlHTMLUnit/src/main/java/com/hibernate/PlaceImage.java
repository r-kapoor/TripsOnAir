package com.hibernate;

public class PlaceImage {
	private int imgID;
	private int placeID;
	private String imgURL;
	
	
	public PlaceImage()
	{
		
	}
	
	public PlaceImage(int imgID,int placeID,String imgURL)
	{
		this.imgID=imgID;
		this.placeID=placeID;
		this.imgURL=imgURL;
	}
	public PlaceImage(int placeID,String imgURL)
	{
		this.placeID=placeID;
		this.imgURL=imgURL;
	}
	
	public int getImgID() {
		return imgID;
	}

	public void setImgID(int imgID) {
		this.imgID = imgID;
	}

	public int getPlaceID() {
		return placeID;
	}
	public void setPlaceID(int placeID) {
		this.placeID = placeID;
	}
	public String getImgURL() {
		return imgURL;
	}
	public void setImgURL(String imgURL) {
		this.imgURL = imgURL;
	}
}