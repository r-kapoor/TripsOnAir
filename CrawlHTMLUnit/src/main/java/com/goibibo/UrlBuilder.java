package com.goibibo;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Scanner;

public class UrlBuilder {

	private static String mappingFile = "ConfigFiles/goibibo/mapping.txt";
	//private static String baseUrl ="http://www.goibibo.com/flight-searchresult/#air-IXA-AGX-20140422--1-0-0-E";
	private static HashMap<String,String>cityToCode = new HashMap<String,String>();
	private static int days =60;
	
	public static void mainUrlBuilder()throws Exception
	{
		String url="/flights-schedule/delhi/agatti/";
		String remove="/flights-schedule/";
		String srcDest=url.substring(remove.length(), url.length()-1);
		String srcCity= srcDest.substring(0, srcDest.indexOf("/"));
		String destCity = srcDest.substring(srcDest.indexOf("/")+1, srcDest.length());
		System.out.println(srcCity);
		System.out.println(destCity);
		
		cityToCode=mapping();
		String srcCode = cityToCode.get(srcCity);
		String destCode = cityToCode.get(destCity);
		
		System.out.println(srcCode);
		System.out.println(destCode);
		
		
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		//get current date time with Date()
	   	Date date = new Date();
	   	
	   	for(int i=0;i<days;i++)
	   	{
	   		String appendDate = dateFormat.format(date);
	   		String newUrl = "http://www.goibibo.com/flight-searchresult/#air-"+srcCode+"-"+destCode+"-"+appendDate+"--1-0-0-E";
	   		System.out.println(newUrl);
	   		//getPrice(new URL(newUrl));
	   		date = addDays(date,1);
	   	}
	}
	
	public static Date addDays(Date date, int days)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days);
        return cal.getTime();
    }
	
	public static HashMap<String,String> mapping() throws Exception
	{
		HashMap<String,String>cityToID = new HashMap<String,String>();
		Scanner in = new Scanner(new File(mappingFile));
		System.out.println("test");
		while(in.hasNext())
		{
			String test=in.next();
			System.out.println(test);
			String line[]=test.split(",");			
			cityToID.put(line[0],line[1]);
		}	
		return cityToID;
	}
	
	
	public static void main(String args[]) throws Exception
	{
		mainUrlBuilder();
	}
	
}
