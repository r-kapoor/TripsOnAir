package com.cityLatLong;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.CityLatLongDto;
import com.hibernate.City;
import com.hibernate.CityAlternateName;

/**
 * 
 * @author rajat
 *
 */
public class TransferAlternativeNameLatLong extends getHibernateSession{

	public static  void getCityAndTransfer(SessionFactory sessionFactory)throws Exception
	{
		ArrayList<CityNameID>cityNameList= new ArrayList<CityNameID>();
		int i=0;
		Transaction tr = null;
		Session session=getHibernateSession(sessionFactory);
		tr = session.beginTransaction();
		Criteria cityCriteria = session.createCriteria(City.class);
		cityCriteria.add(Restrictions.isNull("latitude"));
		List cityElements=cityCriteria.list();
		//System.out.println("len:"+cityElements.size());
		 for (Iterator iterator = 
				 cityElements.iterator(); iterator.hasNext();){
			 CityNameID cityNameID = new CityNameID();
			 		City city = (City) iterator.next();
			 		String cityName=city.getCityName().toString();
			 		int cityID=city.getCityId();
			 		cityNameID.setCityName(cityName);
			 		cityNameID.setCityID(cityID);
			 		cityNameList.add(cityNameID);
			 		i++;
		 	}
		 session.flush();
			tr.commit();
			tr=null;
			session.close();
			
			for(int j=0;j<cityNameList.size();j++)
			{
				System.out.println(cityNameList.get(j).cityName);
				GetJsonGoogleApi.GetJsonGoogleApi(cityNameList.get(j));
			}
	}
	public static void transferAlternativeNameLatLong(SessionFactory sessionFactory,CityLatLongDto cityLatLongDto,CityNameID cityNameID)
	{
		System.out.println("--Transfer Begin--");
		String city=cityNameID.getCityName();
		System.out.println("city:"+city);
		int cityID=cityNameID.getCityID();
		Transaction tr = null;
		Session session1=getHibernateSession(sessionFactory);
		//Criteria cityCriteria = session.createCriteria(City.class);
		Criteria cr = session1.createCriteria(City.class);
		Criterion c1 = Restrictions.eq("cityId",cityID);
		cr.add(c1);
		if(!cr.list().isEmpty()){
			List cityList = cr.list();
			City cityTable = (City)cityList.get(0);
			if(!cityLatLongDto.getState().equals(""))
			{
				cityTable.setState(cityLatLongDto.getState().toUpperCase());
			}
			cityTable.setLatitude(cityLatLongDto.getLatitude());
			cityTable.setLongitude(cityLatLongDto.getLongitude());
			tr = session1.beginTransaction();
			session1.flush();
			tr.commit();
			tr=null;
			session1.close();
		}
		
		//if alternative name is not equal to cityName in db then only add it into db
		if((!cityLatLongDto.getAltName().toUpperCase().equals(""))&&(!cityLatLongDto.getAltName().toUpperCase().equals(city)))
		{	
			Session session2= getHibernateSession(sessionFactory);
			Criteria altCr = session2.createCriteria(CityAlternateName.class);
			Criterion idCr = Restrictions.eq("cityId",cityID);
			altCr.add(idCr);
			if(altCr.list().isEmpty()){		
				CityAlternateName cityAlternateName = new CityAlternateName();
				cityAlternateName.setCityID(cityID);
				cityAlternateName.setAlternateName(cityLatLongDto.getAltName().toUpperCase());
				session2.save(cityAlternateName);
				tr = session2.beginTransaction();
				session2.flush();
				tr.commit();
				tr=null;
				session2.close();
			}
		}
		System.out.println("Transfer end");
	}
	
	public static void main(String args[]) throws Exception
	{
		String[] resources = {"com/hibernate/City.hbm.xml"};
		SessionFactory sessionFactory=getHibernateSessionFactory(resources);
		getCityAndTransfer(sessionFactory);
	}
}

class CityNameID
{
	public int cityID;
	public String cityName;
	public int getCityID() {
		return cityID;
	}
	public void setCityID(int cityID) {
		this.cityID = cityID;
	}
	public String getCityName() {
		return cityName;
	}
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
}
