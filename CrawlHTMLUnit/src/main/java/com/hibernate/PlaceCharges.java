package com.hibernate;

public class PlaceCharges {

	private int placeID;
	private int childCharge;
	private int adultCharge;
	private int foreignerCharge;
	public PlaceCharges()
	{
		
	}
	public PlaceCharges(int placeID,int childCharge,int adultCharge,int foreignerCharge)
	{
		this.placeID=placeID;
		this.childCharge=childCharge;
		this.adultCharge=adultCharge;
		this.foreignerCharge=foreignerCharge;
	}
	public PlaceCharges(int placeID,int adultCharge,int foreignerCharge)
	{
		this.placeID=placeID;
		this.adultCharge=adultCharge;
		this.foreignerCharge=foreignerCharge;
	}
	public int getPlaceID() {
		return placeID;
	}
	public void setPlaceID(int placeID) {
		this.placeID = placeID;
	}
	public int getChildCharge() {
		return childCharge;
	}
	public void setChildCharge(int childCharge) {
		this.childCharge = childCharge;
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
