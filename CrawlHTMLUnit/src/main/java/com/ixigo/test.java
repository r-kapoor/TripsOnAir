package com.ixigo;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class test {

	public static void main(String args[])
	{
		String time2cover[]={"Around 1 hour","1 to 2 hours","1-2 hours","30 minutes to 1 hour","1 hour","2 hours","","20 minutes",
		"30 to 45 minutes","1 to2 hours"};
		String pattern1="([Around ]*)(\\d+)([ ]*)(hours|hour|minutes|minute)";
		String pattern2="(\\d+)([ ]*)([hours|hour|minutes|minute]*)([ ]*to[ ]*)(\\d+)([ ]*)(hours|hour|minutes|minute)";	
		String pattern3="(\\d+)-(\\d+)([ ]*)(hours|hour|minutes|minute)";
		
		String address="Machchhi Bhavan, Lucknow, Uttar Pradesh 226003, India";
		
		for(int i=0;i<time2cover.length;i++)
		{	
		
		String test=time2cover[i];
		int time=-1;
		String unit="";
		System.out.println(test);
				
		if(test.equals(""))
		{
			time=-1;
			System.out.println("Blank");
		}
		else if(test.matches(pattern1))
		{
			time=Integer.parseInt(test.replaceAll(pattern1, "$2"));
			unit =test.replaceAll(pattern1, "$4");
			System.out.println("time:"+time);
			System.out.println("unit:"+unit);
		}
		else if(test.matches(pattern2))
		{
			int time1=Integer.parseInt(test.replaceAll(pattern2, "$1"));
			String unit1 =test.replaceAll(pattern2, "$3");
			int time2=Integer.parseInt(test.replaceAll(pattern2, "$5"));
			String unit2=test.replaceAll(pattern2, "$7");
			System.out.println("time1:"+time1);
			System.out.println("unit1:"+unit1);
			System.out.println("time2:"+time2);
			System.out.println("unit2:"+unit2);
		}
		else if(test.matches(pattern3))
		{
			int time1=Integer.parseInt(test.replaceAll(pattern3, "$1"));
			int time2=Integer.parseInt(test.replaceAll(pattern3, "$2"));
			String unit2=test.replaceAll(pattern3, "$4");
			System.out.println("time1:"+time1);
			System.out.println("time2:"+time2);
			System.out.println("unit2:"+unit2);
		}
		else
		{
			System.out.println("No matches");
		}
		
		
		}
		
String addrPattern=".*(\\d{6}).*";
if(address.matches(addrPattern))
{
	String pincode=address.replaceAll(addrPattern, "$1");
	System.out.println("pin:"+pincode);
}

Time time = Time.valueOf("12:15:60");
System.out.println(time);

SimpleDateFormat displayFormat = new SimpleDateFormat("HH:mm:ss");
SimpleDateFormat parseFormat = new SimpleDateFormat("hh:mm a");
Date date = null;
try {
	date = parseFormat.parse("00:30 PM");
} catch (ParseException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
}
System.out.println(parseFormat.format(date) + " = " + displayFormat.format(date));
		
String s = "\"[\"Sun\",\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sat\"]\"";
String s1 = s.replaceAll("\"|\\[|\\]", "");
		System.out.println(s1);
	}
	
}
