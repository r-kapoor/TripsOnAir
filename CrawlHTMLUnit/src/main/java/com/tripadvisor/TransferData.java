package com.tripadvisor;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;



public class TransferData {

	public static void main(String args[]) throws Exception{
		//Declarations
		Boolean cityExists = false, placeExists = false;
		Connection conn=ConnectMysql.MySqlConnection();

		Statement statement = conn.createStatement();
		
		//Assuming the following data coming from crawling
		String source="TripAdvisor"; //one of TripAdvisor or Ixigo
		String city = "Bangalore";
		String state = "Karnataka";
		String country = "India";
		String name="Bull Temple";
		String address= "Bugle Hill, Bull Temple Rd, Basavangudi, Bangalore, India";
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
		String CityID="";

		//Inserting the City
		//Checking if the City Exists in DB
		ResultSet getCityR = statement.executeQuery("SELECT * FROM City WHERE CityName='"+city+"';");
		while(getCityR.next())
		{
			if((state.equals(getCityR.getString("State"))) && (country.equals(getCityR.getString("Country"))))
			{
				//The same name city in same state and country exists
				cityExists = true;
				CityID = getCityR.getString("CityID");
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
			statement.executeUpdate("INSERT INTO City(CityName,State,Country,TripAdvisor) VALUES('"+city+"','"+state+"','"+country+"',1);");
		}
		
		
		//Inserting the Place
		//Checking if the Place Exists in DB
		ResultSet getPlaceR = statement.executeQuery("SELECT * FROM Places WHERE Name='"+name+"';");
		while(getPlaceR.next())
		{
			if(CityID.equals(getPlaceR.getString("CityID")))
			{
				//The same name place in same city exists
				placeExists = true;
				if(getPlaceR.getInt(source)==1)
				{
					/*
					 * Merge Logic For Crawl from Same Source Present Here
					 * Then Update the tuple
					 */
					
				}
				else
				{
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
