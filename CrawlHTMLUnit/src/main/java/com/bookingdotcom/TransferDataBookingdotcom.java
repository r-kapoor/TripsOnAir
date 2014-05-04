package com.bookingdotcom;

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

public class TransferDataBookingdotcom {

	public static void transferData(BookingdotComDto bookingdotcomDto) throws Exception{
		
		//Declarations
		Boolean cityExists = false, restaurantExists = false, numExists = false, addNum = false;
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();

		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		String source = bookingdotcomDto.getSource();
		String city = bookingdotcomDto.getCity().replaceAll("'", "''");
		String country = bookingdotcomDto.getCountry().replaceAll("'", "''");
		String name = bookingdotcomDto.getName().replaceAll("'", "''");
		String address = bookingdotcomDto.getAddress().replaceAll("'", "''");
		String rating = bookingdotcomDto.getRating();
		String numofvotes = bookingdotcomDto.getNumofreviews();
		ArrayList<URL> photolinks = bookingdotcomDto.getPhotoLink();
		
		int CityID=-1, RestaurantID=-1;

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
		
		//Inserting the Hotel
		//Checking if the Hotel Exists in DB
		ResultSet getRestaurantR = statement.executeQuery("SELECT * FROM Restaurants WHERE Name='"+name+"';");
		while(getRestaurantR.next())
		{
			if(CityID==getRestaurantR.getInt("CityID"))
			{
				RestaurantID=getRestaurantR.getInt("RestaurantID");
				//The same name restaurant in same city exists
				restaurantExists = true;
				if(getRestaurantR.getInt(source)==1)
				{
					/*
					 * Merge Logic For Crawl from Same Source Present Here
					 * Then Update the tuple
					 */
					//Doing nothing as the merge logic for same source not clear
				}
				else
				{
					//The tuple is from a different source. Merge the data
					String update = "UPDATE Restaurants SET Zomato = 1";
					
					//Adding new address if old address doesn't contain digits
					String addressOld = getRestaurantR.getString("Address");
					if(addressOld==null)
					{
						update = update + ", Address = "+address;
					}
					else if(!addressOld.matches(".*\\d.*"))
					{
						if(address.matches(".*\\d.*"))
						{
							update = update + ", Address = "+address;
						}
					}
					
					//Updating the NumOfVotes
					int numofvotesOld = getRestaurantR.getInt("NumOfVotes");
					if(!numofvotes.isEmpty())
					{
						int votes = Integer.parseInt(numofvotes);
						if(votes!=numofvotesOld)
						{
							update = update + ", NumOfVotes ="+votes;
						}
								
					}
					
					//System.out.println(update +" WHERE RestaurantID = "+RestaurantID+";");
					statement.executeUpdate(update +" WHERE RestaurantID = "+RestaurantID+";");
					break;
					
				}
				
				
			}
			
		}
		if(!restaurantExists)
		{
			//Insert the data
			String insert= "INSERT INTO Restaurants(";
			String values= ") VALUES(";
			insert = insert + "Name, CityID, Zomato";
			values = values + "'"+name+"', "+CityID+", 1";
			
			if(!address.isEmpty())
			{
				insert = insert + ", Address";
				values = values + ", '"+address+"'";
			}
			
			if(!rating.isEmpty())
			{
				if(rating.matches("\\d+\\.\\d+/\\d+"))
				{
					rating = rating.substring(0, rating.indexOf('/'));
				}
				insert = insert + ", Rating";
				values = values + ", "+rating;
			}
			
			if(!numofvotes.isEmpty())
			{
				insert = insert + ", NumOfVotes";
				values = values + ", "+ numofvotes;
			}
			
			//System.out.println(insert + values+");");
			statement.executeUpdate(insert + values+");");
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    RestaurantID = rs.getInt(1);
		}
		
		System.out.println("Place Inserted");
		
		//Insert the Image URLs
		if(!photolinks.isEmpty())
		{
			Iterator<URL> photolinksI = photolinks.iterator();
			URL photolink;
			while(photolinksI.hasNext())
			{
				photolink = photolinksI.next();
				ResultSet imgRS = statement.executeQuery("SELECT * FROM Restaurant_Image WHERE ImgURL='"+photolink+"';");
				if(!imgRS.next())
				{
					statement.executeUpdate("INSERT INTO Restaurant_Image(RestaurantID, ImgURL) VALUES("+RestaurantID+",'"+photolink+"');");
				}
			}
		}
		
		System.out.println("Image URLs Inserted");
		
		
		System.out.println("Durations Inserted");
		
		System.out.println("Insertions Complete");	
	
	}	
			
}
