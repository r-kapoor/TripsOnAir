package com.bookingdotcom;

import java.net.URL;
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

public class TransferDataBookingdotcom {

	public static void transferData(BookingdotComDto bookingdotcomDto) throws Exception{
		
		//Declarations
		Boolean cityExists = false, hotelExists = false;
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();

		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		String source = bookingdotcomDto.getSource();
		String city = bookingdotcomDto.getCity().replaceAll("'", "''");
		String country = bookingdotcomDto.getCountry().replaceAll("'", "''");
		String name = bookingdotcomDto.getName().replaceAll("'", "''");
		String address = bookingdotcomDto.getAddress().replaceAll("'", "''");
		String pincode = bookingdotcomDto.getPincode();
		String rating = bookingdotcomDto.getRating();
		String numofreviews = bookingdotcomDto.getNumofreviews();
		String description = bookingdotcomDto.getDescription().replaceAll("'", "''"); 
		String checkin = bookingdotcomDto.getCheckIn();
		String checkout = bookingdotcomDto.getCheckOut();
		ArrayList<URL> photolinks = bookingdotcomDto.getPhotoLink();
		
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
		
		//Transforming the CheckIn and CheckOut
		if(!checkin.isEmpty())
		{
			if(checkin.matches("From \\d+:\\d+ hours"))
			{
				checkin = checkin.replaceAll("(From )(\\d+:\\d+)( hours)", "$2");
			}
			else
			{
				checkin = "";
			}
		}
		if(!checkout.isEmpty())
		{
			if(checkout.matches("Until \\d+:\\d+ hours"))
			{
				checkout = checkout.replaceAll("(Until )(\\d+:\\d+)( hours)", "$2");
			}
			else
			{
				checkout = "";
			}
		}
		//Inserting the Hotel
		//Checking if the Hotel Exists in DB
		ResultSet getHotelR = statement.executeQuery("SELECT * FROM Hotels WHERE Name='"+name+"';");
		while(getHotelR.next())
		{
			if(CityID==getHotelR.getInt("CityID"))
			{
				HotelID=getHotelR.getInt("HotelID");
				//The same name hotel in same city exists
				hotelExists = true;
				if(getHotelR.getInt(source)==1)
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
					String update = "UPDATE Hotels SET Bookingdotcom = 1";
					
					//Adding new address if old address doesn't contain digits
					String addressOld = getHotelR.getString("Address");
					if(addressOld==null)
					{
						update = update + ", Address = '"+address+"'";
					}
					else if(!addressOld.matches(".*\\d.*"))
					{
						if(address.matches(".*\\d.*"))
						{
							update = update + ", Address = '"+address+"'";
						}
					}
					
					//Adding pincode if not present
					String pincodeOld = getHotelR.getString("Pincode");
					if(pincodeOld==null)
					{
						update = update + ", Pincode = '"+pincode+"'";
					}
					
					//Taking mean of the ratings
					double ratingOld = getHotelR.getInt("Rating");
					if(ratingOld!=-1)
					{
						double ratingD = Double.parseDouble(rating);
						ratingD =(ratingD+ratingOld)/2;
						update = update + ", Rating = "+ratingD;
					}
					
					//Appending the description separated by $
					String descOld = getHotelR.getString("Description");
					if(descOld!=null)
					{
						if(!descOld.contains(description))
						{
							description = descOld + "$" + description;
							update = update + ", Description = '"+ description+"'";
						}
					}
					else
					{
						update = update + ", Description = '"+ description+"'";
					}
					
					//Updating the NumOfVotes
					int numofreviewsOld = getHotelR.getInt("NumOfReviews");
					if(!numofreviews.isEmpty())
					{
						int reviews = Integer.parseInt(numofreviews);
						if(reviews!=numofreviewsOld)
						{
							update = update + ", NumOfReviews ="+reviews;
						}
								
					}
					
					//Setting CheckIn/Checkout if not exists
					String checkinOld = getHotelR.getString("CheckIn");
					if(checkinOld==null&&!checkin.isEmpty())
					{
						update = update + ", CheckIn = '" + checkin +"'";
					}
					String checkoutOld = getHotelR.getString("CheckOut");
					if(checkoutOld==null&&!checkout.isEmpty())
					{
						update = update + ", CheckOut = '" + checkout +"'";
					}
					
					//System.out.println(update +" WHERE HotelID = "+HotelID+";");
					statement.executeUpdate(update +" WHERE HotelID = "+HotelID+";");
					break;
					
				}
				
				
			}
			
		}
		if(!hotelExists)
		{
			//Insert the data
			String insert= "INSERT INTO Hotels(";
			String values= ") VALUES(";
			insert = insert + "Name, CityID, Bookingdotcom";
			values = values + "'"+name+"', "+CityID+", 1";
			
			if(!address.isEmpty())
			{
				insert = insert + ", Address";
				values = values + ", '"+address+"'";
			}
			
			if(!pincode.isEmpty())
			{
				insert = insert + ", Pincode";
				values = values + ", '"+pincode+"'";
			}
			
			if(!rating.isEmpty())
			{
				if(rating.matches("\\d+\\.\\d+")||rating.matches("\\d+"))
				{
					insert = insert + ", Rating";
					values = values + ", "+rating;
				}
				else
				{
					insert = insert + ", Rating";
					values = values + ", -1";
				}
			}
			
			if(!numofreviews.isEmpty())
			{
				insert = insert + ", NumOfReviews";
				values = values + ", "+ numofreviews;
			}
			
			if(!description.isEmpty())
			{
				insert = insert + ", Description";
				values = values + ", '"+ description +"'";
			}
			
			if(!checkin.isEmpty())
			{
				insert = insert + ", CheckIn";
				values = values + ", '"+ checkin +"'";
			}
			
			if(!checkout.isEmpty())
			{
				insert = insert + ", CheckOut";
				values = values + ", '"+ checkout +"'";
			}
			//System.out.println(insert + values+");");
			statement.executeUpdate(insert + values+");");
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    HotelID = rs.getInt(1);
		}
		
		System.out.println("Hotel Inserted");
		
		//Insert the Image URLs
		if(!photolinks.isEmpty())
		{
			Iterator<URL> photolinksI = photolinks.iterator();
			URL photolink;
			while(photolinksI.hasNext())
			{
				photolink = photolinksI.next();
				ResultSet imgRS = statement.executeQuery("SELECT * FROM Hotel_Image WHERE ImgURL='"+photolink+"';");
				if(!imgRS.next())
				{
					statement.executeUpdate("INSERT INTO Hotel_Image(HotelID, ImgURL) VALUES("+HotelID+",'"+photolink+"');");
				}
			}
		}
		
		System.out.println("Image URLs Inserted");
		
		System.out.println("Insertions Complete");	
	
	}	
			
}
