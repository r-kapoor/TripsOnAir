package com.bookingdotcom;

import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * 
 * @author rajat
 *
 */

public class ExtractData extends HtmlUnitWebClient{

	public static void getData()throws Exception
	{
		URL url = new URL("http://www.booking.com/hotel/in/krishna.en-us.html?sid=6b4a0f8b7d12fca42a71b2ab3b4ec786;dcid=1;checkin=2014-04-30;checkout=2014-05-01;ucfs=1;srfid=4049c11ea2b39a0da9255e13eea532ade552499dX43http://www.booking.com/hotel/in/krishna.en-us.html?sid=6b4a0f8b7d12fca42a71b2ab3b4ec786;dcid=1;checkin=2014-04-30;checkout=2014-05-01;ucfs=1;srfid=4049c11ea2b39a0da9255e13eea532ade552499dX43");
		HtmlPage page=WebClient(url);
		
		String Title="unknown",address="unknown",rating="unknown",desciption="unknown",checkIn="unknown",checkOut="unknown";
		String Bedroom="unknown",Outdoors="unknown",Activities="unknown",Living_Area="unknown",Media="unknown",Food="unknown",Internet="unknown",Parking="unknown",Services="unknown",General="unknown",Languages="unknown";
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
			desciption = desciptionArea.asText().trim();
			
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
		
		System.out.println(Title);
		System.out.println(address);
		System.out.println(rating);
		for(int i=0;i<photoList.size();i++)
		{
			System.out.println(photoList.get(i));
		}
		
		DomElement priceArea = page.getFirstByXPath("//tbody[@id='room_availability_container']");
		
		if((priceArea!=null)&&(priceArea.hasChildNodes()))
		{
			Iterator<DomElement> priceItr= priceArea.getChildElements().iterator();
			while(priceItr.hasNext())
			{
				DomElement priceE=priceItr.next();
				if((priceE.hasAttribute("class"))&&(priceE.getAttribute("class").contains("room_loop_counter1 maintr"))&&(priceE.hasChildNodes()))
				{
					DomElement priceE1=priceE.getFirstElementChild();
					if((priceE1!=null)&&(priceE1.hasChildNodes()))
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
										System.out.println(src);
									}
								}
								
								if((roomE.getTagName().contains("span")&&(roomE.hasChildNodes())))
								{
									Iterator<DomElement> typeItr=roomE.getChildElements().iterator();
									while(typeItr.hasNext())
									{
										
									}
									
								}
								
								if(roomE.getTagName().contains("div"))
								{
									
								}
							}
						}
						
					}
					
					
				}
			}
			
		}
		
		
		
		System.out.println(desciption);
		System.out.println(Bedroom);
		System.out.println(Outdoors);
		System.out.println(Activities);
		System.out.println(Living_Area);
		System.out.println(Media);
		System.out.println(Food);
		System.out.println(Internet);
		System.out.println(Parking);
		System.out.println(Services);
		System.out.println(General);
		System.out.println(Languages);
		System.out.println(checkIn);
		System.out.println(checkOut);
	}
}
