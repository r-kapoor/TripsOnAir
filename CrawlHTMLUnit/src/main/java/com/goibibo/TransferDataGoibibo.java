/**
 * 
 */
package com.goibibo;
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
 * 
 * @author rahul
 * Send the data to the database
 *
 */

public class TransferDataGoibibo {

	public static void transferData(GoibiboDto goibiboDto, Statement statement) throws Exception{
		
		//Declarations
		Boolean originCityExists = false, destinationExists = false, flightExists = false;

		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		String source = goibiboDto.getSource();
		String departuretime = goibiboDto.getDepartureTime();
		String departuredate = goibiboDto.getDepartureDate();
		String origin = goibiboDto.getOrigin().replaceAll("'", "''");
		String origincountry = goibiboDto.getOrigincountry();
		String duration = goibiboDto.getDuration();
		String stops = goibiboDto.getStops();
		String arrivaltime = goibiboDto.getArrivalTime();
		String destination = goibiboDto.getDestination().replaceAll("'", "''");
		String destinationcountry = goibiboDto.getDestinationcountry();
		String airline = goibiboDto.getAirline().replaceAll("'", "''");
		String flightnumber = goibiboDto.getFlightNumber();
		String price = goibiboDto.getPrice();
		String classofTravel = goibiboDto.getClassofTravel();
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
		
		//Transforming the Arrival Time
		if(arrivaltime.contains("Next Day"))
		{
			nextday = 1;
			arrivaltime = arrivaltime.replaceAll("(\\d+:\\d+) Next Day", "$1");
		}
		
		int OriginCityID=-1, DestinationID=-1, FlightID=-1;

		System.out.println("Inserting to DB");
		
		//Getting the OriginCityID & DestinationID and if not exists then inserting the City
		
		//Checking if the Origin City Exists in DB
		ResultSet getCityR = statement.executeQuery("SELECT * FROM City WHERE CityName='"+origin+"';");
		while(getCityR.next())
		{
			if(origincountry.equals(getCityR.getString("Country")))
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
		}
		if(!originCityExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country) VALUES('"+origin+"','TEMP','"+origincountry+"');",Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    OriginCityID = rs.getInt(1);
		}
		
		//Checking if the Destination City Exists in DB
		getCityR = statement.executeQuery("SELECT * FROM City WHERE CityName='"+destination+"';");
		while(getCityR.next())
		{
			if(destinationcountry.equals(getCityR.getString("Country")))
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
		}
		if(!destinationExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country) VALUES('"+origin+"','TEMP','"+origincountry+"');",Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    DestinationID = rs.getInt(1);
		}
		
		System.out.println("City Inserted");
		
		//Inserting the Flight
		//Checking if the Flight Exists in DB
		ResultSet getFlightR = statement.executeQuery("SELECT * FROM Flight WHERE OriginCityID="+OriginCityID+
				" AND DestinationID = "+DestinationID+
				" AND DepartureDate = '"+departuredate+"'"+
				" AND DepartureTime = '"+departuretime+"'"+
				" AND ArrivalTime = '"+arrivaltime+"';");
		while(getFlightR.next())
		{
			FlightID=getFlightR.getInt("FlightID");
			//The same name restaurant in same city exists
			flightExists = true;
			if(getFlightR.getInt(source)==1)
			{
				/*
				 * Merge Logic For Crawl from Same Source Present Here
				 * Then Update the tuple
				 */
				//Updating the price of the flight
				int priceOld = getFlightR.getInt("Price");
				if(priceOld!=priceRs)
				{
					String update = "UPDATE Flight SET Price = "+priceRs+" WHERE FlightID = "+FlightID+";";
					statement.executeUpdate(update);
					break;
				}
			}
			else
			{
				//The tuple is from a different source. Merge the data
				String update = "UPDATE Flight SET Goibibo = 1";
				
				//Updating the price
				int priceOld = getFlightR.getInt("Price");
				if(priceOld!=priceRs)
				{
					update = update +", Price = "+priceRs;
				}
				
				//System.out.println(update +" WHERE RestaurantID = "+RestaurantID+";");
				statement.executeUpdate(update +" WHERE FlightID = "+FlightID+";");
				break;
			}
			
		}
		if(!flightExists)
		{
			//Insert the data
			String insert= "INSERT INTO Flight(";
			String values= ") VALUES(";
			insert = insert + "OriginCityID, DestinationID, ClassofTravel, Price, Goibibo";
			values = values + OriginCityID+", "+DestinationID+", '"+classofTravel+"', "+priceRs+", 1";
			
			//Inserting Departure Date
			insert = insert + ", DepartureDate";
			if(departuredate.matches("\\d+-\\d+-\\d+"))
			{
				values = values + ", '"+departuredate+"'";
			}
			else
			{
				values = values + ", '1000-01-01'";	
			}
			
			//Inserting Departure Time
			insert = insert + ", DepartureTime";
			if(departuretime.matches("\\d+:\\d+"))
			{
				values = values + ", '"+departuretime+"'";				
			}
			else
			{
				values = values + ", '23:59:59'";
			}
			
			//Inserting whether flight lands next day
			if(nextday == 1)
			{
				insert = insert + ", NextDay";
				values = values + ", 1";
			}
			
			//Inserting Arrival Time
			insert = insert + ", ArrivalTime";
			if(arrivaltime.matches("\\d+:\\d+"))
			{
				values = values + ", '"+arrivaltime+"'";				
			}
			else
			{
				values = values + ", '23:59:59'";
			}
			
			//Inserting stop/hop information
			if(!stops.isEmpty())
			{
				if(!stops.equals("Nonstop"))
				{
					if(stops.contains("stop"))
					{
						int stopnum = Integer.parseInt(stops.replaceAll("[^0-9]",""));
						insert = insert + ", Stops";
						values = values + ", "+stopnum;
					}
					else if(stops.contains("hop"))
					{
						int hopnum = Integer.parseInt(stops.replaceAll("[^0-9]",""));
						insert = insert + ", Hops";
						values = values + ", "+hopnum;
					}
				}
			}
			
			//System.out.println(insert + values+");");
			statement.executeUpdate(insert + values+");");
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    FlightID = rs.getInt(1);
		}
		
		System.out.println("Flight Inserted");
		
		//Insert the Flight Details
		ResultSet flightRS = statement.executeQuery("SELECT * FROM Flight_Number WHERE FlightID="+FlightID+";");
		if(!flightRS.next())
		{
			ResultSet flightDetailsRS = statement.executeQuery("SELECT * FROM Flight_Details WHERE FlightNumber='"+flightnumber+"';");
			if(flightDetailsRS.next())
			{
				int FlightNumberID = flightDetailsRS.getInt("FlightNumberID");
				statement.executeUpdate("INSERT INTO Flight_Number(FlightID, FlightNumberID) VALUES("+FlightID+", "+FlightNumberID+");");
			}
			else
			{
				statement.executeUpdate("INSERT INTO Flight_Details(Airline, FlightNumber) VALUES('"+airline+"', '"+flightnumber+"');", Statement.RETURN_GENERATED_KEYS);
				ResultSet rs = statement.getGeneratedKeys();
				rs.next();
				int FlightNumberID = rs.getInt(1);
				statement.executeUpdate("INSERT INTO Flight_Number(FlightID, FlightNumberID) VALUES("+FlightID+", "+FlightNumberID+");");
			}
		}
		System.out.println("Airline Inserted");
		
		System.out.println("Insertions Complete");	
	
	}	
			
}
