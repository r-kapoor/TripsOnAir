package com.zomato;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.StringTokenizer;

import GlobalClasses.ConnectMysql;

public class test {

	public static void main(String[] args) throws SQLException, ClassNotFoundException {
		// TODO Auto-generated method stub
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();
		
		int RestaurantID = 2;
		String openinghrs = "9 AM to 11:30 PM (Mon-Thu, Sun), Saturday Closed";
		/*
		StringTokenizer st = new StringTokenizer(openinghrs, ",");
		openinghrs = "";
		while(st.hasMoreTokens())
		{
			String token = st.nextToken();
			System.out.println(token);
			if(token.endsWith(")"))
			{
				continue;
			}
		}
		*/
		
		if(!openinghrs.isEmpty())
		{
			TransformTimings tt = new TransformTimings();
			tt.transform(openinghrs);
			ResultSet durRS = statement.executeQuery("SELECT * FROM Restaurant_Timings where RestaurantID="+RestaurantID+";");
			if(!durRS.next())
			{
				for(int i=0;i<tt.getNumber();i++)
				{
					System.out.println("i:"+i+" num:"+tt.getNumber());
					System.out.println("INSERT INTO Restaurant_Timings(RestaurantID, TimeStart, TimeEnd, Days) VALUES("+RestaurantID+",'"+tt.getTimeStart(i)+"','"+tt.getTimeEnd(i)+"','"+tt.getDays(i)+"');");
					statement.executeUpdate("INSERT INTO Restaurant_Timings(RestaurantID, TimeStart, TimeEnd, Days) VALUES("+RestaurantID+",'"+tt.getTimeStart(i)+"','"+tt.getTimeEnd(i)+"','"+tt.getDays(i)+"');");
				}
			}
		}
	}

}
