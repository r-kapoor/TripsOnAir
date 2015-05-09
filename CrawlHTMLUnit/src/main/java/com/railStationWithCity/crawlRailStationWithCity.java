package com.railStationWithCity;

import java.net.URL;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.hibernate.SessionFactory;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class crawlRailStationWithCity extends HtmlUnitWebClient{

	private static String stationCityMapping = "";
	private static String exceptionUrls="";
	private static String exceptionMsg="";
	private static String stationCityMappingFile = "ConfigFiles/railStationWithCity/stationCityMapping.txt";
	private static String exceptionFile = "target/railStationWithCity/stationCityMappingException.txt";
	private static String exceptionmsgFile = "target/railStationWithCity/stationCityMappingExceptionMsg.txt";
	
	@SuppressWarnings("unchecked")
	public static void getStationCity(URL url,SessionFactory sessionFactory) throws Exception {
	
		try{
			//Read the whole page
			HtmlPage page=WebClient(url);
			
			DomElement tableElement = page.getFirstByXPath("//table[@class='views-view-grid cols-3']");
			if(tableElement!=null && (tableElement.hasChildNodes()))
			{
				DomElement tbody = tableElement.getFirstElementChild();
				if(tbody!=null && tbody.hasChildNodes())
				{
					Iterator<DomElement> rowItr =  tbody.getChildElements().iterator();
					while(rowItr.hasNext())
					{
						DomElement row = rowItr.next();
						if(row!=null && row.hasChildNodes())
						{
							Iterator<DomElement> colItr =  row.getChildElements().iterator();
							while(colItr.hasNext())
							{
								DomElement col= colItr.next();
								String colmn = col.asText();
								String stationCity[] = colmn.split(",");
								 Matcher m = Pattern.compile("\\(([^)]+)\\)").matcher(stationCity[0]);
							     while(m.find()) {
							      // System.out.println(m.group(1));   
							    	 stationCity[0] = m.group(1);
							     }
							     //transfer data to database
								System.out.println(stationCity[0]+","+stationCity[1]);
							}
						}
					}
				}
			}
		}
		catch(Exception e){
			System.out.println("Exception ocuured For url:"+url);
		}
	}
	
	public static void main(String[] args) throws Exception {
		
		String[] resources = {"com/hibernate/CityAlternateName.hbm.xml","com/hibernate/RailwayStationsInCity.hbm.xml"};
		SessionFactory sessionFactory=getHibernateSessionFactory(resources);
		char alpha = 'a';
		URL url1 = new URL("http://www.makemytrip.com/railways/list-of-railway-stations-by-a.html");
		//System.out.println(url);
		getStationCity(url1,sessionFactory);
//		for(int i=0;i<26;i++)
//		{
//			URL url = new URL("http://www.makemytrip.com/railways/list-of-railway-stations-by-"+(char)(alpha+i)+".html");
//			//System.out.println(url);
//			//getStationCity(url);
//		}
	}
}
