/**
 * 
 */
package com.redbus;
import java.net.URL;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.StringTokenizer;

import GlobalClasses.ConnectMysql;

import com.dataTransferObject.*;

/**
 * @author rkapoor
 *
 */
public class TransferDataRedBus {
public static void transferData(RedBusDto redBusDto, Statement statement) throws Exception{
		
		//Declarations
		Boolean originCityExists = false, destinationExists = false, busExists = false;

		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		String source = redBusDto.getSource();
		String operatorName = redBusDto.getOperatorName().replaceAll("'", "''");
		String busType = redBusDto.getBusType().replaceAll("'", "''");
		String departureTime = redBusDto.getDepartureTime();
		String arrivalTime = redBusDto.getArrivalTime();
		String duration = redBusDto.getDuration();
		String rating = redBusDto.getRating();
		String ratingtext = redBusDto.getRatingText();
		String price = redBusDto.getFare();
		String origin = redBusDto.getOrigin().replaceAll("'", "''");
		String destination = redBusDto.getDestination().replaceAll("'", "''");
		String departureDate = redBusDto.getDepartureDate();
		
		int nextday = 0;
		
		//Transforming the price
		int priceRs;
		if(price.matches(".*\\d+.*"))
		{
			priceRs = Integer.parseInt(price.replaceAll("[^0-9]",""));
		}
		else
		{
			priceRs = -1;
		}
		
		//Transforming Departure and Arrival Times
		departureTime = transformTimings(departureTime);
		arrivalTime = transformTimings(arrivalTime);
		
		//Transforming duration
		duration = transformDuration(duration);
		
		int OriginCityID=-1, DestinationID=-1, BusID=-1;

		System.out.println("Inserting to DB");
		
		//Getting the OriginCityID & DestinationID and if not exists then inserting the City
		
		//Checking if the Origin City Exists in DB
		ResultSet getCityR = statement.executeQuery("SELECT * FROM City WHERE CityName='"+origin+"';");
		while(getCityR.next())
		{
			
			//The same name city in same country exists
			originCityExists = true;
			OriginCityID = getCityR.getInt("CityID");
			//if(getCityR.getInt(source)==1)
			//{
				//Nothing to Merge
				/*
				 * Merge Logic For Crawl from Same Source Present Here
				 * Then Update the tuple
				 */
			//}
			//Merge the info already present
		}
		if(!originCityExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country) VALUES('"+origin+"','TEMP','INDIA');",Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    OriginCityID = rs.getInt(1);
		}
		
