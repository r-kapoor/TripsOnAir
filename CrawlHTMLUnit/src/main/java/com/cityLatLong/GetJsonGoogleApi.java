package com.cityLatLong;

import java.io.InputStream;
import java.net.URL;

import javax.json.Json;

import org.hibernate.SessionFactory;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.CityLatLongDto;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.stream.JsonReader;

/**
 * 
 * @author rajat
 *
 */
public class GetJsonGoogleApi extends getHibernateSession{

	public static void GetJsonGoogleApi(CityNameID cityNameID) throws Exception
	{	
		InputStream is = null;
		String altName="";
		String state="";
		double latitude=0.0;
		double longitude=0.0;
		CityLatLongDto cityLatLongDto = new CityLatLongDto();
		try {
			is = new URL(
					"http://maps.googleapis.com/maps/api/geocode/json?address="+cityNameID.getCityName().replace(" ", "")+"&sensor=true").openStream();
			javax.json.JsonReader rdr = Json.createReader(is);
					
					      javax.json.JsonObject obj = rdr.readObject();
					      javax.json.JsonArray results = obj.getJsonArray("results");
					       for (javax.json.JsonObject result :  results.getValuesAs(javax.json.JsonObject.class)) {
					    	   
					    	   javax.json.JsonArray addressArray= result.getJsonArray("address_components");
					    	   for(int k=0;k<addressArray.size();k++)
					    	   {
					    		   System.out.println(addressArray.getJsonObject(k).getJsonArray("types").get(0));
					    		   String type= addressArray.getJsonObject(k).getJsonArray("types").get(0).toString();
					    		   if(type.equals("\"locality\""))
					    		   {
					    			   altName=addressArray.getJsonObject(k).getString("long_name");  
					    		   }
					    		   if(type.equals("\"administrative_area_level_1\""))
					    		   {
					    			   state=addressArray.getJsonObject(k).getString("long_name");
					    		   }   
					    	   }
					    	   
					    	   javax.json.JsonObject geoObject= result.getJsonObject("geometry");
					    	   javax.json.JsonObject locationObject= geoObject.getJsonObject("location");
					    	   //System.out.println("kuh:"+locationObject.get("lat"));
					    	   latitude=Double.parseDouble(""+locationObject.get("lat"));
					    	   longitude=Double.parseDouble(""+locationObject.get("lng"));
					    	   
					    	  //System.out.println(result.getJsonArray("address_components").getJsonObject(0).getString("long_name"));
					    	   System.out.println(altName+","+state+","+latitude+","+longitude);
					    	   System.out.println("-----------");
					    	   
					    	   cityLatLongDto.setAltName(altName);
					    	   cityLatLongDto.setState(state);
					    	   cityLatLongDto.setLatitude(latitude);
					    	   cityLatLongDto.setLongitude(longitude);
					    	   
					    	   //Transfer the data into the database
					    	   String[] resources = {"com/hibernate/City.hbm.xml","com/hibernate/CityAlternateName.hbm.xml"};
					    	   SessionFactory sessionFactory=getHibernateSessionFactory(resources);
					    	   TransferAlternativeNameLatLong.transferAlternativeNameLatLong(sessionFactory,cityLatLongDto,cityNameID); 
					    	   if(true)//run only for first case as  other may be invalid
					    	   {
					    		   break;
					    	   }
					    }
		}
		catch(Exception e)
		{
			System.out.println("Exception occured"+e.getMessage());
		}
	}
	
	/*public static void main(String args[]) throws Exception
	{
		GetJsonGoogleApi.GetJsonGoogleApi("bangalore");
	}*/
}
