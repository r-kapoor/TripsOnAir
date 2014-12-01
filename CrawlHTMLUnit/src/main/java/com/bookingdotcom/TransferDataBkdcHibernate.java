package com.bookingdotcom;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.BookingdotComDto;
import com.hibernate.City;
import com.hibernate.HotelsDetails;

/**
 * 
 * @author rajat
 *
 */

public class TransferDataBkdcHibernate extends getHibernateSession{

	private static String dataBaseExceptionFile = "target/bookingdotcom/dataBaseException.txt";
	private static String dataBaseException="";
	public static void transferData(BookingdotComDto bookingdotComDto) throws FileNotFoundException
	{
		System.out.println("BEGIN transaction");
		Transaction tr = null;
		String name=bookingdotComDto.getName();
		
		String[] resources = {"com/hibernate/HotelsDetails.hbm.xml", "com/hibernate/City.hbm.xml"};
		Session session1=getHibernateSession(resources);
		int cityID = getCityID(session1, bookingdotComDto.getCity());
		tr = session1.beginTransaction();
		session1.flush();
		tr.commit();
		tr = null;
		session1.close();
		Session session2=getHibernateSession(resources);
		try{
			Criteria cr = session2.createCriteria(HotelsDetails.class);
			Criterion c1 = Restrictions.eq("name",name);
			Criterion c2 =Restrictions.eq("cityID",cityID);
			Criterion c3 = Restrictions.and(c1, c2);
			cr.add(c3);			
			if(cr.list().isEmpty()){
				System.out.println("name:"+name);
				System.out.println("cityID:"+cityID);
				System.out.println("Locality:"+bookingdotComDto.getLocality());
				System.out.println("lat:"+bookingdotComDto.getLatitude());
				System.out.println("Long:"+bookingdotComDto.getLongitude());
				System.out.println("rating:"+bookingdotComDto.getRating());
				System.out.println("numReviews:"+bookingdotComDto.getNumofreviews());
				System.out.println("photoLink:"+bookingdotComDto.getPhotoLink());
				System.out.println("hotelUrl:"+bookingdotComDto.getHotelUrl());
				System.out.println("Price:"+bookingdotComDto.getPrice());
				System.out.println("RoomType:"+bookingdotComDto.getRoomType());
				System.out.println("MaxPersons:"+bookingdotComDto.getMaxPersons());
				System.out.println("Source:"+bookingdotComDto.getSource());
				
				HotelsDetails hotelDetails= new HotelsDetails();
				hotelDetails.setName(name);
				hotelDetails.setCityID(cityID);
				hotelDetails.setLocality(bookingdotComDto.getLocality());
				hotelDetails.setLatitude(bookingdotComDto.getLatitude());
				hotelDetails.setLongitude(bookingdotComDto.getLongitude());
				hotelDetails.setRating(bookingdotComDto.getRating());
				hotelDetails.setNumReviews(bookingdotComDto.getNumofreviews());
				hotelDetails.setPhotoLink(bookingdotComDto.getPhotoLink());
				hotelDetails.setHotelUrl(bookingdotComDto.getHotelUrl());
				hotelDetails.setPrice(bookingdotComDto.getPrice());
				hotelDetails.setRoomType(bookingdotComDto.getRoomType());
				hotelDetails.setMaxPersons(bookingdotComDto.getMaxPersons());
				hotelDetails.setSource(bookingdotComDto.getSource());

				tr = session2.beginTransaction();
				session2.flush();
				tr.commit();
				session2.close();
			}
			
			
		}
		catch(Exception e)
		{
			System.out.println("Exception occurred for HotelDetails:"+e.getMessage()+","+e.toString());
			dataBaseException=new Date()+" "+"Exception occurred for HotelDetails:"+e.getMessage()+","+e.toString()+"\n";
			System.out.println("Writing Exceptions for database into file");		
			FileOutputStream exception=new FileOutputStream(dataBaseExceptionFile,true);
			@SuppressWarnings("resource")
			PrintStream exp=new PrintStream(exception);
			exp.append(dataBaseException);
			exp.close();
		}	
	}
		
	public static int getCityID(Session session,String cityName)
	{
			int cityID = -1;			
			Criteria cityCriteria = session.createCriteria(City.class);
			Criterion originCriterion = Restrictions.eq("cityName", cityName);
			cityCriteria.add(originCriterion);
			List cityList = cityCriteria.list();
			City city = (City)cityList.get(0);
			return(city.getCityId());
	}
	
}
