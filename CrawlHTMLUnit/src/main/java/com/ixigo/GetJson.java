package com.ixigo;

import java.io.BufferedReader;
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

import com.dataTransferObject.IxigoJsonDto;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.gson.stream.JsonReader;

public class GetJson {

	private static String outputFile = "target/ixigo/test.txt";

	public static void main(String[] args) throws IOException {

		InputStream is = null;
		try {
			is = new URL(
					"http://www.ixigo.com/rest/content/namedentity/v2/city/id?sort=po&order=dsc&cityId=503b2a78e4b032e338f10051&entityId=1&type=Places+To+Visit&limit=226&filterKeys=&filterValues=")
					.openStream();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		BufferedReader r = new BufferedReader(new InputStreamReader(is,
				Charset.forName("UTF-8")));
		JsonReader reader = new JsonReader(r);
		JsonParser parser = new JsonParser();

		reader.beginObject(); // the initial '{'
		String name = reader.nextName();
		// reader.beginObject();
		// System.out.println(name);
		// assert "Documents".equals(name);
		boolean value = reader.nextBoolean();
		// System.out.println(value);
		name = reader.nextName();
		// System.out.println(name);
		String data = reader.nextString();
		// System.out.println(data.length());
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
			if (dataObject.has("r")) {
				nameOfPlace = dataObject.get("r").getAsString();
			}

			String category = "";
			if (dataObject.has("c")) {
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
			if (dataObject.has("la")) {
				latitude = dataObject.get("la").getAsDouble();
			}
			if (dataObject.has("ln")) {
				longitude = dataObject.get("ln").getAsDouble();
			}

			String description = "";
			if (dataObject.has("d")) {
				description = dataObject.get("d").getAsString();
			}

			String photoLink = "";
			if (dataObject.has("i")) {
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
			String unescoHeritage = "";
			ArrayList<DayHourIxigo> dayHourList = new ArrayList<DayHourIxigo>();
			if (dataObject.has("attr_map")) {
				JsonObject placeAttrObject = dataObject.get("attr_map")
						.getAsJsonObject();

				if (placeAttrObject.has("working hours")) {
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
				if (placeAttrObject.has("unesco world heritage")) {
					unescoHeritage = placeAttrObject.get(
							"unesco world heritage").getAsString();
				}
			}

			String address = "";
			String pincode = "";
			if (dataObject.has("ad")) {
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
			if (dataObject.has("rr")) {
				JsonArray ratingArray = dataObject.get("rr").getAsJsonArray();
				int ratingArrayLen = ratingArray.size();
				for (int i = 0; i < ratingArrayLen; i++) {
					JsonObject ratingObject = ratingArray.get(i)
							.getAsJsonObject();
					if (ratingObject.has("s")) {
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

			if (dataObject.has("pr")) {
				JsonArray feeArray = dataObject.get("pr").getAsJsonArray();
				for (int i = 0; i < feeArray.size(); i++) {
					JsonObject feeElementObject = feeArray.get(i)
							.getAsJsonObject();

					if (feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("for indian")) {
						if (feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person")) {
							pricePPIndian = feeElementObject.get("pmn")
									.getAsInt();
						} else {
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
						}
					}

					else if (feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("for foreign")) {
						if (feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person")) {
							pricePPForeign = feeElementObject.get("pmn")
									.getAsInt();
						} else {
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
						}
					}

					else if (feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("no entry fee")) {
						pricePPForeign = 0;
						pricePPIndian = 0;
						break;
					} else if (feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("above")) {
						if (feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person")) {
							pricePPForeign = feeElementObject.get("pmn")
									.getAsInt();
							pricePPIndian = feeElementObject.get("pmn")
									.getAsInt();
							break;
						} else {
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
						}
					} else if (feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().contains("adults")) {
						if (feeElementObject.get("un").getAsString().trim()
								.toLowerCase().contains("per person")) {
							pricePPForeign = feeElementObject.get("pmn")
									.getAsInt();
							pricePPIndian = feeElementObject.get("pmn")
									.getAsInt();
							break;
						} else {
							System.out.println("New per person:"
									+ feeElementObject.get("un").getAsString());
							System.out.println("price per person:"
									+ feeElementObject.get("pmn").getAsInt());
						}
					} else if (feeElementObject.get("lbl").getAsString().trim()
							.toLowerCase().isEmpty()) {
						pricePPForeign = feeElementObject.get("pmn").getAsInt();
						pricePPIndian = feeElementObject.get("pmn").getAsInt();
					} else {
						System.out.println("New Label:"
								+ feeElementObject.get("lbl").getAsString());
						System.out.println("per person:"
								+ feeElementObject.get("un").getAsString());
						System.out.println("price per person:"
								+ feeElementObject.get("pmn").getAsInt());
					}

				}
			}

			int time2Cover = 0;
			;
			if (dataObject.has("tt")) {
				String time2CoverString = dataObject.get("tt").getAsString();
				time2Cover = getAvgTime2Cover(time2CoverString);
			}

			IxigoJsonDto ixigoJsonDto = new IxigoJsonDto();
			ixigoJsonDto.setPlaceName(nameOfPlace.toUpperCase());
			ixigoJsonDto.setType(category.toUpperCase());
			ixigoJsonDto.setLatitude(latitude);
			ixigoJsonDto.setLongitude(longitude);
			ixigoJsonDto.setDescription(description);
			ixigoJsonDto.setPhotoLink(photoLink);
			ixigoJsonDto.setDayHourList(dayHourList);
			ixigoJsonDto.setUnescoHeritage(unescoHeritage);
			ixigoJsonDto.setAddress(address);
			ixigoJsonDto.setPincode(pincode);
			ixigoJsonDto.setNumRatingSources(numRatingSources);
			ixigoJsonDto.setScore(score);
			ixigoJsonDto.setAdultCharge(pricePPIndian);
			ixigoJsonDto.setForeignerCharge(pricePPForeign);
			ixigoJsonDto.setTime2Cover(time2Cover);

			// System.out.println(ixigoJsonDto);

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
	}

	private static String getInTimeFormat(String openingTimeString) {
		SimpleDateFormat displayFormat = new SimpleDateFormat("HH:mm:ss");
		SimpleDateFormat parseFormat = new SimpleDateFormat("hh:mm a");
		Date date = null;
		try {
			date = parseFormat.parse("00:30 PM");
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

}
