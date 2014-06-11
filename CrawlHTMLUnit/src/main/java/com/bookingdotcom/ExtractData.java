package com.bookingdotcom;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.lang.reflect.Array;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Scanner;

import GlobalClasses.HtmlUnitWebClient;

import com.dataTransferObject.BookingdotComDto;
import com.dataTransferObject.BookingdotComPriceDto;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * 
 * @author rajat
 *
 */

public class ExtractData extends HtmlUnitWebClient{

	private static String exceptionUrls = "";
	private static String exceptionFile = "target/bookingdotcom/exception.txt";
	private static String exceptionmsgFile = "target/bookingdotcom/exceptionmsg.txt";
	private static String exceptionMsg = "";
	private static String linksFile="ConfigFiles/bookingdotcom/PriceCheckingUrls.txt";
	
	public static void getData(BKDCURL bkdcUrl)throws Exception
	{
		//URL url1 = new URL("http://www.booking.com/hotel/in/hilton-garden-inn-new-delhi-saket.en-gb.html?aid=367912;label=dial-FM;sid=6b4a0f8b7d12fca42a71b2ab3b4ec786;dcid=1;checkin=2014-05-10;checkout=2014-05-11;ucfs=1;srfid=b41b64303289312c14ac80addd1920eaa773bc4eX11");
		
		try{
		HtmlPage page=WebClient(bkdcUrl.link);
		
		String Title="unknown",address="unknown",rating="unknown",description="unknown",checkIn="unknown",checkOut="unknown";
		String Bedroom="unknown",Outdoors="unknown",Activities="unknown",Living_Area="unknown",Media="unknown",Food="unknown",Internet="unknown",Parking="unknown",Services="unknown",General="unknown",Languages="unknown";
		String numofreviews="";
		ArrayList<URL> photoList = new ArrayList<URL>();
		
		DomElement dataArea = page.getFirstByXPath("//div[@id='wrap-hotelpage-top']");
		
		if((dataArea!=null)&&(dataArea.hasChildNodes()))
		{
			Iterator<DomElement> dataItr=dataArea.getChildElements().iterator();
			while(dataItr.hasNext())
			{
				DomElement dataE=dataItr.next();
				if(dataE.getTagName().contains("h1")&&(dataE.hasChildNodes()))
				{
					Title=dataE.getFirstElementChild().asText().trim();
					
				}
				
				if(dataE.getTagName().contains("p")&&(dataE.hasChildNodes()))
				{
					address=dataE.getFirstElementChild().asText().trim();
					
				}
			}
		}

		DomElement ratingArea = page.getFirstByXPath("//span[@class='rating']");
		if((ratingArea!=null)&&(ratingArea.hasChildNodes()))
		{
			rating = ratingArea.getFirstChild().asText().trim();
		}
		
		DomElement reviewsArea = page.getFirstByXPath("//strong[@class='count']");
		if((reviewsArea!=null)&&(reviewsArea.hasChildNodes()))
		{
			numofreviews =reviewsArea.asText().trim();
		}
		
		
		DomElement photosArea = page.getFirstByXPath("//div[@id='photos_distinct']");
		if((photosArea!=null)&&(photosArea.hasChildNodes())){
			Iterator<DomElement> photosItr = photosArea.getChildElements().iterator();
			while(photosItr.hasNext())
			{
				DomElement photosLink=photosItr.next();
				if(photosLink.getTagName().contains("a"))
				{
					String photoLink=photosLink.getAttribute("href");
					photoList.add(new URL(photoLink));
				}	
			}
		}
		
		DomElement desciptionArea = page.getFirstByXPath("//div[@id='summary']");
		if(desciptionArea!=null){
			description = desciptionArea.asText().trim();
			
		}
		
		DomElement facilitiesArea = page.getFirstByXPath("//div[@class='nha_single_unit_facilities common_room_facilities']");
		if((facilitiesArea!=null)&&(facilitiesArea.hasChildNodes()))
		{
			Iterator<DomElement> facilitiesItr=facilitiesArea.getChildElements().iterator();
			while(facilitiesItr.hasNext())
			{
				DomElement facilityE=facilitiesItr.next();
				if((facilityE!=null)&&(facilityE.hasChildNodes()))
				{
					DomElement fltyNameE=facilityE.getFirstElementChild();
					String fltyName = fltyNameE.asText().trim();
					DomElement fltydetailE = fltyNameE.getNextElementSibling();
					String fltyDetail="";
					if((fltydetailE!=null)&&(fltydetailE.getTagName().contains("p")))
					{
						fltyDetail = fltydetailE.asText().trim();
					}
					
					if(fltyName.equals("Bedroom"))
					{
						Bedroom = fltyDetail;
					}
					else if(fltyName.equals("Outdoors"))
					{
						Outdoors = fltyDetail;
					}
					else if(fltyName.equals("Activities"))
					{
						Activities = fltyDetail;
					}
					else if(fltyName.equals("Living Area"))
					{
						Living_Area = fltyDetail;
					}
					else if(fltyName.equals("Media & Technology"))
					{
						Media = fltyDetail;
					}
					else if(fltyName.equals("Food & Drink"))
					{
						Food = fltyDetail;
					}
					else if(fltyName.equals("Internet"))
					{
						Internet = fltyDetail;
					}
					else if(fltyName.equals("Parking"))
					{
						Parking = fltyDetail;
					}
					else if(fltyName.equals("Services"))
					{
						Services = fltyDetail;
					}
					else if(fltyName.equals("General"))
					{
						General = fltyDetail;
					}
					else if(fltyName.equals("Languages spoken"))
					{
						Languages = fltyDetail;
					}
				}		
			}
		}

		DomElement policyArea = page.getFirstByXPath("//div[@id='hotelPoliciesInc']");
		if((policyArea!=null)&&(policyArea.hasChildNodes()))
		{
			Iterator<DomElement> policyItr=policyArea.getChildElements().iterator();
			while(policyItr.hasNext())
			{
				DomElement policyE=policyItr.next();
				if((policyE!=null)&&(policyE.hasChildNodes()))
				{
					DomElement policyEmt=policyE.getFirstElementChild();
					String policyName = policyEmt.asText().trim();
					String time = policyEmt.getNextElementSibling().asText().trim();
				
					if(policyName.equals("Check-in"))
					{
						checkIn=time;
					}
					else if(policyName.equals("Check-out"))
					{
						checkOut=time;
						break;
					}	
				}
			}
		}
		
		String city = bkdcUrl.city;
		String country = bkdcUrl.country;
		String locality = bkdcUrl.locality;
		System.out.println("Title="+Title);
		System.out.println("address="+address);
		System.out.println("rating="+rating);
		System.out.println("numofReviews "+numofreviews);
		for(int i=0;i<photoList.size();i++)
		{
			System.out.println(photoList.get(i));
		}
			
		//getPrices(url);
		
		System.out.println("desciption="+description);
		System.out.println("Bedroom="+Bedroom);
		System.out.println("Outdoors="+Outdoors);
		System.out.println("Activities="+Activities);
		System.out.println("Living_Area="+Living_Area);
		System.out.println("Media="+Media);
		System.out.println("Food="+Food);
		System.out.println("Internet="+Internet);
		System.out.println("Parking="+Parking);
		System.out.println("Services="+Services);
		System.out.println("General="+General);
		System.out.println("Languages="+Languages);
		System.out.println("checkIn="+checkIn);
		System.out.println("checkOut="+checkOut);
		
		//Handling Pincode
		String pincode = "";
		if(address.matches(".*\\d{6} "+city))
		{
			pincode = address.replaceAll("(.*)(\\d{6})(.*)","$2");
			address = address.replaceAll("(.*)(\\d{6})(.*)","$1$3");
		}
		
		BookingdotComDto bookingdotcomDto = new BookingdotComDto();
		
		bookingdotcomDto.setSource("Bookingdotcom");
		bookingdotcomDto.setName(Title.toUpperCase());
		bookingdotcomDto.setCity(city.toUpperCase());
		bookingdotcomDto.setCountry(country.toUpperCase());
		bookingdotcomDto.setAddress(address);
		bookingdotcomDto.setPincode(pincode);
		bookingdotcomDto.setRating(rating);
		bookingdotcomDto.setNumofreviews(numofreviews);
		bookingdotcomDto.setDescription(description);
		bookingdotcomDto.setPhotoLink(photoList);
		bookingdotcomDto.setCheckIn(checkIn);
		bookingdotcomDto.setCheckOut(checkOut);
		
		System.out.println("Starting Transferring the data to DB");
		
		TransferDataBookingdotcom.transferData(bookingdotcomDto);
				
		
		}catch(Exception e)
		{
			System.out.println("Exception Occured. Adding to exceptionUrls");
			System.out.println(e);
			System.out.println(e.getMessage());
			exceptionUrls+=bkdcUrl.country+"&&&"+bkdcUrl.city+"&&&"+bkdcUrl.locality+"&&&"+bkdcUrl.link+"\n";
			exceptionMsg+=e+"\n";
		}
		
		FileOutputStream exception=new FileOutputStream(exceptionFile);
		FileOutputStream exceptionmsg=new FileOutputStream(exceptionmsgFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(exception);
		PrintStream e1=new PrintStream(exceptionmsg);
		e.println(exceptionUrls);
		e1.println(exceptionMsg);
		e.close();
		e1.close();
		
	}
	
	public static void getPrices(URL url) throws Exception
	{
		try{
			
			ArrayList<String> roomTypeList = new ArrayList<String>();
			ArrayList<Integer> numberofSubtypesList = new ArrayList<Integer>();
			ArrayList<String> conditionsList = new ArrayList<String>();
			ArrayList<Integer> maxCapacityList = new ArrayList<Integer>();
			ArrayList<String> priceList = new ArrayList<String>();
			
			HtmlPage page=WebClient(url);

			DomElement priceArea = page.getFirstByXPath("//tbody[@id='room_availability_container']");

			if((priceArea!=null)&&(priceArea.hasChildNodes()))
			{
				Iterator<DomElement> priceItr= priceArea.getChildElements().iterator();
				while(priceItr.hasNext())
				{
					DomElement priceE=priceItr.next();
					if((priceE.hasAttribute("class"))&&((priceE.getAttribute("class").contains("room_loop_counter1 maintr"))||(priceE.getAttribute("class").contains("room_loop_counter2 maintr"))||(priceE.getAttribute("class").contains("room_loop_counter3 maintr"))||(priceE.getAttribute("class").contains("room_loop_counter4 maintr"))||(priceE.getAttribute("class").contains("room_loop_counter5 maintr")))&&(priceE.hasChildNodes()))
					{
						Iterator<DomElement> priceEItr=priceE.getChildElements().iterator();
						while(priceEItr.hasNext()){
							DomElement priceE1 = priceEItr.next();
							if((priceE1!=null)&&(priceE1.hasChildNodes())&&(priceE1.getAttribute("class").contains("roomType"))&&(priceE1.hasChildNodes()))
							{
								DomElement priceE2=priceE1.getLastElementChild();
								if((priceE2!=null)&&(priceE2.hasChildNodes()))
								{
									Iterator<DomElement> roomItr =priceE2.getChildElements().iterator();

									while(roomItr.hasNext())
									{
										DomElement roomE=roomItr.next();
										if((roomE.getTagName().contains("a")&&(roomE.hasChildNodes())))
										{
											DomElement roomPicE=roomE.getFirstElementChild();
											if(roomPicE.getTagName().contains("img"))
											{
												String src = roomPicE.getAttribute("src");
												System.out.println("src "+src);
											}
										}

										if((roomE.getTagName().contains("span")&&(roomE.hasChildNodes())))
										{
											Iterator<DomElement> typeItr=roomE.getChildElements().iterator();
											while(typeItr.hasNext())
											{
												DomElement typeE = typeItr.next();
												if((typeE!=null)&&(typeE.getTagName().equals("a")))
												{
													String roomType=typeE.asText().trim();
													System.out.println("roomType "+roomType);
													roomTypeList.add(roomType);
												}

												if((typeE!=null)&&(typeE.getTagName().contains("span"))&&(typeE.hasChildNodes()))
												{
													Iterator<DomElement> typeEItr=typeE.getChildElements().iterator();
													while(typeEItr.hasNext())
													{
														String facility=typeEItr.next().asText().trim();
														System.out.println("facility "+facility);
													}	
												}	
											}
										}
									}
								}	
							}//end of room type if
						}//end of inner while loop
					}

					int numberofSubtypes = 0;
					
					if((priceE!=null)&&(priceE.hasChildNodes())&&((priceE.getAttribute("class").contains("room_loop_counter1"))
							||(priceE.getAttribute("class").contains("room_loop_counter2"))
							||(priceE.getAttribute("class").contains("room_loop_counter3"))
							||(priceE.getAttribute("class").contains("room_loop_counter4")||(priceE.getAttribute("class").contains("room_loop_counter5"))))){
						
						DomElement priceE1=priceE.getLastElementChild();
						if((priceE1!=null)
								&&(priceE1.hasChildNodes())
								&&((priceE1.getAttribute("class").contains("roomMultiRoomPrice bb smart_deal"))
										||(priceE1.getAttribute("class").contains("roomMultiRoomPrice bb"))
										||(priceE1.getAttribute("class").contains("roomMultiRoomPrice")))&&(priceE1.hasChildNodes())){
							numberofSubtypes++;
							String price = priceE1.getFirstElementChild().getFirstElementChild().getLastElementChild().asText().trim();
							System.out.println("price "+price);
							priceList.add(price);
							//break;
						}
						numberofSubtypesList.add(numberofSubtypes);
					}
				}//end of main while loop	
			}
			
			System.out.println("x");
			
			String source = "Bookingdotcom";
			String city = "New Delhi";
			String country = "India";
			String name = "The Leela Palace New Delhi";
			String checkinDate = "2014-05-30";
			String checkoutDate = "2014-05-31";
			
			BookingdotComPriceDto bookingdotcompriceDto = new BookingdotComPriceDto();
			
			bookingdotcompriceDto.setSource(source);
			bookingdotcompriceDto.setCity(city.toUpperCase());
			bookingdotcompriceDto.setCountry(country.toUpperCase());
			bookingdotcompriceDto.setName(name.toUpperCase());
			bookingdotcompriceDto.setRoomType(roomTypeList);
			bookingdotcompriceDto.setNumberofSubtypes(numberofSubtypesList);
			bookingdotcompriceDto.setPrice(priceList);
			bookingdotcompriceDto.setConditions(conditionsList);
			bookingdotcompriceDto.setMaxCapacity(maxCapacityList);
			bookingdotcompriceDto.setCheckinDate(checkinDate);
			bookingdotcompriceDto.setCheckoutDate(checkoutDate);
			
			System.out.println(checkoutDate);
			
			TransferDataBookingdotcomPrice.transferData(bookingdotcompriceDto);
			
		}
		catch(Exception e)
		{
			System.out.println("Exception Occured. Adding to exceptionUrls");
			System.out.println(e);
			System.out.println(e.getMessage());
			exceptionUrls+=url+"\n";
			exceptionMsg+=e+"\n";
		}

		FileOutputStream exception=new FileOutputStream(exceptionFile);
		FileOutputStream exceptionmsg=new FileOutputStream(exceptionmsgFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(exception);
		PrintStream e1=new PrintStream(exceptionmsg);
		e.println(exceptionUrls);
		e1.println(exceptionMsg);
		e.close();
		e1.close();

	}
	
	public static void main(String args[])throws Exception
	{
		Scanner in = new Scanner(new File(linksFile));
		in.useDelimiter("\n");
		
		while(in.hasNext())
		{
			String bkdcurl=in.next();
			if(bkdcurl.indexOf("&&&")!=-1)
			{
			String parts[]=bkdcurl.split("&&&");
			String country=parts[0];
			String city = parts[1];
			String locality = parts[2];
			String link = parts[3];
			//System.out.println(country+city+locality+link);

			//now extract the data with updated link
			BKDCURL bookingLink = new BKDCURL();
			bookingLink.country=country;
			bookingLink.city=city;
			bookingLink.locality=locality;
			bookingLink.link=UrlBuilder.updateUrl(link);//update for current date.Otherwise link might have expired
			
			//System.out.println(bookingLink.link);
			ExtractData.getData(bookingLink);
			
			}	
		}	
	}	
}