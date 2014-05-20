package com.goibibo;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Scanner;

public class UrlBuilder {

	private static String mappingFile = "ConfigFiles/goibibo/mapping.txt";
	private static String AllLinksFile ="ConfigFiles/goibibo/links.txt";
	private static String exceptionFile= "target/goibibo/exception.txt";
	private static String exceptionMsgFile = "target/goibibo/exceptionmsg.txt";
	private static String testingLinksFile = "ConfigFiles/goibibo/testingLinks.txt";
	private static HashMap<String,String>cityToCode = new HashMap<String,String>();
	private static int days =30;
	private static int count =0;
	
	public static void mainUrlBuilder(String url)throws Exception
	{
		String remove="/flights-schedule/";
		String srcDest=url.substring(remove.length(), url.length()-1);
		String srcCity= srcDest.substring(0, srcDest.indexOf("/"));
		String destCity = srcDest.substring(srcDest.indexOf("/")+1, srcDest.length());
		
		cityToCode=mapping();
		String srcCode = cityToCode.get(srcCity);
		String destCode = cityToCode.get(destCity);
		
		if((srcCode!=null)&&(destCode!=null)){
		DateFormat dateFormat1 = new SimpleDateFormat("yyyyMMdd");
		DateFormat dateFormat2 = new SimpleDateFormat("YYYY-MM-dd");
		//get current date time with Date()
	   	Date date = new Date();
	   	
	   	for(int i=0;i<days;i++)
	   	{
	   		String appendDate = dateFormat1.format(date);
	   		// make an economy url
	   		String newUrl = "http://www.goibibo.com/flight-searchresult/#air-"+srcCode+"-"+destCode+"-"+appendDate+"--1-0-0-E";
	   		System.out.println(newUrl);
	   		
	   		GoibiboUrl goUrl= new GoibiboUrl();
	   		goUrl.OriginCountry="India";
	   		goUrl.DestinationCountry="India";
	   		goUrl.departureDate=dateFormat2.format(date);
	   		goUrl.classofTravel="Economy";
	   		goUrl.link = new URL(newUrl);
	   		//extract the data from the url generated
	   		ExtractData.getData(goUrl);
	   		date = addDays(date,1);
	   		Thread.sleep(10000);
	   		count++;
	   	}
		}
		else
		{
			FileOutputStream exception=new FileOutputStream(exceptionFile,true);
			@SuppressWarnings("resource")
			PrintStream e=new PrintStream(exception);
			if(srcCity==null)
			{
			e.append("There is no code for the "+srcCity+"\n");
			}
			else if(destCity==null)
			{
				e.append("There is no code for the "+destCity+"\n");
			}
			else
			{
				e.append("There is no code for the "+srcCity+" and "+destCity+"\n");
			}
			
			e.close();
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
		while(in.hasNext())
		{
			String cityID=in.next();
			String line[]=cityID.split(",");			
			cityToID.put(line[0],line[1]);
		}	
		return cityToID;
	}
	
	public static void main(String args[]) throws Exception
	{
		//Scanner in = new Scanner(new File(AllLinksFile));
		Scanner in = new Scanner(new File(testingLinksFile));
		//Initialize the exception file so as to remove the older written contents
		FileOutputStream newException=new FileOutputStream(exceptionFile);
		FileOutputStream ExceptionMessage = new FileOutputStream(exceptionMsgFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(newException);
		PrintStream emsg = new PrintStream(ExceptionMessage);
		e.print("");emsg.print("");

		while(in.hasNext())
		{
			mainUrlBuilder(in.next());
		}
		System.out.println("count "+count);
	}
}