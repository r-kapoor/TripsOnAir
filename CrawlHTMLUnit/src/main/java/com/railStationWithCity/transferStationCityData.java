package com.railStationWithCity;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import GlobalClasses.getHibernateSession;

import com.hibernate.CityAlternateName;

public class transferStationCityData extends getHibernateSession{

	public static void transferData(String stationCity[],SessionFactory sessionFactory){
		System.out.println("Begin transfer");
		Transaction tr = null;
		Session session1=getHibernateSession(sessionFactory);
		int cityID = getCityID(session1, stationCity[1].toUpperCase());
		tr = session1.beginTransaction();
		session1.flush();
		tr.commit();
		tr = null;
		session1.close();
		if(cityID!=-1)
		{
			Session session2=getHibernateSession(sessionFactory);
			
		}
	}

	public static int getCityID(Session session,String cityName)
	{
		int cityID = -1;			
		Criteria cityCriteria = session.createCriteria(CityAlternateName.class);
		Criterion originCriterion = Restrictions.eq("AlternateName", cityName);
		cityCriteria.add(originCriterion);
		if(cityCriteria.list().isEmpty())
		{
			List cityList = cityCriteria.list();
			CityAlternateName cityAlternateName = (CityAlternateName)cityList.get(0);
			return(cityAlternateName.getCityID());	
		}
		else
		{
			return -1;
		}
	}
}