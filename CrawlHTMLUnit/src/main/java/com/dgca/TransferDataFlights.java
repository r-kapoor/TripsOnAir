package com.dgca;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.sql.Time;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.DgcaDto;
import com.hibernate.City;
import com.hibernate.FlightSchedule;

public class TransferDataFlights extends getHibernateSession{
	
	private static String dataBaseExceptionFile = "target/flights/dataBaseException.txt";
	private static String dataBaseException="";
	public static void transferData(DgcaDto dgcaDto,Session session)
	{
		System.out.println("Begin transfer");
		Transaction tr = null;
		
		String originCityName = dgcaDto.getOriginCity();
		String destinationCityName = dgcaDto.getDestinationCity();
		String operator = dgcaDto.getOperator();
		String flightNumber = dgcaDto.getFlightNumber();
		String daysOfTravel = dgcaDto.getDaysOfTravel();
		Time departureTime = dgcaDto.getDepartureTime();
		Time arrivalTime = dgcaDto.getArrivalTime();
		int hops = dgcaDto.getHops();
		String carrierType = dgcaDto.getCarrierType();
		
		//Getting the city ids of the origin and destination cities
		String[] resources = {"com/hibernate/FlightSchedule.hbm.xml", "com/hibernate/City.hbm.xml"};
		Session session1=getHibernateSession(resources);
		int[] cityIDs = getOriginDestinationCityIDs(session1, originCityName, destinationCityName);
		tr = session1.beginTransaction();
		session1.flush();
		tr.commit();
		tr = null;

		boolean needToFetchAgain = false;
		if(cityIDs[0] == -1 || cityIDs[1] == -1)
		{
			Session session2=getHibernateSession(resources);
			if(cityIDs[0] == -1)
			{
				needToFetchAgain = true;
				System.out.println("Origin City not found");
				City city = new City();
				city.setCityName(originCityName);
				city.setState("TEMP");
				city.setCountry("INDIA");
				city.setRating(-1);
				city.setIxigo(false);
				city.setTripAdvisor(false);
				
				session2.save(city);
				
			}
			if(cityIDs[1] == -1) {
				needToFetchAgain = true;
				System.out.println("Destination City not found");
				City city = new City();
				city.setCityName(destinationCityName);
				city.setState("TEMP");
				city.setCountry("INDIA");
				city.setRating(-1);
				city.setIxigo(false);
				city.setTripAdvisor(false);
				
				session2.save(city);
			}
			
			tr = session2.beginTransaction();
			session2.flush();
			tr.commit();
			tr = null;
		}
		
		if(needToFetchAgain)
		{
			Session session3=getHibernateSession(resources);
			cityIDs = getOriginDestinationCityIDs(session3, originCityName, destinationCityName);
			tr = session3.beginTransaction();
			session3.flush();
			tr.commit();
			tr = null;
		}
		
		if(cityIDs[0] == -1 || cityIDs[1] == -1)
		{
			System.out.println("Some problem occured. Cities still not present");
			dataBaseException=new Date()+" "+"Some problem occured. Cities still not present for FlightSchedule:"+originCityName+","+destinationCityName+"\n";
			FileOutputStream exception = null;
			try {
				exception = new FileOutputStream(dataBaseExceptionFile,true);
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
			@SuppressWarnings("resource")
			PrintStream dataexe=new PrintStream(exception);
			dataexe.append(dataBaseException);
			dataexe.close();
		}
		else
		{
			try {
				FlightSchedule flightSchedule = new FlightSchedule();
				Criteria flightCriteria = session.createCriteria(FlightSchedule.class);
				Criterion c1 = Restrictions.eq("originCityID", cityIDs[0]);
				Criterion c2 = Restrictions.eq("destinationCityID", cityIDs[1]);
				Criterion c3 = Restrictions.eq("operator", operator);
				Criterion c4 = Restrictions.eq("flightNumber", flightNumber);
				Criterion c5 = Restrictions.eq("daysOfTravel", daysOfTravel);
				Criterion c6 = Restrictions.eq("departureTime", departureTime);
				Criterion c7 = Restrictions.eq("arrivalTime", arrivalTime);
				Criterion combined = Restrictions.and(c1, c2, c3, c4, c5, c6, c7);
				flightCriteria.add(combined);
				
				if(flightCriteria.list().isEmpty())
				{
					flightSchedule.setOriginCityID(cityIDs[0]);
					flightSchedule.setDestinationCityID(cityIDs[1]);
					flightSchedule.setOperator(operator);
					flightSchedule.setFlightNumber(flightNumber);
					flightSchedule.setDaysOfTravel(daysOfTravel);
					flightSchedule.setDepartureTime(departureTime);
					flightSchedule.setArrivalTime(arrivalTime);
					flightSchedule.setHops(hops);
					flightSchedule.setCarrierType(carrierType);
					
					session.save(flightSchedule);
					
					tr = session.beginTransaction();
					session.flush();
					tr.commit();
				}
			} catch (Exception e) {
				e.printStackTrace();
				dataBaseException=new Date()+" "+"Exception occurred for FlightSchedule:"+e.getMessage()+","+e.toString()+"\n";
				System.out.println("Exception occurred for RailwayTimeTable:"+e.getMessage()+","+e.toString());	
				FileOutputStream exception = null;
				try {
					exception = new FileOutputStream(dataBaseExceptionFile,true);
				} catch (FileNotFoundException e1) {
					e1.printStackTrace();
				}
				@SuppressWarnings("resource")
				PrintStream dataexe=new PrintStream(exception);
				dataexe.append(dataBaseException);
				dataexe.close();
			}
		}
		
		System.out.println("EndTransfer");
	}
	private static int[] getOriginDestinationCityIDs(Session session,
			String originCityName, String destinationCityName) {
		int[] cityIDs = {-1, -1};
		//int originCityID = -1, destinationCityID = -1;
		
		Criteria cityCriteria = session.createCriteria(City.class);
		Criterion originCriterion = Restrictions.eq("cityName", originCityName);
		Criterion destinationCriterion = Restrictions.eq("cityName", destinationCityName);
		Criterion eitherCityCriterion = Restrictions.or(originCriterion, destinationCriterion);
		cityCriteria.add(eitherCityCriterion);
		
		List cityList = cityCriteria.list();
		Iterator cityIterator = cityList.iterator();
		while(cityIterator.hasNext())
		{
			City city = (City)cityIterator.next();
			if(city.getCityName().equals(originCityName))
			{
				cityIDs[0] = city.getCityId();
			}
			else if(city.getCityName().equals(destinationCityName))
			{
				cityIDs[1] = city.getCityId();
			}
		}
		return cityIDs;
	}

}
