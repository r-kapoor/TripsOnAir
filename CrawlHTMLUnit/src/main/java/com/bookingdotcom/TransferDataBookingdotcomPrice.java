package com.bookingdotcom;

import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.net.URL;
import java.security.PrivilegedExceptionAction;
import java.sql.Array;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.Date;
import java.sql.NClob;
import java.sql.Ref;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.RowId;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.SQLXML;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.Map;

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
		Statement statement1 = conn.createStatement();

		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		//String source = bookingdotcompriceDto.getSource();
		String city = bookingdotcompriceDto.getCity().replaceAll("'", "''");
		String country = bookingdotcompriceDto.getCountry().replaceAll("'", "''");
		String name = bookingdotcompriceDto.getName().replaceAll("'", "''");
		ArrayList<String> roomTypeList = bookingdotcompriceDto.getRoomType();
		ArrayList<Integer> numberofSubtypesList = bookingdotcompriceDto.getNumberofSubtypes();
		ArrayList<String> priceList = bookingdotcompriceDto.getPrice();
		ArrayList<String> conditionsList = bookingdotcompriceDto.getConditions();
		ArrayList<Integer> maxCapacityList = bookingdotcompriceDto.getMaxCapacity();
		String checkinDate = bookingdotcompriceDto.getCheckinDate();
		String checkoutDate = bookingdotcompriceDto.getCheckoutDate();
		
		System.out.println(checkoutDate);
		
		
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
		System.out.println("SELECT * FROM Hotel_Rooms WHERE HotelID="+HotelID+";");
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
			//Checking whether the roomtype exists or not
			System.out.println("top:"+getHotelRoomRS.isClosed());
			while(getHotelRoomRS.next())
			{
				String roomtypeOld = getHotelRoomRS.getString("RoomType");
				if(roomtypeNew.equals(roomtypeOld))
				{
					RoomID = getHotelRoomRS.getInt("RoomID");
					roomtypeExists = true;
					break;
				}
			}
			System.out.println("top1:"+getHotelRoomRS.isClosed());
			getHotelRoomRS.beforeFirst();
			System.out.println("top2:"+getHotelRoomRS.isClosed());
			//If the roomtype doesn't exist then insert the roomtype
			if(!roomtypeExists)
			{
				//Need to insert the roomtype
				System.out.println("INSERT INTO Hotel_Rooms(HotelID, RoomType) VALUES("+HotelID+", '"+roomtypeNew+"');");
				statement1.executeUpdate("INSERT INTO Hotel_Rooms(HotelID, RoomType) VALUES("+HotelID+", '"+roomtypeNew+"');", Statement.RETURN_GENERATED_KEYS);
				ResultSet rs = statement1.getGeneratedKeys();
				RoomID = rs.getInt(1);
			}
			//RoomID contains the roomID value
			//Getting the Hotel Prices for the RoomID and dates
			System.out.println("SELECT * FROM Hotel_Prices WHERE RoomID="+RoomID+" AND CheckInDate='"+checkinDate+"' AND CheckOutDate='"+checkoutDate+"';");
			ResultSet getHotelPriceRS = statement1.executeQuery("SELECT * FROM Hotel_Prices WHERE RoomID="+RoomID+" AND CheckInDate='"+checkinDate+"' AND CheckOutDate='"+checkoutDate+"';");
			//Setting the availability as 0 for it to be updated
			System.out.println("1");
			if(getHotelPriceRS.next())
			{
				System.out.println("11");
				System.out.println("UPDATE Hotel_Prices SET Availability = "+0+" WHERE RoomID = "+RoomID+", CheckInDate = '"+checkinDate+"'AND CheckOutDate = '"+checkoutDate+"';");
				statement1.executeUpdate("UPDATE Hotel_Prices SET Availability = "+0+
						" WHERE RoomID = "+RoomID+
						", CheckInDate = '"+checkinDate+
						"' AND CheckOutDate = '"+checkoutDate+
						"';");
				System.out.println("2");
			}
			System.out.println(getHotelPriceRS.isClosed());
			getHotelPriceRS.beforeFirst();
			System.out.println(getHotelPriceRS.isClosed());
			System.out.println(numberofSubtypes);
			//Iterating through the different types for the same roomID
			for(int i=0;i<numberofSubtypes;i++)
			{
				//Getting the conditions, maxcapacity, availability and price
				System.out.println("3");
				String conditionsNew = conditionsList.get(counter+i).toUpperCase();
				int maxCapacityNew = maxCapacityList.get(counter+i);
				String priceText = priceList.get(counter+i);
				int availabilityNew = extractAvailability(priceText);
				int priceNew = extractPrice(priceText);
				boolean insertnew = true;
				System.out.println("4");
				while(getHotelPriceRS.next())
				{
					String conditionsOld = getHotelPriceRS.getString("Conditions");
					int maxCapacityOld = getHotelPriceRS.getInt("MaxCapacity");
					if(conditionsOld.equals(conditionsNew)&&maxCapacityOld==maxCapacityNew)
					{
						insertnew = false;
						int priceOld = getHotelPriceRS.getInt("Price");
						int availabilityOld = getHotelPriceRS.getInt("Availability");
						if(priceNew!=priceOld||availabilityNew!=availabilityOld)
						{
							System.out.println("UPDATE Hotel_Prices SET Price ="+priceNew+", Availability = "+availabilityNew+
									" WHERE RoomID = "+RoomID+
									", CheckInDate = '"+checkinDate+
									"', CheckOutDate = '"+checkoutDate+
									"', Conditions = '"+conditionsNew+
									"'AND MaxCapacity = "+maxCapacityNew+
									";");
							statement1.executeUpdate("UPDATE Hotel_Prices SET Price ="+priceNew+", Availability = "+availabilityNew+
									" WHERE RoomID = "+RoomID+
									", CheckInDate = '"+checkinDate+
									"', CheckOutDate = '"+checkoutDate+
									"', Conditions = '"+conditionsNew+
									"'AND MaxCapacity = "+maxCapacityNew+
									";");
						}
					}
					System.out.println("5");
				}
				getHotelPriceRS.beforeFirst();
				if(insertnew)
				{
					System.out.println("INSERT INTO Hotel_Prices(RoomID, Conditions, MaxCapacity, Availability, Price, CheckInDate, CheckOutDate) VALUES("+RoomID+", '"+conditionsNew+"', "+maxCapacityNew+", "+availabilityNew+", "+priceNew+", '"+checkinDate+"', '"+checkoutDate+"');");
					statement1.executeUpdate("INSERT INTO Hotel_Prices(RoomID, Conditions, MaxCapacity, Availability, Price, CheckInDate, CheckOutDate) VALUES("+RoomID+", '"+conditionsNew+"', "+maxCapacityNew+", "+availabilityNew+", "+priceNew+", '"+checkinDate+"', '"+checkoutDate+"');");
				}
				System.out.println("6");
			}
			System.out.println("end");
		}
		
		System.out.println("Hotel Prices Inserted");
		
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
