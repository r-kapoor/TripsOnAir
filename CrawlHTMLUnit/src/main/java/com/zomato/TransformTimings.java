package com.zomato;

import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TransformTimings {
	private int number;
	private ArrayList<String> TimeStart;
	private ArrayList<String> TimeEnd;
	private ArrayList<String> Days;
	
	public TransformTimings()
	{
		number = 0;
		this.TimeStart = new ArrayList<String>();
		this.TimeEnd = new ArrayList<String>();
		this.Days = new ArrayList<String>();
	}

	public int getNumber() {
		return number;
	}

	public String getTimeStart(int index) {
		return checkFormat(TimeStart.get(index));
	}

	public String getTimeEnd(int index) {
		return checkFormat(TimeEnd.get(index));
	}

	public String getDays(int index) {
		return Days.get(index);
	}

	private String checkFormat(String time) {
		// TODO Auto-generated method stub
		if(time.indexOf(':')==-1)
		{
			time+=":00";
		}
		return time;
	}
	
	public void transform(String openinghrs) {
		// TODO Auto-generated method stub
		
		//Input
		//String openinghrs="9 AM to 1:30 PM";
		//String openinghrs="24 Hours";
		//String openinghrs="6 AM to 12 Midnight";
		//String openinghrs="11 AM to 11:30 PM, 12 Midnight to 11 PM";
		//String openinghrs="6 AM to 12 Midnight, 24 Hours";
		//String openinghrs="6 AM to 12 Midnight (Tue-Sun)";
		//String openinghrs="24 Hours (Tue-Fri)";
		//String openinghrs="9 PM to 3 AM (Mon-Tue, Thu, Sat)";
		//String openinghrs="12 Noon to 11:30 PM (Mon-Thu, Sun), 12 Noon to 1 AM (Fri-Sat)";
		//String openinghrs="24 Hours (Tue-Sun), Monday Closed";
		
		//Regex Used
		String timeformatxtoy = "\\d+[:]{0,1}\\d* ([AP]M|Noon|Midnight) to \\d+[:]{0,1}\\d* ([AP]M|Noon|Midnight)";
		String timeformat24hrs = "24 Hours";
		String dayclosed = "(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) Closed";
		String days = "(Sun|Mon|Tue|Wed|Thu|Fri|Sat)";
		String dayrange = "("+days+"-"+days+")";
		String daytext = "("+dayrange+"|"+days+")";
		String dayregex = "\\("+daytext+"(, "+daytext+")*"+"\\)";
		String timeformat = timeformatxtoy+"|"+timeformat24hrs+"|"+dayclosed;
		String timewithdays = "(("+timeformat+") ("+dayregex+")"+"|"+dayclosed+")";
		String dayoutput="";
		
		//Checking for one of the four cases
		if(openinghrs.matches(timeformat))
		{
			dayoutput = "0";
			extractTimings(openinghrs, timeformatxtoy, timeformat24hrs, dayoutput);
			System.out.println("Simple Time");
		}
		else if(openinghrs.matches("("+timeformat+"), ("+timeformat+")+"))
		{
			dayoutput = "0";
			StringTokenizer openinghrsST = new StringTokenizer(openinghrs, ",");
			while(openinghrsST.hasMoreTokens())
			{
				openinghrs = openinghrsST.nextToken().trim();
				extractTimings(openinghrs, timeformatxtoy, timeformat24hrs, dayoutput);
			}
			System.out.println("Multiple Time Formats");
		}
		else if(openinghrs.matches(timewithdays))
		{
			extractFromTimewithDays(openinghrs, timeformatxtoy,
					timeformat24hrs, dayrange, dayrange, dayregex, timeformat, days);
			System.out.println("Simple Time With Days:");
		}
		else if(openinghrs.matches(timewithdays+"(, "+timewithdays+")*"))
		{
			StringTokenizer openinghrsST = new StringTokenizer(openinghrs, ",");
			openinghrs = "";
			while(openinghrsST.hasMoreTokens())
			{
				openinghrs += openinghrsST.nextToken().trim();
				//System.out.println("input:"+openinghrs);
				if(openinghrs.matches(dayclosed))
				{
					continue;
				}
				else if(openinghrs.matches(timewithdays))
				{
					extractFromTimewithDays(openinghrs, timeformatxtoy, timeformat24hrs, timewithdays, dayrange, dayregex, timeformat, days);
					openinghrs = "";
				}
				else
				{
					openinghrs+=", ";
				}
			}
			System.out.println("Multi Time With Days");
		}
		else
		{
			//Did not match any of the inputs
			String starttime = "0";
			String endtime = "0";
			dayoutput = "8";
			this.TimeStart.add(starttime);
			this.TimeEnd.add(endtime);
			this.Days.add(dayoutput);
			this.number++;
		}
	}

	private void extractFromTimewithDays(String openinghrs,
			String timeformatxtoy, String timeformat24hrs, String timewithdays,
			String dayrange, String dayregex, String timeformat, String days)
			throws NumberFormatException {
		String dayoutput;
		String timings = openinghrs.replaceAll("("+timeformat+")"+" "+dayregex,"$1" );
		String daysofrun = openinghrs.replaceAll("("+timeformat+")"+" ("+dayregex+")","$5" );
		daysofrun = daysofrun.substring(1, daysofrun.length()-1);
		dayoutput="";
		if(daysofrun.indexOf(',')==-1)
		{
			dayoutput = getDayOutput(days, dayrange, daysofrun);
			extractTimings(timings, timeformatxtoy, timeformat24hrs, dayoutput);
		}
		else
		{
			StringTokenizer daysofrunST = new StringTokenizer(daysofrun, ",");
			while(daysofrunST.hasMoreTokens())
			{
				daysofrun = daysofrunST.nextToken().trim();
				//System.out.println("days:"+daysofrun);
				dayoutput += getDayOutput(days, dayrange, daysofrun);
			}
			extractTimings(timings, timeformatxtoy, timeformat24hrs, dayoutput);
		}
	}

	private static String getDayOutput(String days, String dayrange, String daysofrun) {
		String dayoutput = "";
		//System.out.println(":"+daysofrun+":");
		//System.out.println(":"+days+":");
		if(daysofrun.matches(dayrange))
		{
			int daystart = getDayInt(daysofrun.substring(0, daysofrun.indexOf('-')));
			int dayend = getDayInt(daysofrun.substring(daysofrun.indexOf('-')+1));
			dayoutput = getDayRange(daystart, dayend);
		}
		else if(daysofrun.matches(days))
		{
			//System.out.println("matches");
			dayoutput = getDayInt(daysofrun)+"";
		}
		//System.out.println("out:"+dayoutput);
		return dayoutput;
	}

	private void extractTimings(String openinghrs,
			String timeformatxtoy, String timeformat24hrs, String dayoutput)
			throws NumberFormatException {
		String starttime ="", startperiod = "", endtime = "", endperiod = "";
		if(openinghrs.matches(timeformatxtoy))
		{
			starttime = openinghrs.replaceAll("(\\d+[:]{0,1}\\d*)( ([AP]M|Noon|Midnight) to \\d+[:]{0,1}\\d* ([AP]M|Noon|Midnight))","$1");
			startperiod = openinghrs.replaceAll("(\\d+[:]{0,1}\\d* )([AP]M|Noon|Midnight)( to \\d+[:]{0,1}\\d* ([AP]M|Noon|Midnight))","$2");
			endtime = openinghrs.replaceAll("(\\d+[:]{0,1}\\d* ([AP]M|Noon|Midnight) to )(\\d+[:]{0,1}\\d*)( ([AP]M|Noon|Midnight))","$3");
			endperiod = openinghrs.replaceAll("(\\d+[:]{0,1}\\d* ([AP]M|Noon|Midnight) to \\d+[:]{0,1}\\d* )([AP]M|Noon|Midnight)","$3");
			if(startperiod.equals("PM"))
			{
				starttime = convertPM(starttime);
			}
			if(endperiod.equals("PM"))
			{
				endtime = convertPM(endtime);
			}
			if(startperiod.equals("Midnight"))
			{
				starttime = "0";
			}
			if(endperiod.equals("Midnight"))
			{
				endtime = "0";
			}
			if(startperiod.equals("Noon"))
			{
				starttime = "12";
			}
			if(endperiod.equals("Noon"))
			{
				endtime = "12";
			}
			
		}
		else if(openinghrs.matches(timeformat24hrs))
		{
			starttime = "0";
			endtime = "0";
			dayoutput = "0";
		}
		//System.out.println("Start Time1:"+starttime);
		//System.out.println("End Time1:"+endtime);
		//System.out.println("Days1:"+dayoutput);
		this.TimeStart.add(starttime);
		this.TimeEnd.add(endtime);
		this.Days.add(dayoutput);
		this.number++;
	}

	private static String convertPM(String time)
			throws NumberFormatException {
		int poscolon = time.indexOf(':');
		if(poscolon==-1)
		{
			time = (Integer.parseInt(time)+12)+"";
		}
		else
		{
			time = Integer.parseInt(time.substring(0, poscolon))+12+time.substring(poscolon);
		}
		return time;
	}
	
	private static int getDayInt(String day)
	{
		if(day.equals("Sun"))
		{
			return 1;
		}
		if(day.equals("Mon"))
		{
			return 2;
		}
		if(day.equals("Tue"))
		{
			return 3;
		}
		if(day.equals("Wed"))
		{
			return 4;
		}
		if(day.equals("Thu"))
		{
			return 5;
		}
		if(day.equals("Fri"))
		{
			return 6;
		}
		if(day.equals("Sat"))
		{
			return 7;
		}
		return 0;
	}
	private static String getDayRange(int daystart, int dayend)
	{
		String dayrange = "";
		int i = daystart;
		while(true)
		{
			if(i==8)
			{
				i=1;
			}
			dayrange = dayrange + i;
			if(i==dayend)
			{
				break;
			}
			i++;
		}
		return dayrange;
	}
}
