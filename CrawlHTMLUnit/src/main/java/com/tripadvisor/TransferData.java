package com.tripadvisor;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.StringTokenizer;
import com.dataTransferObject.*;

/**
 * 
 * @author rahul
 * Send the data to the database
 *
 */

public class TransferData {

	public static void transferData(TripAdvisorDto tripAdvisorDto) throws Exception{
		
		//Declarations
		Boolean cityExists = false, placeExists = false, numExists = false, addNum = false;
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();

		System.out.println("Getting the details from object");
		
		//Get the data from the data transfer object
		String source= tripAdvisorDto.getSource(); //one of TripAdvisor or Ixigo
		String city = tripAdvisorDto.getCity();
		String state = tripAdvisorDto.getState();
		String country = tripAdvisorDto.getCountry();
		String name=tripAdvisorDto.getName();
		String address= tripAdvisorDto.getAddress();
		String pincode = tripAdvisorDto.getPincode();
		String phone = tripAdvisorDto.getPhone();
		String ranktext= tripAdvisorDto.getRanktext();
		String rating= tripAdvisorDto.getRating();
		String numofreviews= tripAdvisorDto.getNumofreviews();
		Boolean isTravellersChoice=tripAdvisorDto.getIsTravellersChoice();
		Boolean isCoE = tripAdvisorDto.getIsCoE();
		String type = tripAdvisorDto.getType();
		String durValue = tripAdvisorDto.getDurValue();
		String Fee= tripAdvisorDto.getFee();
		String description= tripAdvisorDto.getDescription();
		String photolink= tripAdvisorDto.getPhotolink();
		int CityID=-1, PlaceID=-1;

		System.out.println("Inserting to DB");
		
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
		
		System.out.println("City Inserted");
		
		//Inserting the Place
		//Checking if the Place Exists in DB
		ResultSet getPlaceR = statement.executeQuery("SELECT * FROM Places WHERE Name='"+name+"';");
		while(getPlaceR.next())
		{
			if(CityID==getPlaceR.getInt("CityID"))
			{
				PlaceID=getPlaceR.getInt("PlaceID");
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
					String typeOld = getPlaceR.getString("Type");
					String typeNew = typeOld;
					if(!type.isEmpty())
					{
						if(typeOld != null)
						{
							StringTokenizer typeOldt = new StringTokenizer(typeOld, ",");
							StringTokenizer typet = new StringTokenizer(type, ",");
							while(typet.hasMoreTokens())
							{
								String typeS = typet.nextToken().trim();
								while(typeOldt.hasMoreTokens())
								{
									String typeOS = typeOldt.nextToken();
									if(!typeS.equals(typeOS))
									{
										typeNew = typeNew + typeS;
									}
								}
							}
						}
						update = update + ", Type = '"+typeNew+"'";
					}
					//Has to be replaced with mapping to our categories
					
					//Adding new address if old address doesn't contain digits
					String addressOld = getPlaceR.getString("Address");
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
					
					//Adding Pincode if null
					if(getPlaceR.getString("Pincode")==null)
					{
						update = update +", Pincode = "+pincode;
					}
					
					//Adding Phone Number if not same					 
					String phoneOld = getPlaceR.getString("PhoneNo");
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
						update = update + ", PhoneNo = "+ phoneNum;
					}
					
					//Appending the description separated by $
					String descOld = getPlaceR.getString("Description");
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
					
					//Generating the score for the place and taking a mean with old score
					double score;
					double scoreNew = generateScore(ranktext, rating, numofreviews);
					double scoreOld = getPlaceR.getDouble("Score");
					int scorenum = getPlaceR.getInt("ScoreSources");
					if(scorenum!=0)
					{
						scorenum++;
						score = (scoreOld + scoreNew)/scorenum;
						update = update + ", ScoreSources = "+ scorenum; 
					}
					else
					{
						score = scoreNew;
					}
					update = update + ", Score = "+ score;
					
					
					
					//System.out.println(update +" WHERE PlaceID = "+PlaceID+";");
					statement.executeUpdate(update +" WHERE PlaceID = "+PlaceID+";");
					break;
					
				}
				
				
			}
			
		}
		if(!placeExists)
		{
			//Insert the data
			String insert= "INSERT INTO Places(";
			String values= ") VALUES(";
			insert = insert + "Name, CityID, TripAdvisor";
			values = values + "'"+name+"', "+CityID+", 1";
			if(!type.isEmpty())
			{
				insert = insert + ", Type";
				values = values + ", '"+type+"'";
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
			
			if(!pincode.isEmpty())
			{
				insert = insert + ", PinCode";
				values = values + ", '"+pincode+"'";
			}
			if(!description.isEmpty())
			{
				insert = insert + ", Description";
				values = values + ", '"+description+"'";
			}
			if(!ranktext.isEmpty()&&!rating.isEmpty()&&!numofreviews.isEmpty())
			{
				double scoreNew = generateScore(ranktext, rating, numofreviews);
				insert = insert + ", Score, ScoreSources";
				values = values + ", "+scoreNew+", 1";
			}
			//System.out.println(insert + values+");");
			statement.executeUpdate(insert + values+");");
		    ResultSet rs = statement.getGeneratedKeys();
		    rs.next();
		    PlaceID = rs.getInt(1);
		}
		
		System.out.println("Place Inserted");
		
		//Insert the Image URL
		if(!photolink.isEmpty())
		{
			ResultSet imgRS = statement.executeQuery("SELECT * FROM Place_Image WHERE ImgURL='"+photolink+"';");
			if(!imgRS.next())
			{
				statement.executeUpdate("INSERT INTO Place_Image(PlaceID, ImgURL) VALUES("+PlaceID+",'"+photolink+"');");
			}
		}
		
		System.out.println("Image URL Inserted");
		
		//Insert the Best Collection of Places
		if(isCoE||isTravellersChoice)
		{
			ResultSet bestRS = statement.executeQuery("SELECT * FROM BestPlaces WHERE PlaceID="+PlaceID+";");
			if(!bestRS.next())
			{
				statement.executeUpdate("INSERT INTO BestPlaces(PlaceID) VALUES("+PlaceID+");");
			}
		}
		
		System.out.println("Best Place Inserted");
		
		//Insert the place charges
		if(!Fee.isEmpty())
		{
			int fee=-1;
			if(Fee.equalsIgnoreCase("Yes"))
			{
				fee=-2;
			}
			else if(Fee.equalsIgnoreCase("No"))
			{
				fee=0;
			}
			ResultSet feeRS = statement.executeQuery("SELECT * FROM Place_Charges WHERE PlaceID="+PlaceID+";");
			if(feeRS.next())
			{
				boolean change=false;
				String update= "UPDATE Place_Charges SET ";
				if(feeRS.getInt("ChildCharge")==-1)
				{
					if(change)
					{
						update = update + ", ";
					}
					change=true;
					update = update + "ChildCharge = "+fee;
				}
				if(feeRS.getInt("AdultCharge")==-1)
				{
					if(change)
					{
						update = update + ", ";
					}
					change=true;
					update = update + "AdultCharge = "+fee;
				}
				if(feeRS.getInt("ForeignerCharge")==-1)
				{
					if(change)
					{
						update = update + ", ";
					}
					change=true;
					update = update + "ForeignerCharge = "+fee;
				}
				if(change)
				{
					statement.executeUpdate(update + " WHERE PlaceID = "+PlaceID+";");
				}
			}
			else
			{
				statement.executeUpdate("INSERT INTO Place_Charges(PlaceID, ChildCharge, AdultCharge, ForeignerCharge) VALUES("+PlaceID+", "+fee+", "+fee+", "+fee+")");
			}
		}
		
		System.out.println("Charges Inserted");
		
		//Insert the duration
		if(!durValue.isEmpty())
		{
			if(durValue.matches("\\d+"))
			{
				int dur = Integer.parseInt(durValue);
				ResultSet durRS = statement.executeQuery("SELECT * FROM Timing WHERE PlaceID="+PlaceID+";");
				if(durRS.next())
				{
					double durOld = durRS.getDouble("ExpectedDuration");
					if(durOld == -1)
					{
						statement.executeUpdate("UPDATE Timing SET ExpectedDuration = "+dur+" WHERE PlaceID = "+PlaceID+";");
					}
					else
					{
						statement.executeUpdate("UPDATE Timing SET ExpectedDuration = "+((durOld+dur)/2)+" WHERE PlaceID = "+PlaceID+";");
					}
				}
				else
				{
					statement.executeUpdate("INSERT INTO Timing(PlaceID, ExpectedDuration) VALUES("+PlaceID+", "+dur+");");
				}
			}
		}
		
		System.out.println("Durations Inserted");
		
		System.out.println("Insertions Complete");
		
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

	private static double generateScore(String ranktext, String rating,	String numofreviews) throws NumberFormatException {
		int rank=-1, totalplaces = -1, numofreviewsI = -1;
		double score1=-1, score2=-1, ratingD=-1, wt=-1, scoreNew=-1;
		//Checking if ranktext is in proper format
		if(ranktext.matches("Ranked #\\d+ of \\d+ attractions in.*"))
		{
			int pos = ranktext.indexOf('#');
			int pos1 = ranktext.indexOf(' ',pos);
			rank = Integer.parseInt(ranktext.substring(pos+1, pos1));
			
			pos=ranktext.indexOf(' ',pos1+1);
			pos1=ranktext.indexOf(' ', pos+1);
			totalplaces=Integer.parseInt(ranktext.substring(pos+1, pos1));
		}
		if(rating.matches("\\d+.*"))
		{
			ratingD = Double.parseDouble(rating);
			if(numofreviews.matches("\\d+"))
			{
				numofreviewsI = Integer.parseInt(numofreviews);  
			}
		}
		if(rank!=-1&&totalplaces!=-1)
		{
			score1=(totalplaces-rank+1)/(double)totalplaces*100;
		}
		if(ratingD!=-1 &&numofreviewsI!=-1)
		{
			score2=ratingD*20;
			wt=	Math.atan((Math.pow(numofreviewsI-250.0,3)/Math.pow(250.0,3)))*(70/Math.PI)+40;
		}
		if(score1!=-1)
		{
			if(score2!=-1&&wt!=-1)
			{
				scoreNew =(score2 * wt / 100) + (score1 * (100 - wt) / 100);
			}
			else
			{
				scoreNew = score1;
			}
		}
		return scoreNew;
	}		
			
}
