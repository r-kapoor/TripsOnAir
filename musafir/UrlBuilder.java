package com.musafir;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Url Bulder for musafir flights
 * @author rajat
 *
 */

public class UrlBuilder {

	private static String base ="http://in.musafir.com/Trip/Flights.aspx?p=1&f=0&sd=";
	private static Map<String,String> path= new HashMap<String, String>();
	
	 public static void main(String[] args) {
		 
		   DateFormat dateFormat = new SimpleDateFormat("dd/MM/yy");
		   //get current date time with Date()
		   Date date = new Date();
		   String newUrl="";
		   route();
		   
		 Iterator it = path.entrySet().iterator();
			   
		 while (it.hasNext()) {
			  Map.Entry pairs = (Map.Entry)it.next();
			  for(int i=0;i<100;i++)
			  {
				 date = addDays(date,1);
				 String appendDate = dateFormat.format(date);
				 newUrl =base+appendDate+"&"+"o="+pairs.getKey()+"&"+"o="+pairs.getValue()+"&ad=1";
				 System.out.println(newUrl);  
			  }
			        it.remove(); // avoids a ConcurrentModificationException  
		}
	  }
	
	 public static Date addDays(Date date, int days)
	    {
	        Calendar cal = Calendar.getInstance();
	        cal.setTime(date);
	        cal.add(Calendar.DATE, days); //minus number would decrement the days
	        return cal.getTime();
	    }
	 
	 @SuppressWarnings("null")
	public static void route()
	 {
		//read possible sources and destination from list of roots in database
		 String source="BLR";
		 String destination="GOI";
		 path.put(source,destination);
	 }
	 
}
