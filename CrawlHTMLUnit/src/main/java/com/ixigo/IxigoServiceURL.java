package com.ixigo;

import java.net.URL;

public class IxigoServiceURL {

	private String cityName;
	private String ixigoCityID;
	private URL ixigoCityURL;
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	public String getIxigoCityID() {
		return ixigoCityID;
	}
	public void setIxigoCityID(String ixigoCityID) {
		this.ixigoCityID = ixigoCityID;
	}
	public URL getIxigoCityURL() {
		return ixigoCityURL;
	}
	public void setIxigoCityURL(URL ixigoCityURL) {
		this.ixigoCityURL = ixigoCityURL;
	}
}
