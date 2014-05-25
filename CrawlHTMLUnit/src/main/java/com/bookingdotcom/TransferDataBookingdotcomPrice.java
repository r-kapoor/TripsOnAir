package com.bookingdotcom;

import java.net.URL;
import java.security.PrivilegedExceptionAction;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;

import GlobalClasses.ConnectMysql;

import com.dataTransferObject.*;

/**
 * 
 * @author rahul
 * Send the data to the database
 *
 */

public class TransferDataBookingdotcomPrice {

	public static void transferData(BookingdotComPriceDto bookingdotcompriceDto) throws Exception{
		
		//Declarations
		Boolean cityExists = false, hotelExists = false;
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();

		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		String source = bookingdotcompriceDto.getSource();
		String city = bookingdotcompriceDto.getCity().replaceAll("'", "''");
		String country = bookingdotcompriceDto.getCountry().replaceAll("'", "''");
		String name = bookingdotcompriceDto.getName().replaceAll("'", "''");
		ArrayList<String> roomTypeList = bookingdotcompriceDto.getRoomType();
		ArrayList<Integer> numberofSubtypesList = bookingdotcompriceDto.getNumberofSubtypes();
		ArrayList<String> priceList = bookingdotcompriceDto.getPrice();
		ArrayList<String> conditionsList = bookingdotcompriceDto.getConditions();
		ArrayList<String> maxCapacityList = bookingdotcompriceDto.getMaxCapacity();
		String checkinDate = bookingdotcompriceDto.getCheckinDate();
		String checkoutDate = bookingdotcompriceDto.getCheckoutDate();
		
		
		int CityID=-1, HotelID=-1;

		System.out.println("Inserting to DB");
		
		//Getting the CityID and if not exists then inserting the City
		//Checking if the City Exists in DB
		ResultSet getCityR = statement.executeQuery("SELECT * FROM City WHERE CityName='"+city+"';");
		while(getCityR.next())
		{
			if(country.equals(getCityR.getString("Country")))
			{
				//The same name city in same country exists
				cityExists = true;
				CityID = getCityR.getInt("CityID");
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
		if(!cityExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country) VALUES('"+city+"','TEMP','"+country+"');",Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    CityID = rs.getInt(1);
		}
		System.out.println("City Inserted");
		
		//Inserting the Hotel Price
		//Checking if the Hotel Exists in DB
		ResultSet getHotelR = statement.executeQuery("SELECT * FROM Hotels WHERE Name='"+name+"';");
		while(getHotelR.next())
		{
			if(CityID==getHotelR.getInt("CityID"))
			{
				HotelID=getHotelR.getInt("HotelID");
				//The same name hotel in same city exists
				hotelExists = true;

			}
			
		}
		if(!hotelExists)
		{
			//Insert the data
			String insert= "INSERT INTO Hotels(";
			String values= ") VALUES(";
			insert = insert + "Name, CityID, Bookingdotcom";
			values = values + "'"+name+"', "+CityID+", 1";
			
			//System.out.println(insert + values+");");
			statement.executeUpdate(insert + values+");");
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    HotelID = rs.getInt(1);
		}
		
		System.out.println("Hotel Inserted");
		
		//Inserting the Prices
		//Checking whether the room exists or not
		boolean roomtypeExists = false;
		int RoomID = -1;
		int counter = 0;
		//Getting the hotel rooms for this Hotel
		ResultSet getHotelRoomRS = statement.executeQuery("SELECT * FROM Hotel_Rooms WHERE HotelID="+HotelID+";");
		Iterator<String> roomTypeI = roomTypeList.iterator();
		Iterator<Integer> numberofSubtypesI = numberofSubtypesList.iterator();
		//Iterating through the room types which are crawled
		while(roomTypeI.hasNext()&&numberofSubtypesI.hasNext())
		{
			String roomtypeNew = roomTypeI.next().toUpperCase();
			int numberofSubtypes = numberofSubtypesI.next();
			roomtypeExists = false;
			RoomID = -1;
			ResultSet RSCopy = getHotelRoomRS;
			//Checking whether the roomtype exists or not
			while(RSCopy.next())
			{
				String roomtypeOld = RSCopy.getString("RoomType");
				if(roomtypeNew.equals(roomtypeOld))
				{
					RoomID = RSCopy.getInt("RoomID");
					roomtypeExists = true;
					break;
				}
			}
			//If the roomtype doesn't exist then insert the roomtype
			if(!roomtypeExists)
			{
				//Need to insert the roomtype
				statement.executeUpdate("INSERT INTO Hotel_Rooms(HotelID, RoomType) VALUES("+HotelID+", '"+roomtypeNew, Statement.RETURN_GENERATED_KEYS);
				ResultSet rs = statement.getGeneratedKeys();
				RoomID = rs.getInt("RoomID");
			}
			//RoomID contains the roomID value
			//Getting the Hotel Prices for 
			ResultSet getHotelPriceRS = statement.executeQuery("SELECT * FROM Hotel_Prices WHERE RoomID="+RoomID+" AND CheckInDate='"+checkinDate+"' AND CheckOutDate='"+checkoutDate+"';");
			for(int i=0;i<numberofSubtypes;i++)
			{
				String conditionsNew = conditionsList.get(counter+i);
				String maxCapacityNew = maxCapacityList.get(counter+i);
				String priceText = priceList.get(counter+i);
				int availabilityNew = extractAvailability(priceText);
				int priceNew = extractPrice(priceText);
				ResultSet RSCopy1 = getHotelPriceRS;
				while(RSCopy1.next())
				{
					String conditionsOld = RSCopy1.getString("Conditions");
					String maxCapacityOld = RSCopy1.getString("MaxCapacity");
					if(conditionsOld.equals(conditionsNew)&&maxCapacityOld.equals(maxCapacityNew))
					{
						boolean update = false;
						int priceOld = RSCopy1.getInt("Price");
						int availabilityOld = RSCopy1.getInt("Availability");
						if(priceNew!=priceOld||availabilityNew!=availabilityOld)
						{
							update = true;
						}
					}
				}
			}
				
		}
		
		System.out.println("Insertions Complete");	
	
	}

	private static int extractPrice(String priceText) {
		// TODO Auto-generated method stub
		String price = priceText.replaceAll("(\\d+ \\(INR )(.*)\\)", "$1");
		price = price.replaceAll("[^0-9]", "");
		return Integer.parseInt(price);
	}

	private static int extractAvailability(String priceText) {
		// TODO Auto-generated method stub
		String availability = priceText.replaceAll("(\\d+)(.*)", "$1");
		return Integer.parseInt(availability);
	}	
			
}
