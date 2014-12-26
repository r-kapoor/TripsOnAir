package com.hibernate;

public class PlacesAlternateName {

	private int placeID;
	private String alternateName;
	
	public PlacesAlternateName(int placeID,String alternateName)
	{
		this.placeID=placeID;
		this.alternateName=alternateName;
	}
	public int getPlaceID() {
		return placeID;
	}
	public void setPlaceID(int placeID) {
		this.placeID = placeID;
	}
	public String getAlternateName() {
		return alternateName;
	}
	public void setAlternateName(String alternateName) {
		this.alternateName = alternateName;
	}	
}