package com.indianRail;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Date;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import com.dataTransferObject.IndianRailwayDto;
import com.hibernate.RailwayStation;
import com.hibernate.RailwayTimetable;
import com.hibernate.Trains;
/**
 * 
 * @author rajat
 *
 */

public class TransferDataRailway {

	
	private static String dataBaseExceptionFile = "target/indianRail/dataBaseException.txt";
	private static String dataBaseException="";
	public static void transferData(IndianRailwayDto indianRailwayDto,Session session)throws Exception
	{
		System.out.println("Begin transfer");
		Transaction tr = null;
		ArrayList<arrayListObject> stationDetails=indianRailwayDto.getStationsDetails();

		for(int i=0;i<stationDetails.size();i++)
		{	
			String stationCode=stationDetails.get(i).getStationCode();
			Integer trainNo= indianRailwayDto.getTrainNo();
			// for table RailwayStation primary key checkup
			RailwayStation station = 
                    (RailwayStation)session.get(RailwayStation.class, stationCode);
			//table RailwayTimetable primary key criteria
			Criteria cr = session.createCriteria(RailwayTimetable.class);
			//for table Trains primary key checkup
			Trains isTrainExist = 
                    (Trains)session.get(Trains.class, trainNo);

			try{
			RailwayStation rstation = new RailwayStation();	
			System.out.println("station:"+station);
				if(station==null){
					rstation.setStationCode(stationCode);
					rstation.setStationName(stationDetails.get(i).getStationName());
					session.save(rstation);
				}
			}
			catch(Exception e){
				System.out.println("Exception occrrured for Railwaystation Table:"+e.getMessage()+","+e.toString());
				dataBaseException+="Exception occrrured for Railwaystation Table:"+e.getMessage()+","+e.toString();
			}
			try{
				System.out.println("in railwayTimeTable try catch");
				RailwayTimetable rtimetable= new RailwayTimetable();
				byte route=stationDetails.get(i).getRoute();
				Criterion c1 = Restrictions.eq("stationCode",stationCode);
				Criterion c2 =Restrictions.eq("trainNo",trainNo);
				Criterion c3 =Restrictions.eq("route",route);
				Criterion c4 = Restrictions.and(c1, c2,c3);
				cr.add(c4);
				System.out.println("list:"+cr.list());
				
				if(cr.list().isEmpty()){
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
				}
				}catch(Exception e){
					
					dataBaseException=new Date()+" "+"Exception occrrured for RailwayTimeTable:"+e.getMessage()+","+e.toString()+"\n";
					System.out.println("Exception occrrured for RailwayTimeTable:"+e.getMessage()+","+e.toString());
					System.out.println("Writing Exceptions for database, if any, into file");		
					FileOutputStream exception=new FileOutputStream(dataBaseExceptionFile,true);
					@SuppressWarnings("resource")
					PrintStream dataexe=new PrintStream(exception);
					dataexe.append(dataBaseException);
					dataexe.close();
				}
			
			try{				
				Trains trains= new Trains();
				if(isTrainExist==null){				

					trains.setTrainNo(trainNo);
					trains.setTrainName(indianRailwayDto.getName());
					trains.setDaysOfTravel(indianRailwayDto.getDays());
					System.out.println("Days of travel:"+trains.getDaysOfTravel());
					trains.setPantry(indianRailwayDto.getPantry());
					System.out.println("Pantry:"+trains.getPantry());
					trains.setType(indianRailwayDto.getType());
					System.out.println("type:"+trains.getPantry());
					session.save(trains);
				}
			if((station==null)||(cr.list().isEmpty())||isTrainExist==null)
			{
				tr = session.beginTransaction();
				session.flush();
				tr.commit();				
			}
			}catch(Exception e)
			{
				System.out.println("Exception occrrured for Trains-table:"+e.getMessage()+","+e.toString());
				dataBaseException=new Date()+" "+"Exception occrrured for Trains-table:"+e.getMessage()+","+e.toString()+"\n";
				System.out.println("Writing Exceptions for database, if any, into file");		
				FileOutputStream exception=new FileOutputStream(dataBaseExceptionFile,true);
				@SuppressWarnings("resource")
				PrintStream exp=new PrintStream(exception);
				exp.append(dataBaseException);
				exp.close();
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