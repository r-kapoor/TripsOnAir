package com.indianRail;

import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.dataTransferObject.IndianRailwayDto;
import com.hibernate.RailwayTimetable;
/**
 * 
 * @author rajat
 *
 */

public class TransferDataRailway {
			
	public static void transferData(IndianRailwayDto indianRailwayDto,Session session)throws Exception
	{
		System.out.println("Begin transfer");
		Transaction tr = null;	
		ArrayList<arrayListObject> stationDetails=indianRailwayDto.getStationsDetails();

		for(int i=0;i<stationDetails.size();i++)
		{
			String stationCode=stationDetails.get(i).getStationCode();
			try{
			RailwayStation rstation = new RailwayStation();		
			RailwayStation station = 
                    (RailwayStation)session.get(RailwayStation.class, stationCode);
				if(station==null){
					rstation.setStationCode(stationCode);
					rstation.setStationName(stationDetails.get(i).getStationName());
					session.save(rstation);
				}
			}
			catch(Exception e){
				System.out.println("Exception occrrured for Railwaystation Table:"+e.getMessage()+","+e.toString());
			}
			try{
				RailwayTimetable rtimetable= new RailwayTimetable();
				System.out.println("TrainNO:"+indianRailwayDto.getTrainNo());
				rtimetable.setTrainNo(indianRailwayDto.getTrainNo());
				System.out.println("stationCode:"+stationCode);
				rtimetable.setStationCode(stationCode);
				System.out.println("DistTravell:"+stationDetails.get(i).getDistTravelled());
				rtimetable.setDistanceCovered(stationDetails.get(i).getDistTravelled());
				System.out.println("ArrTime:"+stationDetails.get(i).getArrTime());
				rtimetable.setArrivalTime(stationDetails.get(i).getArrTime());
				System.out.println("DeptTime:"+stationDetails.get(i).getDeptTime());
				rtimetable.setDepartureTime(stationDetails.get(i).getDeptTime());
				System.out.println("Day:"+stationDetails.get(i).getDay());
				rtimetable.setDay(stationDetails.get(i).getDay());
				System.out.println("Route:"+stationDetails.get(i).getRoute());
				rtimetable.setRoute(stationDetails.get(i).getRoute());
				session.save(rtimetable);
				tr = session.beginTransaction();
				session.flush();
				tr.commit();
				}catch(Exception e){
					System.out.println("Exception occrrured for RailwayTimeTable:"+e.getMessage()+","+e.toString());
				}
		}
		System.out.println("EndTransfer");
	}
	
	//Only for testing
	/*public static void main(String args[]) throws ParseException
	{
		Session session=CrawlIndianRail.getHibernateSession();
		RailwayTimetable rtimetable= new RailwayTimetable();
		RailwayStation rstation = new RailwayStation();
		int TrainNO=12723;
		int DistTravell=0;
		Time ArrTime=null;
		String DeptTime="06:25:00";
		DateFormat formatter = new SimpleDateFormat("hh:mm:ss");
		Time Dept=new java.sql.Time(formatter.parse(DeptTime).getTime());
		byte Day=1;
		byte Route=1;
		rstation.setStationCode("6578");
		rstation.setStationName("test");
		rtimetable.setArrivalTime(null);
		rtimetable.setDay(Day);
		rtimetable.setDepartureTime(Dept);
		rtimetable.setDistanceCovered(DistTravell);
		rtimetable.setRoute(Route);
		rtimetable.setStationCode("123488");
		rtimetable.setTrainNo(TrainNO);
		session.save(rstation);
		session.save(rtimetable);
		Transaction tr = null;
		tr = session.beginTransaction();
		session.flush();
		tr.commit();
	
	}*/
	
}