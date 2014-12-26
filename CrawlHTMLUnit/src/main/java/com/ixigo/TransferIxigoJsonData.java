package com.ixigo;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.IxigoJsonDto;
import com.hibernate.City;
import com.hibernate.PlaceCharges;
import com.hibernate.PlaceImage;
import com.hibernate.PlaceTimings;
import com.hibernate.Places;

public class TransferIxigoJsonData extends getHibernateSession{

	private static String dataBaseExceptionFile = "target/ixigo/dataBaseException.txt";
	private static String dataBaseException="";
	public static void transferData(IxigoJsonDto ixigoJsonDto,SessionFactory sessionFactory)throws Exception
	{
		System.out.println("Begin transfer");
		Transaction tr = null;
		
		String placeName=ixigoJsonDto.getPlaceName();
		int isNew=0;
		int isOldAndNotFromIxigo=0;
		Session session1=getHibernateSession(sessionFactory);
		int cityID = getCityID(session1, ixigoJsonDto.getCityName());
		tr = session1.beginTransaction();
		session1.flush();
		tr.commit();
		tr = null;
		session1.close();
		Session session2=getHibernateSession(sessionFactory);
		try{
			Criteria cr = session2.createCriteria(Places.class);
			Criterion c1 = Restrictions.eq("name",placeName);
			Criterion c2 =Restrictions.eq("cityId",cityID);
			Criterion c3 = Restrictions.and(c1, c2);
			cr.add(c3);
			if(cr.list().isEmpty()){
				
				Places places= new Places(ixigoJsonDto.getType(),ixigoJsonDto.getPlaceName(),ixigoJsonDto.getAddress(),ixigoJsonDto.getPincode(),
						cityID,ixigoJsonDto.getDescription(),ixigoJsonDto.getScore(),1,
						ixigoJsonDto.getLatitude(),ixigoJsonDto.getLongitude(),ixigoJsonDto.getTime2Cover(),ixigoJsonDto.getUnescoHeritage(),(byte)1);
				/*Places places= new Places();
				places.setType(ixigoJsonDto.getType());
				places.setName(ixigoJsonDto.getPlaceName());
				places.setAddress(ixigoJsonDto.getAddress());
				places.setPinCode(ixigoJsonDto.getPincode());
				places.setDescription(ixigoJsonDto.getDescription());
				places.setScore(ixigoJsonDto.getScore());
				places.setScoreSources(ixigoJsonDto.get);*/
				
				session2.save(places);
				tr = session2.beginTransaction();
				session2.flush();
				tr.commit();
				tr=null;
				session2.close();	
				isNew=1;//set the flag for new insertion
			}
			else
			{
				//if name already exist then check if that place data come from ixigo or not
				Session isFromIxigoSession=getHibernateSession(sessionFactory);
				Criteria isFromIxigoCr = isFromIxigoSession.createCriteria(Places.class);
				Criterion nameCr = Restrictions.eq("name",placeName);
				Criterion cityIdCr =Restrictions.eq("cityId",cityID);
				Criterion ixigoCr =Restrictions.eq("ixigo",(byte)0);
				Criterion allCr = Restrictions.and(nameCr, cityIdCr,ixigoCr);
				isFromIxigoCr.add(allCr);
				if(!(isFromIxigoCr.list().isEmpty()))
				{
					System.out.println("name already exist but not from ixigo..so updating it..");
					//not from ixigo
					List placeList = isFromIxigoCr.list();
					Places place = (Places)placeList.get(0);
					//update the place details
					if(place.getAddress()==null)
					{
						place.setAddress(ixigoJsonDto.getAddress());
					}
					if(place.getLatitude()==0)
					{
						place.setLatitude(ixigoJsonDto.getLatitude());
					}
					if(place.getLongitude()==0)
					{
						place.setLongitude(ixigoJsonDto.getLongitude());
					}
					if(place.getPinCode()==0)
					{
						place.setPinCode(ixigoJsonDto.getPincode());
					}
					if(place.getDescription()==null)
					{
						place.setDescription(ixigoJsonDto.getDescription());
					}
					else
					{
						place.setDescription(ixigoJsonDto.getDescription()+";"+place.getDescription());
					}
					if(place.getTime2Cover()==0)
					{
						place.setTime2Cover(ixigoJsonDto.getTime2Cover());
					}
					if(place.getUnescoHeritage()==-1)
					{
						place.setUnescoHeritage(ixigoJsonDto.getUnescoHeritage());
					}
					
					place.setIxigo((byte)1);
					if(place.getScoreSources()!=0)
					{
						int totalSources=(place.getScoreSources()+ixigoJsonDto.getNumRatingSources());
						place.setScore(((place.getScore()*place.getScoreSources())+(ixigoJsonDto.getScore()*ixigoJsonDto.getNumRatingSources()))/totalSources);
						place.setScoreSources(totalSources);
					}
					else
					{
						place.setScoreSources(ixigoJsonDto.getNumRatingSources());
						place.setScore(ixigoJsonDto.getScore());
					}
					
					place.setType(ixigoJsonDto.getType()+";"+place.getType());
					
					tr=isFromIxigoSession.beginTransaction();
					isFromIxigoSession.flush();
					tr.commit();
					tr = null;
					isFromIxigoSession.close();
					isOldAndNotFromIxigo=1;//set the flag
				}
			}
				//if place is not there in db or if it is there and not from ixigo,then insert place Timings,place Charges,place image
				if((isNew==1)||(isOldAndNotFromIxigo==1)){
				
					//get the placeID from db
					Session session3=getHibernateSession(sessionFactory);
					int placeID = getPlaceID(session3, ixigoJsonDto.getPlaceName(),cityID);
					tr = session3.beginTransaction();
					session3.flush();
					tr.commit();
					tr = null;
					session3.close();
					
					Session session4=getHibernateSession(sessionFactory);
					//transfer place charges
					PlaceCharges placeCharges=new PlaceCharges(placeID,ixigoJsonDto.getAdultCharge(),ixigoJsonDto.getForeignerCharge());
					session4.save(placeCharges);
		
					//transfer place image
					PlaceImage placeImage=new PlaceImage(placeID,ixigoJsonDto.getPhotoLink());
					session4.save(placeImage);
					
					tr = session4.beginTransaction();
					session4.flush();
					tr.commit();
					tr = null;
					session4.close();
					//transfer place Timings
					ArrayList<DayHourIxigo> dayHourList= ixigoJsonDto.getDayHourList();
					for(int i=0;i<dayHourList.size();i++)
					{
						Session session5=getHibernateSession(sessionFactory);
						DayHourIxigo dayHourIxigo=dayHourList.get(i);
						System.out.println(placeID+","+dayHourIxigo.getOpenTime()+","+dayHourIxigo.getCloseTime()+","+dayHourIxigo.getDay());
						PlaceTimings placeTimings=new PlaceTimings(placeID,dayHourIxigo.getOpenTime(), dayHourIxigo.getCloseTime(),dayHourIxigo.getDay());
						session5.save(placeTimings);
						tr = session5.beginTransaction();
						session5.flush();
						tr.commit();
						tr = null;
						session5.close();
					}
				}
		}
		catch(Exception e)
		{
			System.out.println("Exception occurred:"+e.getMessage()+","+e.toString());
			dataBaseException=new Date()+" "+"Exception occurred"+e.getMessage()+","+e.toString()+"\n";
			dataBaseException+="\n"+ixigoJsonDto.toString();
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
	public static int getPlaceID(Session session,String placeName,int cityID)
	{	
			Criteria placeCriteria = session.createCriteria(Places.class);
			Criterion nameCriterion = Restrictions.eq("name", placeName);
			Criterion cityIDCriterion = Restrictions.eq("cityId", cityID);
			Criterion allCr = Restrictions.and(nameCriterion, cityIDCriterion);
			placeCriteria.add(allCr);
			List placeList = placeCriteria.list();
			Places place = (Places)placeList.get(0);
			return(place.getPlaceId());
	}
}
