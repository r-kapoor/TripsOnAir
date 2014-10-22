package com.indianRail;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import com.dataTransferObject.IndianRailwayDto;
import com.hibernate.RailwayTimetable;

public class TransferDataRailway {

	/*public static void transferData(IndianRailwayDto indianRailwayDto)throws Exception
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
		
	}*/

			
	public static void transferData(IndianRailwayDto indianRailwayDto)throws Exception
		{		
			SessionFactory sessionFactory;
	        try {
	    	    Configuration conf = new Configuration();
	    	    //conf.addClass(RailwayStation.class);
	    	    conf.addResource("com/hibernate/RailwayTimetable.hbm.xml");
	    	    sessionFactory = conf.configure("com/hibernate/hibernate.cfg.xml").buildSessionFactory();
	        } catch (Throwable ex) {
	            System.err.println("SessionFactory creation failed" + ex);
	            throw new ExceptionInInitializerError(ex);
	        }

		Session session = null;
		Transaction tr = null;
		
		RailwayStation rstation = new RailwayStation();
		//rstation.setStationCode("test");
		//rstation.setStationName("Lucknow");
		
		RailwayTimetable rtimetable= new RailwayTimetable();
		rtimetable.setTrainNo("12456");
		//rtimetable.setArrivalTime("12:30");
		//rtimetable.setDay("");
		
		session = sessionFactory.openSession();

		// create a transaction

		tr = session.beginTransaction();

		// save using the session

		session.save(rstation);

		session.flush();

		tr.commit();
		}	
	

		public static void main(String[] args) {

	}
}
