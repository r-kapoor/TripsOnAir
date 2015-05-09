package com.hibernate;

/**
 * 
 * @author rajat
 *
 */
public class CityAlternateName implements java.io.Serializable{

	public int cityID;
	public int altCityID;
	public String alternateName;
	public String cityName;
	
	public CityAlternateName(){}
	
	public CityAlternateName(int cityID,String alternateName,String cityName){
		this.cityID = cityID;
		this.alternateName = alternateName;
		this.cityName = cityName;
	}
	
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public int getCityID() {
		return cityID;
	}
	public void setCityID(int cityID) {
		this.cityID = cityID;
	}
	public String getAlternateName() {
		return alternateName;
	}
	public void setAlternateName(String alternateName) {
		this.alternateName = alternateName;
	}
		
}
