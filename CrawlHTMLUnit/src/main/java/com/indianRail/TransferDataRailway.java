package com.indianRail;

import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;

import GlobalClasses.ConnectMysql;

import com.dataTransferObject.IndianRailwayDto;

public class TransferDataRailway {

	public static void transferData(IndianRailwayDto indianRailwayDto)throws Exception
	{		
		//Connection conn=ConnectMysql.MySqlConnection();
		//Statement statement = conn.createStatement();
		System.out.println("Getting the details from object");
		//Get the data from the data transfer object
		String name=indianRailwayDto.getName();
		int trainNo=indianRailwayDto.getTrainNo();
		String days=indianRailwayDto.getDays();
		int pantry=indianRailwayDto.getPantry();
		ArrayList<arrayListObject> stationDetails=indianRailwayDto.getStationsDetails();
		
		System.out.println("name "+name);
		System.out.println("trainNo "+trainNo);
		System.out.println("days "+days);
		System.out.println("pantry "+pantry);
		for(int i=0;i<stationDetails.size();i++)
		{
			System.out.println("stationName "+stationDetails.get(i).getStationName());
			System.out.println("stationCode "+stationDetails.get(i).getStationCode());
			System.out.println("ArrTime "+stationDetails.get(i).getArrTime());
			System.out.println("DeptTime "+stationDetails.get(i).getDeptTime());
			System.out.println("Dist "+stationDetails.get(i).getDistTravelled());
			System.out.println("day "+stationDetails.get(i).getDay());
			System.out.println("route "+stationDetails.get(i).getRoute());
		}
		
		
		
		
		
		
		
	}
	
}
