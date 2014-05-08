package com.goibibo;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
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
	//private static String baseUrl ="http://www.goibibo.com/flight-searchresult/#air-IXA-AGX-20140422--1-0-0-E";
	private static HashMap<String,String>cityToCode = new HashMap<String,String>();
	private static int days =60;
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
		/*Scanner in = new Scanner(new File(AllLinksFile));
		
		//Initialize the exception file so as to remove the older written contents
		FileOutputStream newException=new FileOutputStream(exceptionFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(newException);
		e.print("");
		
		while(in.hasNext())
		{
			mainUrlBuilder(in.next());
		}
		System.out.println("count "+count);*/
		ExtractData.getData();

		
	}
}
