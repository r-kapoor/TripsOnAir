package com.zomato;

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

public class TransferDataZomato {

	public static void transferData(ZomatoDto zomatoDto) throws Exception{
		
		//Declarations
		Boolean cityExists = false, restaurantExists = false, numExists = false, addNum = false;
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();

		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		String source = zomatoDto.getSource();
		String city = zomatoDto.getCity().replaceAll("'", "''");
		String country = zomatoDto.getCountry().replaceAll("'", "''");
		String locality = zomatoDto.getLocality().replaceAll("'", "''");
		String name = zomatoDto.getName().replaceAll("'", "''");
		String address = zomatoDto.getAddress().replaceAll("'", "''");
		String phone = zomatoDto.getPhone();
		String rating = zomatoDto.getRating();
		String numofvotes = zomatoDto.getNumofvotes();
		String homedelivery = zomatoDto.getHomeDelivery();
		String dinein = zomatoDto.getDineIn();
		String nonveg = zomatoDto.getNonveg();
		String ac = zomatoDto.getAc();
		String bar = zomatoDto.getBar();
		int cost = zomatoDto.getCost();
		String openinghrs = zomatoDto.getOpeninghrs();
		String cuisines = zomatoDto.getCuisines();
		ArrayList<URL> photolinks = zomatoDto.getPhotolink();
		
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
				if(getCityR.getInt(source)==1)
				{
					//Nothing to Merge
					/*
					 * Merge Logic For Crawl from Same Source Present Here
					 * Then Update the tuple
					 */
				}
				//Merge the info already present
			}
		}
		if(!cityExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country) VALUES('"+city+"','TEMP','"+country+");",Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    CityID = rs.getInt(1);
		}
		System.out.println("City Inserted");
		
		//Inserting the Place
		//Checking if the Place Exists in DB
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
					
					//Appending the cuisines to the existing cuisines
					String cuisinesOld = getRestaurantR.getString("Cuisines");
					String cuisinesNew = cuisinesOld;
					if(!cuisines.isEmpty())
					{
						if(cuisinesOld != null)
						{
							StringTokenizer cuisinesOldt = new StringTokenizer(cuisinesOld, ",");
							StringTokenizer cuisinest = new StringTokenizer(cuisines, ",");
							while(cuisinest.hasMoreTokens())
							{
								String cuisinesS = cuisinest.nextToken().trim();
								while(cuisinesOldt.hasMoreTokens())
								{
									String cuisinesOS = cuisinest.nextToken().trim();
									if(!cuisinesS.equals(cuisinesOS))
									{
										cuisinesNew = cuisinesNew + cuisinesS;
									}
								}
							}
						}
						update = update + ", Cuisines = '"+cuisinesNew+"'";
					}
					
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
					
					//Adding Phone Number if not same					 
					String phoneOld = getRestaurantR.getString("PhoneNo");
					String phoneNum = phoneOld;
					if(phoneOld==null&&!phone.isEmpty())
					{
						addNum = true;
						phoneNum = phone;
					}
					else if(phoneOld!=null)
					{
						StringTokenizer stOld=new StringTokenizer(phoneOld, ",");
						StringTokenizer stNew=new StringTokenizer(phone, ",");
						while(stNew.hasMoreTokens())
						{
							String numNew = stNew.nextToken();
							while(stOld.hasMoreTokens())
							{
								if(numNew.equals(stOld.nextToken()))
								{
									numExists = true;
								}
							}
							if(!numExists)
							{
								phoneNum = phoneNum + "," + numNew;
								addNum = true;
							}
							numExists = false;
						}
					}
					if(addNum)
					{
						update = update + ", PhoneNo = '"+ phoneNum+"'";
					}
					
					//Setting cost for two if not exists
					String costOld = getRestaurantR.getString("CostForTwo");
					if(costOld==null&&cost!=-1)
					{
						update = update + ", CostForTwo = "+ cost;
					}
					
					//Setting Locality if not exists
					String localityOld = getRestaurantR.getString("Locality");
					if(localityOld==null&&!locality.isEmpty())
					{
						update = update + ", Locality = '" + locality +"'";
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
					
					//Setting nonveg if not exists
					String nonvegOld = getRestaurantR.getString("NonVeg");
					if(nonvegOld==null&&!nonveg.isEmpty())
					{
						if(nonveg.equals("yes"))
						{
							update = update + ", NonVeg = "+ 1;
						}
						else if(nonveg.equals("no"))
						{
							update = update + ", NonVeg = "+ 0;
						}
					}
					
					//Setting home delivery if not exists
					String homedeliveryOld = getRestaurantR.getString("HomeDelivery");
					if(homedeliveryOld==null&&!homedelivery.isEmpty())
					{
						if(homedelivery.equals("yes"))
						{
							update = update + ", HomeDelivery = "+ 1;
						}
						else if(homedelivery.equals("no"))
						{
							update = update + ", HomeDelivery = "+ 0;
						}
					}
					
					//Setting dine-in if not exists
					String dineinOld = getRestaurantR.getString("DineIn");
					if(dineinOld==null&&!dinein.isEmpty())
					{
						if(dinein.equals("yes"))
						{
							update = update + ", DineIn = "+ 1;
						}
						else if(dinein.equals("no"))
						{
							update = update + ", DineIn = "+ 0;
						}
					}
					
					//Setting nonveg if not exists
					String acOld = getRestaurantR.getString("AC");
					if(acOld==null&&!ac.isEmpty())
					{
						if(ac.equals("yes"))
						{
							update = update + ", AC = "+ 1;
						}
						else if(ac.equals("no"))
						{
							update = update + ", AC = "+ 0;
						}
					}
					
					//Setting bar if not exists
					String barOld = getRestaurantR.getString("Bar");
					if(barOld==null&&!bar.isEmpty())
					{
						if(bar.equals("yes"))
						{
							update = update + ", Bar = "+ 1;
						}
						else if(bar.equals("no"))
						{
							update = update + ", Bar = "+ 0;
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
			
			if(!cuisines.isEmpty())
			{
				insert = insert + ", Cuisines";
				values = values + ", '"+cuisines+"'";
			}
			
			if(!address.isEmpty())
			{
				insert = insert + ", Address";
				values = values + ", '"+address+"'";
			}
			
			if(!phone.isEmpty())
			{
				insert = insert + ", PhoneNo";
				values = values + ", '"+phone+"'";
			}
			
			if(cost!=-1)
			{
				insert = insert + ", CostForTwo";
				values = values + ", "+cost;
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
			
			if(!locality.isEmpty())
			{
				insert = insert + ", Locality";
				values = values + ", '"+ locality +"'";
			}
			
			if(!numofvotes.isEmpty())
			{
				insert = insert + ", NumOfVotes";
				values = values + ", "+ numofvotes;
			}
			
			if(!nonveg.isEmpty())
			{
				insert = insert + ", NonVeg";
				if(nonveg.equals("yes"))
				{
					values = values + ", "+1;
				}
				else if(nonveg.equals("no"))
				{
					values = values + ", "+0;
				}
			}
			
			if(!homedelivery.isEmpty())
			{
				insert = insert + ", HomeDelivery";
				if(homedelivery.equals("yes"))
				{
					values = values + ", "+1;
				}
				else if(homedelivery.equals("no"))
				{
					values = values + ", "+0;
				}
			}
			
			if(!dinein.isEmpty())
			{
				insert = insert + ", DineIn";
				if(dinein.equals("yes"))
				{
					values = values + ", "+1;
				}
				else if(dinein.equals("no"))
				{
					values = values + ", "+0;
				}
			}
			
			if(!ac.isEmpty())
			{
				insert = insert + ", AC";
				if(ac.equals("yes"))
				{
					values = values + ", "+1;
				}
				else if(ac.equals("no"))
				{
					values = values + ", "+0;
				}
			}
			
			if(!bar.isEmpty())
			{
				insert = insert + ", Bar";
				if(bar.equals("yes"))
				{
					values = values + ", "+1;
				}
				else if(bar.equals("no"))
				{
					values = values + ", "+0;
				}
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
		
		//Inserting the restaurant timings
		if(!openinghrs.isEmpty())
		{
			TransformTimings tt = new TransformTimings();
			tt.transform(openinghrs);
			ResultSet durRS = statement.executeQuery("SELECT * FROM Restaurant_Timings where RestaurantID="+RestaurantID+";");
			if(!durRS.next())
			{
				statement.executeUpdate("INSERT INTO Restaurant_Timings(RestaurantID, TimeStart, TimeEnd, Days) VALUES("+RestaurantID+",'"+tt.getTimeStart()+"','"+tt.getTimeEnd()+"','"+tt.getDays()+"');");
			}
		}
		
		
		System.out.println("Durations Inserted");
		
		System.out.println("Insertions Complete");	
	
	}	
			
}
