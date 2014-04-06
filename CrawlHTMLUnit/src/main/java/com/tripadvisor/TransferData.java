package com.tripadvisor;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.StringTokenizer;



public class TransferData {

	public static void main(String args[]) throws Exception{
		//Declarations
		Boolean cityExists = false, placeExists = false, numExists = false, addNum = false;
		Connection conn=ConnectMysql.MySqlConnection();

		Statement statement = conn.createStatement();
		
		//Assuming the following data coming from crawling
		String source="TripAdvisor"; //one of TripAdvisor or Ixigo
		String city = "Bangalore";
		String state = "Karnataka";
		String country = "India";
		String name="Bull Temple";
		String address= "Bugle Hill, Bull Temple Rd, Basavangudi, Bangalore, India";
		String pincode = "120021";
		String phone = "unknown";
		String ranktext= "Ranked #24 of 181 attractions in Bangalore";
		String rating= "4.0";
		String numofreviews= "133";
		Boolean isTravellersChoice=false;
		Boolean isCoE = false;
		String type = "Architectural Buildings, Religious Sites";
		String durValue = "1";
		String Fee= "No";
		String description= "Located in Basavanagudi, this temple (built by Kempegowda in the Dravidian style) contains a huge granite monolith of Nandi. The temple grounds also host the annual groundnut fair in November/December. The nearby Dodda Ganesha Temple and Bugle Rock Garden also can be visited.";
		String photolink= "http://media-cdn.tripadvisor.com/media/photo-s/01/1f/a2/0b/bangalore.jpg";
		int CityID=-1;

		//Inserting the City
		//Checking if the City Exists in DB
		ResultSet getCityR = statement.executeQuery("SELECT * FROM City WHERE CityName='"+city+"';");
		while(getCityR.next())
		{
			if((state.equals(getCityR.getString("State"))) && (country.equals(getCityR.getString("Country"))))
			{
				//The same name city in same state and country exists
				cityExists = true;
				CityID = getCityR.getInt("CityID");
				if(getCityR.getInt(source)==1)
				{
					//Nothing to Merge as only state and country are available in TripAdvisor
					/*
					 * Merge Logic For Crawl from Same Source Present Here
					 * Then Update the tuple
					 */
				}
				else
				{
					statement.executeUpdate("UPDATE City SET TripAdvisor = 1 WHERE CityID = "+CityID+";");
					break;
				}
				//Merge the info already present
				
			}
			
		}
		if(!cityExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country,TripAdvisor) VALUES('"+city+"','"+state+"','"+country+"',1);",Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    CityID = rs.getInt(1);
		}
		
		
		//Inserting the Place
		//Checking if the Place Exists in DB
		ResultSet getPlaceR = statement.executeQuery("SELECT * FROM Places WHERE Name='"+name+"';");
		while(getPlaceR.next())
		{
			if(CityID==getPlaceR.getInt("CityID"))
			{
				//The same name place in same city exists
				placeExists = true;
				if(getPlaceR.getInt(source)==1)
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
					
					String update = "UPDATE Places SET TripAdvisor = 1";
					
					//Appending the type to the existing type
					type = getPlaceR.getString("Type") +","+ type;
					
					//Adding new address if old address doesn't contain digits
					String addressOld = getPlaceR.getString("Address");
					if(!addressOld.matches(".*\\d.*"))
					{
						if(address.matches(".*\\d.*"))
						{
							update = update + ", Address = "+address;
						}
					}
					
					//Adding Pincode if null
					if(getPlaceR.getString("Pincode").isEmpty())
					{
						update = update +", Pincode = "+pincode;
					}
					
					//Adding Phone Number if not same					 
					String phoneOld = getPlaceR.getString("PhoneNo");
					String phoneNum = phoneOld;
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
					if(addNum)
					{
						update = update + ", PhoneNo = "+ phoneNum;
					}
					
					
					String descOld = getPlaceR.getString("Description");
					description = descOld + ":" + description;
					update = update + ", Description = "+ description;
					
					double scoreOld = getPlaceR.getDouble("Score");
					int scorenum = getPlaceR.getInt("Score");
					if(scorenum!=0)
					{
						//score = (Integer.parseInt(rating)+ratingOld)/2;
					}
					
					
					
					statement.executeUpdate("UPDATE City SET TripAdvisor = 1 WHERE CityID = "+getCityR.getString("CityID")+";");
					break;
					
				}
				//Merge the info already present
				
			}
			
		}
		if(!placeExists)
		{
			//Insert the data
			statement.executeUpdate("INSERT INTO City(CityName,State,Country,TripAdvisor) VALUES('"+city+"','"+state+"','"+country+"',1);");
		}
		
		
		/*
		String query = "SELECT * FROM Places;";
	
		ResultSet result = statement.executeQuery(query);
		if(result.next())
		{
			System.out.println(result.getString("Name"));
		}
		ResultSetMetaData meta = result.getMetaData();
		System.out.println(meta.getColumnCount());
		//System.out.println(result.getString("Name"));
		//System.out.println(result.last());;
		System.out.println(result.getRow());
		*/
	
	
	}			
			
}
