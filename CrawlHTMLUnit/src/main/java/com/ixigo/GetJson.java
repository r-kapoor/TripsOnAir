package com.ixigo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.io.Reader;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Scanner;

import org.hibernate.SessionFactory;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.IxigoJsonDto;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;

//TODO:check startTime and endTime in db
public class GetJson extends getHibernateSession{

	private static String outputFile = "target/ixigo/test.txt";
	private static String exceptionUrlsFile = "target/ixigo/cityUrlException.txt";

	public static void getJson(IxigoServiceURL ixigoServiceURL,SessionFactory sessionFactory) throws Exception {
		System.out.println("--START CRAWLING--");
		String exceptionUrls="";
		InputStream is = null;
		try {
			//is = new URL(
				//	"http://www.ixigo.com/rest/content/namedentity/v2/city/id?sort=po&order=dsc&cityId=503b2a78e4b032e338f10051&entityId=1&type=Places+To+Visit&limit=226&filterKeys=&filterValues=")
			is=ixigoServiceURL.getIxigoCityURL().openStream();

		BufferedReader r = new BufferedReader(new InputStreamReader(is,
				Charset.forName("UTF-8")));
		JsonReader reader = new JsonReader(r);
		JsonParser parser = new JsonParser();

		reader.beginObject();
		String name = reader.nextName();
		// reader.beginObject();
		// System.out.println(name);
		// assert "Documents".equals(name);
		boolean value = reader.nextBoolean();
		// System.out.println(value);
		name = reader.nextName();
		String data = reader.nextString();
		Reader stringReader = new StringReader(data);
		JsonReader dataReader = new JsonReader(stringReader);
		dataReader.beginArray();
		int count = 0;
		while (dataReader.hasNext()) {
			count++;
			JsonObject dataObject = parser.parse(dataReader).getAsJsonObject();
			// JsonObject id = dataObject.get("_id").getAsJsonObject();
			// String oid = id.get("$oid").getAsString();
			// System.out.println(oid);
			// JsonArray filenames = doc.getAsJsonArray("Filenames");
			// do something with the document here
			// ...
			String nameOfPlace = "";
			if (dataObject.has("r")&&(!dataObject.get("r").isJsonNull())) {
				nameOfPlace = dataObject.get("r").getAsString();
			}

			String category = "";
			if (dataObject.has("c")&&(!dataObject.get("c").isJsonNull())) {
				JsonArray categoryArray = dataObject.get("c").getAsJsonArray();
				int len = categoryArray.size();

				for (int i = 0; i < len - 1; i++) {
					category += categoryArray.get(i).getAsString().trim()
							.toUpperCase()
							+ ",";
				}
				category += categoryArray.get(len - 1).getAsString().trim()
						.toUpperCase();
			}

			double latitude = 0.0;
			double longitude = 0.0;
			if (dataObject.has("la")&&(!dataObject.get("la").isJsonNull())) {
				latitude = dataObject.get("la").getAsDouble();
			}
			if (dataObject.has("ln")&&(!dataObject.get("ln").isJsonNull())) {
				longitude = dataObject.get("ln").getAsDouble();
			}
			String description = "";
			
			if ((dataObject.has("d"))&&(!dataObject.get("d").isJsonNull())){
				description = dataObject.get("d").getAsString();
				description=description.replaceAll("\n|</div>|<div>|<br />|<strong>|</strong>|<p>|</p>|<em>|</em>|&nbsp","");
			}

			String photoLink = "";
			if (dataObject.has("i")&&(!dataObject.get("i").isJsonNull())) {
				JsonArray photoArray = dataObject.get("i").getAsJsonArray();
				if ((photoArray != null) && (photoArray.size() > 0)) {
					if (photoArray.get(0).getAsJsonObject().has("s")) {
						photoLink = photoArray.get(0).getAsJsonObject()
								.get("s").getAsString();
					} else if (photoArray.get(0).getAsJsonObject().has("su")) {
						photoLink = photoArray.get(0).getAsJsonObject()
								.get("su").getAsString();
					}
				}
			}

			String placeHoursString = "";
			String unescoHeritage = "-1";
			ArrayList<DayHourIxigo> dayHourList = new ArrayList<DayHourIxigo>();
			if (dataObject.has("attr_map")&&(!dataObject.get("attr_map").isJsonNull())) {
				JsonObject placeAttrObject = dataObject.get("attr_map")
						.getAsJsonObject();

				if (placeAttrObject.has("working hours")&&(!placeAttrObject.get("working hours").isJsonNull())) {
					try {
						String day = "";
						JsonElement workingHours = placeAttrObject
								.get("working hours");
						if (!workingHours.isJsonNull()) {
							placeHoursString = placeAttrObject.get(
									"working hours").getAsString();
							System.out.println(placeHoursString);
							if (!placeHoursString.isEmpty()) {

								Reader hoursStringReader = new StringReader(
										placeHoursString);
								JsonReader hoursDataReader = new JsonReader(
										hoursStringReader);
								hoursDataReader.beginArray();

								while (hoursDataReader.hasNext()) {
									JsonObject hoursDataObject = parser.parse(
											hoursDataReader).getAsJsonObject();
									// System.out.println(hoursDataObject.get("days").getAsString());
									JsonElement daysElement = hoursDataObject
											.get("days");
									//System.out.println("daysElement:"+daysElement);
									JsonArray hoursArray = hoursDataObject.get(
											"hours").getAsJsonArray();
									String daysArray[] = {};
									String daysArr = daysElement.toString()
											.replaceAll("\"|\\[|\\]", "");
									if (!daysArr.isEmpty()) {
										daysArray = daysArr.split(",");
									}
									day = "";

									if (daysArray.length == 7) {
										day = "0";
									} else {
										for (int k = 0; k < daysArray.length; k++) {
											String dayString = daysArray[k];
											int dayInt = dayConverter(dayString);
											if (dayInt != -1) {
												day += dayInt;
											} else {
												day = "8";
												break;
											}
										}
									}
								
									for (int t = 0; t < hoursArray.size(); t++) {
										//System.out.println("Enters");
										DayHourIxigo dayHour;
										JsonObject hoursObject = hoursArray
												.get(t).getAsJsonObject();
										String openingTimeString = hoursObject
												.get("open").getAsString();
										String closingTimeString = hoursObject
												.get("close").getAsString();

										if(openingTimeString.contains("Sunrise"))
										{
											openingTimeString="06:00 am";
										}
										if(closingTimeString.contains("Sunset"))
										{
											closingTimeString="06:00 pm";
										}
										//make the timeString in hh:mm a format for cases like 4am or 4  pm
										openingTimeString=convertIntoFormat(openingTimeString);
										closingTimeString=convertIntoFormat(closingTimeString);
										
										openingTimeString = getInTimeFormat(openingTimeString);
										closingTimeString = getInTimeFormat(closingTimeString);
										Time openTime = Time
												.valueOf(openingTimeString);
										Time closeTime = Time
												.valueOf(closingTimeString);
										dayHour = new DayHourIxigo(day,
												openTime, closeTime);
										dayHourList.add(dayHour);
									}

								}// end while
							}

						}

					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				if (placeAttrObject.has("unesco world heritage")&&(!placeAttrObject.get("unesco world heritage").isJsonNull())) {
					unescoHeritage = placeAttrObject.get(
							"unesco world heritage").getAsString();
					if(unescoHeritage.toLowerCase().contains("true"))
					{
						unescoHeritage="1";
					}
					else
					{
						unescoHeritage="0";
					}
				}
			}

			String address = "";
			String pincode = "";
			if (dataObject.has("ad")&&(!dataObject.get("ad").isJsonNull())) {
				address = dataObject.get("ad").getAsString();
				pincode = getPincode(address);
			}

			int tripAdvisorRank = 0;
			int tripAdvisorNumReviews = 0;
			double tripAdvisorRating = 0.0;
			double googleRating = 0.0;
			int rank = 0;
			int numRatingSources = 0;
			double score = 0.0;
			if (dataObject.has("rr")&&(!dataObject.get("rr").isJsonNull())) {
				JsonArray ratingArray = dataObject.get("rr").getAsJsonArray();
				int ratingArrayLen = ratingArray.size();
				for (int i = 0; i < ratingArrayLen; i++) {
					JsonObject ratingObject = ratingArray.get(i)
							.getAsJsonObject();
					if (ratingObject.has("s")&&(!ratingObject.get("s").isJsonNull())) {
						if (ratingObject.get("s").getAsString()
								.equals("www.tripadvisor.com")) {
							tripAdvisorRank = ratingObject.get("r").getAsInt();
							tripAdvisorNumReviews = ratingObject.get("nr")
									.getAsInt();
							tripAdvisorRating = ratingObject.get("rating")
									.getAsDouble();
							numRatingSources++;
						}
						if (ratingObject.get("s").getAsString()
								.equals("www.google.com")) {
							googleRating = ratingObject.get("rating")
									.getAsDouble();
							numRatingSources++;
						}

						if (ratingObject.get("s").getAsString()
								.equals("handpicked")) {
							rank = ratingObject.get("r").getAsInt();
						}
					}
				}
			}

			if (numRatingSources != 0) {
				score = (tripAdvisorRating + googleRating) / numRatingSources;

			}
			int pricePPIndian = -1;
			int pricePPForeign = -1;
			if (dataObject.has("pr")&&(!dataObject.get("pr").isJsonNull())) {
				JsonArray feeArray = dataObject.get("pr").getAsJsonArray();
				for (int i = 0; i < feeArray.size(); i++) {
					JsonObject feeElementObject = feeArray.get(i)
							.getAsJsonObject();
					if ((feeElementObject.has("lbl"))&&(feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("for indian"))){
						if ((feeElementObject.has("un"))&&(feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person"))) {
							if(feeElementObject.has("pmn")){
							pricePPIndian = feeElementObject.get("pmn")
									.getAsInt();
							}
						} else {
							if(feeElementObject.has("un")){
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							}
							if(feeElementObject.has("pmn")){
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
							}
						}
					}

					else if ((feeElementObject.has("lbl"))&&(feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("for foreign"))) {
						if ((feeElementObject.has("pmn"))&&(feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person"))) {
							pricePPForeign = feeElementObject.get("pmn")
									.getAsInt();
						} else {
							if(feeElementObject.has("un")){
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							}
							if(feeElementObject.has("pmn")){
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
							}
						}
					}

					else if ((feeElementObject.has("lbl"))&&(feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("no entry fee"))) {
						pricePPForeign = 0;
						pricePPIndian = 0;
						break;
					} else if ((feeElementObject.has("lbl"))&&(feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("above"))) {
						if ((feeElementObject.has("un"))&&(feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person"))) {
							if(feeElementObject.has("pmn")){
							pricePPForeign = feeElementObject.get("pmn")
									.getAsInt();
							
							pricePPIndian = feeElementObject.get("pmn")
									.getAsInt();
							}
							break;
						} else {
							if(feeElementObject.has("un")){
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							}
							if(feeElementObject.has("pmn")){
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
							}
						}
					} else if ((feeElementObject.has("lbl"))&&(feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("adults"))) {
						if ((feeElementObject.has("un"))&&(feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person"))&&((feeElementObject.has("pmn")))) {
							pricePPForeign = feeElementObject.get("pmn")
									.getAsInt();
							pricePPIndian = feeElementObject.get("pmn")
									.getAsInt();
							break;
						} else {
							if(feeElementObject.has("un")){
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							}
							if(feeElementObject.has("pmn")){
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
							}
						}
					} else if ((feeElementObject.has("lbl"))&&(feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().isEmpty())&&((feeElementObject.has("pmn")))) {
						pricePPForeign = feeElementObject.get("pmn").getAsInt();
						pricePPIndian = feeElementObject.get("pmn").getAsInt();
					} else {
						if((feeElementObject.has("lbl"))){
						System.out.println("New Label:"
								+ feeElementObject.get("lbl").getAsString());
						}
						if(feeElementObject.has("un")){
						System.out.println("per person:"
								+ feeElementObject.get("un").getAsString());
						}
						if(feeElementObject.has("pmn")){
						System.out.println("price per person:"
								+ feeElementObject.get("pmn").getAsInt());
						}
					}

				}
			}

			int time2Cover = 0;
			if (dataObject.has("tt")&&(!dataObject.get("tt").isJsonNull())) {
				String time2CoverString = dataObject.get("tt").getAsString();
				time2Cover = getAvgTime2Cover(time2CoverString);
			}
			System.out.println("nameOfPlace:"+nameOfPlace);
			 System.out.println("category:"+category);
			  System.out.println("latitude:"+latitude);
			  System.out.println("longitude:"+longitude);
			  System.out.println("description:"+description);
			  System.out.println("photoLink:"+photoLink);
			  System.out.println("placeHoursString:"+placeHoursString);
			  System.out.println("unescoHeritage:"+unescoHeritage);
			  System.out.println("address:"+address);
			  System.out.println("pincode:"+pincode);
			  System.out.println("numRatingSources:"+numRatingSources);
			  System.out.println("score:"+score);
			  System.out.println("pricePPIndian:"+pricePPIndian);
			  System.out.println("pricePPForeign:"+pricePPForeign);
			  System.out.println("time2Cover:"+time2Cover);
			  System.out.println("cityName:"+ixigoServiceURL.getCityName());

			IxigoJsonDto ixigoJsonDto = new IxigoJsonDto();
			ixigoJsonDto.setPlaceName(nameOfPlace.toUpperCase());
			ixigoJsonDto.setType(category.toUpperCase());
			ixigoJsonDto.setLatitude(latitude);
			ixigoJsonDto.setLongitude(longitude);
			ixigoJsonDto.setDescription(description);
			ixigoJsonDto.setPhotoLink(photoLink);
			ixigoJsonDto.setDayHourList(dayHourList);
			ixigoJsonDto.setUnescoHeritage(Byte.parseByte(unescoHeritage));
			ixigoJsonDto.setAddress(address);
			if(!pincode.equals("")){
			ixigoJsonDto.setPincode(Integer.parseInt(pincode));
			}
			else
			{
				ixigoJsonDto.setPincode(-1);
			}
			ixigoJsonDto.setNumRatingSources(numRatingSources);
			ixigoJsonDto.setScore(score);
			ixigoJsonDto.setAdultCharge(pricePPIndian);
			ixigoJsonDto.setForeignerCharge(pricePPForeign);
			ixigoJsonDto.setTime2Cover(time2Cover);
			ixigoJsonDto.setCityName(ixigoServiceURL.getCityName());
					
			//Transfer data into database
			TransferIxigoJsonData.transferData(ixigoJsonDto,sessionFactory);

			String inFile = "count:" + count + "\n";
			inFile = ixigoJsonDto.toString();
			/*
			 * 
			 * String
			 * inFile="count:"+count+"\n"+"nameOfPlace:"+nameOfPlace+"\n"+
			 * "category:"+category+"\n"+"latitude:"+latitude+"\n"
			 * +"longitude:"+
			 * longitude+"\n"+"description:"+description+"\n"+"photoLink:"
			 * +photoLink+"\n"+"placeHoursString:"+placeHoursString+"\n"
			 * +"unescoHeritage:"
			 * +unescoHeritage+"\n"+"address:"+address+"\n"+"tripAdvisorRank:"
			 * +tripAdvisorRank+"\n"
			 * +"tripAdvisorNumReviews:"+tripAdvisorNumReviews
			 * +"\n"+"tripAdvisorRating:"+tripAdvisorRating+"\n"
			 * +"rank:"+rank+"\n"
			 * +"googleRating:"+googleRating+"\n"+"pricePPIndian:"
			 * +pricePPIndian+"\n" +"pricePPForeign:"+pricePPForeign+"\n"
			 * +"time2Cover:"+time2Cover+"\n";
			 */

			inFile += "--Next place--" + "\n";

			/*
			 * System.out.println("nameOfPlace:"+nameOfPlace);
			 * System.out.println("category:"+category);
			 * System.out.println("latitude:"+latitude);
			 * System.out.println("longitude:"+longitude);
			 * System.out.println("description:"+description);
			 * System.out.println("photoLink:"+photoLink);
			 * System.out.println("placeHoursString:"+placeHoursString);
			 * System.out.println("unescoHeritage:"+unescoHeritage);
			 * System.out.println("address:"+address);
			 * System.out.println("tripAdvisorRank:"+tripAdvisorRank);
			 * System.out
			 * .println("tripAdvisorNumReviews:"+tripAdvisorNumReviews);
			 * System.out.println("tripAdvisorRating:"+tripAdvisorRating);
			 * System.out.println("rank:"+rank);
			 * System.out.println("googleRating:"+googleRating);
			 * System.out.println("pricePPIndian:"+pricePPIndian);
			 * System.out.println("pricePPForeign:"+pricePPForeign);
			 * System.out.println("time2Cover:"+time2Cover);
			 */
			FileOutputStream exception = new FileOutputStream(outputFile, true);
			@SuppressWarnings("resource")
			PrintStream exe = new PrintStream(exception);
			exe.append(inFile);
			exe.close();
		}

		dataReader.endArray(); // ending ']' of Documents
		// final '}'
		dataReader.close();
		
		
	}//end try block
		catch (Exception e) {

			exceptionUrls=ixigoServiceURL.getCityName()+","+ixigoServiceURL.getIxigoCityID()+","+new Date()+"\n";
			System.out.println(ixigoServiceURL.getIxigoCityURL()+",Error:"+e+",Error Message:"+e.getMessage());
			exceptionUrls+="Error:"+e+",Error Message:"+e.getMessage()+"\n";		
			FileOutputStream exception=new FileOutputStream(exceptionUrlsFile,true);
			@SuppressWarnings("resource")
			PrintStream exe=new PrintStream(exception);
			exe.append(exceptionUrls);
			exe.close();
			if(exceptionUrls.contains("UnknownHostException"))
			{	
				Thread.sleep(300000);//sleep for 5 min
			}		
	}
}

	
	private static String convertIntoFormat(String timeString)
	{
		String pattern="(\\d+)[:](\\d+)([ ]*)(PM|pm|AM|am)(.*)";
		if(timeString.matches(pattern))
		{
			String hour=timeString.replaceAll(pattern, "$1");
			String min=timeString.replaceAll(pattern, "$2");
			String AMPM=timeString.replaceAll(pattern, "$4");
			return (hour+":"+min+" "+AMPM);
		}
		return timeString;
	}
	private static String getInTimeFormat(String openingTimeString) {
		SimpleDateFormat displayFormat = new SimpleDateFormat("HH:mm:ss");
		SimpleDateFormat parseFormat = new SimpleDateFormat("hh:mm a");
		Date date = null;
		try {
			date = parseFormat.parse(openingTimeString);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
		return displayFormat.format(date);
	}

	private static int dayConverter(String dayString) {
		// TODO Auto-generated method stub

		if (dayString.toLowerCase().equals("mon")) {
			return 2;
		} else if (dayString.toLowerCase().equals("tue")) {
			return 3;
		} else if (dayString.toLowerCase().equals("wed")) {
			return 4;
		} else if (dayString.toLowerCase().equals("thu")) {
			return 5;
		} else if (dayString.toLowerCase().equals("fri")) {
			return 6;
		} else if (dayString.toLowerCase().equals("sat")) {
			return 7;
		} else if (dayString.toLowerCase().equals("sun")) {
			return 1;
		}
		return -1;
	}

	private static String getPincode(String address) {
		String addrPattern = ".*(\\d{6}).*";
		String pincode = "";
		if (address.matches(addrPattern)) {
			pincode = address.replaceAll(addrPattern, "$1");
		}
		return pincode;
	}

	private static int getAvgTime2Cover(String time2Cover) {

		// String
		// time2cover[]={"Around 1 hour","1 to 2 hours","1-2 hours","30 minutes to 1 hour","1 hour","2 hours","","20 minutes",
		// "30 to 45 minutes","1 to2 hours"};
		String pattern1 = "([Around ]*)(\\d+)([ ]*)(hours|hour|minutes|minute)";
		String pattern2 = "(\\d+)([ ]*)([hours|hour|minutes|minute]*)([ ]*to[ ]*)(\\d+)([ ]*)(hours|hour|minutes|minute)";
		String pattern3 = "(\\d+)-(\\d+)([ ]*)(hours|hour|minutes|minute)";

		int time = -1;
		String unit = "";

		if (time2Cover.equals("")) {
			time = -1;
			// System.out.println("Blank");
		} else if (time2Cover.matches(pattern1)) {
			time = Integer.parseInt(time2Cover.replaceAll(pattern1, "$2"));
			unit = time2Cover.replaceAll(pattern1, "$4");
			if (unit.contains("hour")) {
				time = time * 60;
			}
			// System.out.println("time:"+time);
			// System.out.println("unit:"+unit);
		} else if (time2Cover.matches(pattern2)) {
			int time1 = Integer.parseInt(time2Cover.replaceAll(pattern2, "$1"));
			String unit1 = time2Cover.replaceAll(pattern2, "$3");
			int time2 = Integer.parseInt(time2Cover.replaceAll(pattern2, "$5"));
			String unit2 = time2Cover.replaceAll(pattern2, "$7");

			if (unit1.isEmpty()) {
				unit1 = unit2;
			}

			if (unit1.contains("hour")) {
				time1 = time1 * 60;
			}
			if (unit2.contains("hour")) {
				time2 = time2 * 60;
			}

			time = (time1 + time2) / 2;
			/*
			 * System.out.println("time1:"+time1);
			 * System.out.println("unit1:"+unit1);
			 * System.out.println("time2:"+time2);
			 * System.out.println("unit2:"+unit2);
			 */
		} else if (time2Cover.matches(pattern3)) {
			int time1 = Integer.parseInt(time2Cover.replaceAll(pattern3, "$1"));
			int time2 = Integer.parseInt(time2Cover.replaceAll(pattern3, "$2"));
			String unit2 = time2Cover.replaceAll(pattern3, "$4");
			if (unit2.contains("hour")) {
				time2 = time2 * 60;
				time1 = time1 * 60;
			}
			time = (time1 + time2) / 2;
			/*
			 * System.out.println("time1:"+time1);
			 * System.out.println("time2:"+time2);
			 * System.out.println("unit2:"+unit2);
			 */
		} else {
			// System.out.println("No matches");
		}
		return time;
	}

	public static String buildPlacesToVisitServiceURL(String ixigoCityID)
	{
		return("http://www.ixigo.com/rest/content/namedentity/v2/city/id?sort=po&order=dsc&cityId="+ixigoCityID+"&entityId=1&type=Places+To+Visit&limit=0&filterKeys=&filterValues=");
		
	}
	public static String buildThingsToDoServiceURL(String ixigoCityID)
	{
		return("http://www.ixigo.com/rest/content/namedentity/v2/city/id?sort=po&order=dsc&cityId="+ixigoCityID+"&entityId=1&type=Things+To+Do&limit=0&filterKeys=&filterValues=");
	}
	
	public static void main(String args[]) throws Exception
	{
		File file= new File("ConfigFiles/ixigo/testIDsOfCity.txt");
		Scanner in = new Scanner(file);
		String[] resources = {"com/hibernate/Places.hbm.xml","com/hibernate/PlaceImage.hbm.xml","com/hibernate/PlaceCharges.hbm.xml", "com/hibernate/PlaceTimings.hbm.xml", "com/hibernate/City.hbm.xml"};
		SessionFactory sessionFactory=getHibernateSessionFactory(resources);
		while(in.hasNext())
		{
			String line=in.next();
			String elements[]=line.split(",");
			IxigoServiceURL ixigoServiceURL= new IxigoServiceURL();
			ixigoServiceURL.setCityName(elements[0]);
			ixigoServiceURL.setIxigoCityID(elements[1]);
			System.out.println(buildPlacesToVisitServiceURL(elements[1]));
			//set the url for places to visit
			ixigoServiceURL.setIxigoCityURL(new URL(buildPlacesToVisitServiceURL(elements[1])));
			//crawl and set data into db for places to visit
			getJson(ixigoServiceURL,sessionFactory);
			//set the url for things to do
			ixigoServiceURL.setIxigoCityURL(new URL(buildThingsToDoServiceURL(elements[1])));
			//crawl and set data into db for things to do
			getJson(ixigoServiceURL,sessionFactory);
		}
	}
}
