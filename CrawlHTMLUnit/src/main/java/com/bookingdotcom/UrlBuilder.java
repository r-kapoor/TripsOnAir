package com.bookingdotcom;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Scanner;

import org.hibernate.SessionFactory;

import GlobalClasses.getHibernateSession;

/**
 * 
 * @author rajat
 *
 */

public class UrlBuilder  extends getHibernateSession {

	private static String cityBase = "http://www.booking.com/searchresults.en-us.html?";
	//private static String cityIdFile = "ConfigFiles/bookingdotcom/CityId.txt";
	private static String cityIdFile = "ConfigFiles/bookingdotcom/test.txt";
	
	public static ArrayList<URL> HotelUrlBuilder(String url)throws Exception
	{
			ArrayList<URL> listUrls = new ArrayList<URL>();
		   String hotelBase = url.substring(0,url.indexOf("?")+1);
		   DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		   
		   //get current date time with Date()
		   Date checkinDate = new Date();
		   
		   //for next 60 days
		   for(int i=0;i<60;i++)
		   {
			   	String chkinDate = dateFormat.format(checkinDate);
				Date checkoutDate = addDays(checkinDate,1);
				String chkoutDate = dateFormat.format(checkoutDate);
				String newUrl =hotelBase+"checkin="+chkinDate+";"+"checkout="+chkoutDate;
				listUrls.add(new URL(newUrl));
				System.out.println("hotelurl "+newUrl);
				checkinDate = checkoutDate;
		   }
		   return listUrls;
	}
	
	@SuppressWarnings("resource")
	public static void cityUrlBuilder() throws Exception
	{
			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			//get current date time with Date()
		   	Date checkinDate = addDays(new Date(),30);
			String checkInDate = dateFormat.format(checkinDate);
			Date checkoutDate = addDays(checkinDate,1);
			String checkOutDate = dateFormat.format(checkoutDate);
			Scanner in= new Scanner(new File(cityIdFile));
			
			String[] resources = {"com/hibernate/HotelsDetails.hbm.xml", "com/hibernate/City.hbm.xml"};
			SessionFactory sessionFactory=getHibernateSessionFactory(resources);
			
			while(in.hasNext())
			{
				String cityId=in.next();
				//System.out.println(cityId);
				String city = cityId.substring(0,cityId.indexOf(","));
				String Id = cityId.substring(cityId.indexOf(",")+1,cityId.length());
				String newUrl = cityBase+"checkin_year_month_monthday="+checkInDate+";"+"checkout_year_month_monthday="+checkOutDate+";"+"city=-"+Id+";"+"rows=20"; 
				System.out.println("cityUrl "+newUrl);
				BKDCURL bookingUrl= new BKDCURL();
				bookingUrl.country="India";
				bookingUrl.city=city;
				bookingUrl.link=new URL(newUrl);
				bookingUrl.locality="unknown";
				Crawlbookingdotcom.getMainLinks(bookingUrl,sessionFactory);
				//Thread.sleep(4000);
				//break; //only to check flow in less time
			}
			sessionFactory.close();
	}
	
	public static URL updateUrl(String url) throws Exception
	{
		String base = url.substring(0,url.indexOf("?")+1);
		 DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		   
		   //get current date time with Date()
		   Date checkinDate = addDays(new Date(),30);
		   Date checkoutDate = addDays(checkinDate,1);
		   String checkInDate = dateFormat.format(checkinDate);
		   String chkoutDate = dateFormat.format(checkoutDate);
		   String newUrl =base+"checkin="+checkInDate+";"+"checkout="+chkoutDate;
		   
		   return(new URL(newUrl));
	}

	public static Date addDays(Date date, int days)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days);
        return cal.getTime();
    }

}