		//Checking if the Destination City Exists in DB
		getCityR = statement.executeQuery("SELECT * FROM City WHERE CityName='"+destination+"';");
		while(getCityR.next())
		{
			//The same name city in same country exists
			destinationExists = true;
			DestinationID = getCityR.getInt("CityID");
			//if(getCityR.getInt(source)==1)
			//{
				//Nothing to Merge
				/*
				 * Merge Logic For Crawl from Same Source Present Here
				 * Then Update the tuple
				 */
			//}
			//Merge the info already present
		}
		if(!destinationExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country) VALUES('"+origin+"','TEMP','INDIA');",Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    DestinationID = rs.getInt(1);
		}
		
		System.out.println("City Inserted");
		
		
		//Inserting the Bus
		//Checking if the Bus Exists in DB
		ResultSet getBusR = statement.executeQuery("SELECT * FROM Bus WHERE OriginCityID="+OriginCityID+
				" AND DestinationID = "+DestinationID+
				" AND DepartureDate = '"+departureDate+"'"+
				" AND DepartureTime = '"+departureTime+"'"+
				" AND ArrivalTime = '"+arrivalTime+"'"+
				" AND Operator = '"+operatorName+"';");
		while(getBusR.next())
		{
			BusID=getBusR.getInt("BusID");
			//The same name bus service between the same cities exists
			busExists = true;
			if(getBusR.getInt(source)==1)
			{
				/*
				 * Merge Logic For Crawl from Same Source Present Here
				 * Then Update the tuple
				 */
				//Updating the Price of the Bus
				int priceOld = getBusR.getInt("Price");
				if(priceOld!=priceRs)
				{
					String update = "UPDATE Bus SET Price = "+priceRs+" WHERE BusID = "+BusID+";";
					statement.executeUpdate(update);
					break;
				}
			}
			else
			{
				//The tuple is from a different source. Merge the data
				String update = "UPDATE Bus SET RedBus = 1";
				
				//Updating the price
				int priceOld = getBusR.getInt("Price");
				if(priceOld!=priceRs)
				{
					update = update +", Price = "+priceRs;
				}
				
				//System.out.println(update +" WHERE RestaurantID = "+RestaurantID+";");
				statement.executeUpdate(update +" WHERE BusID = "+BusID+";");
				break;
			}
			
		}
		if(!busExists)
		{
			//Insert the data
			String insert= "INSERT INTO Bus(";
			String values= ") VALUES(";
			insert = insert + "OriginCityID, DestinationID, Operator, Price, RedBus";
			values = values + OriginCityID+", "+DestinationID+", '"+operatorName+"', "+priceRs+", 1";
			
			//Inserting Departure Date
			insert = insert + ", DepartureDate";
			if(departureDate.matches("\\d+-\\d+-\\d+"))
			{
				values = values + ", '"+departureDate+"'";
			}
			else
			{
				values = values + ", '1000-01-01'";	
			}
			
			//Inserting Departure Time
			insert = insert + ", DepartureTime";
			if(departureTime.matches("\\d+:\\d+"))
			{
				values = values + ", '"+departureTime+"'";				
			}
			else
			{
				values = values + ", '23:59:59'";
			}
			
			//Inserting Arrival Time
			insert = insert + ", ArrivalTime";
			if(arrivalTime.matches("\\d+:\\d+"))
			{
				values = values + ", '"+arrivalTime+"'";				
			}
			else
			{
				values = values + ", '23:59:59'";
			}
			
			//Inserting the duration
			insert = insert + ", Duration";
			if(!duration.isEmpty())
			{
				values = values + ", '"+duration+"'";
			}
			else
			{
				values = values + ", '23:59:59'";
			}
			
			//Inserting the rating
			if(!rating.isEmpty())
			{
				if(rating.matches("\\d+\\.\\d+/\\d+")||(rating.matches("\\d+/\\d+")))
				{
					rating = rating.substring(0, rating.indexOf('/'));
					insert = insert + ", Rating";
					values = values + ", "+rating;
				}
			}
			
			//Inserting the NumofReviews
			if(!ratingtext.isEmpty())
			{
				insert = insert + ", NumofReviews";
				if(ratingtext.matches("No Ratings[\\s\\S]*"))
				{
					values = values + ", 0";
				}
				else if(ratingtext.matches("\\d+ Ratings[\\s\\S]*"))
				{
					values = values + ", "+ratingtext.replaceAll("[^0-9]","");
				}
				else
				{
					values = values + ", -1";
				}
			}
			
			System.out.println(insert + values+");");
			statement.executeUpdate(insert + values+");");
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    BusID = rs.getInt(1);
		}
		
		System.out.println("Bus Inserted");
		
		//There is not enough data crawled to be inserted in the table Bus_Boardings
		System.out.println("Insertions Complete");	
		
	}

private static String transformDuration(String duration) {
	// TODO Auto-generated method stub
	if(duration.matches("\\d+:\\d+.*"))
	{
		duration = duration.replaceAll("(\\d+:\\d+)(.*)", "$1");
	}
	else
	{
		duration = "23:59:59";
	}
	return duration;
}

private static String transformTimings(String time) {
	// TODO Auto-generated method stub
	if(time.isEmpty())
	{
		return "23:59:59";//String indicating error
	}
	else
	{
		String timePart = time.replaceAll("(\\d+:\\d+)( [A|P]M)", "$1");
		String periodPart = time.replaceAll("(\\d+:\\d+ )([A|P]M)", "$2");
		
		if(periodPart.equals("PM"))
		{
			timePart = (Integer.parseInt(timePart.replaceAll("(\\d+)(:\\d+)", "$1"))+12)+timePart.replaceAll("(\\d+)(:\\d+)", "$2");
		}
		return timePart;
	}
}

}
