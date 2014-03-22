package com.redbus;


import java.net.URL;
import java.util.Date;



/**
 * Url builder for redbus
 * Sample Url: http://www.redbus.in/Booking/SelectBus.aspx?fromCityId=551&toCityId=1167&doj=31-Mar-2014&busType=Any&opId=0&doj1=22-Apr-2014
 * @author rajat
 *
 */

public class UrlBuilder {

	private static String base = "http://www.redbus.in/Booking/SelectBus.aspx?";
	public URL urlBuilder(String src,String srcId,String dest,String destId,String date) throws Exception
	{
		String newUrl = base+"fromCityId="+srcId+"&"+"toCityId="+destId+"&"+"doj="+date+"&busType=Any&opId=0";
		System.out.println(newUrl);
		URL url = new URL(newUrl);
		return url;
	}
}
