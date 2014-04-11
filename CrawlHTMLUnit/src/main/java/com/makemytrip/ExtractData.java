package com.makemytrip;


import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class ExtractData {

	@SuppressWarnings("unchecked")
	public static void extractData() throws Exception{

		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
    	webClient.getOptions().setThrowExceptionOnScriptError(false);
    	
    	String link = "http://hotel.makemytrip.com/makemytrip/site/hotels/detail?session_cId=1396807462390&city=BLR&country=IN&checkin=05242014&checkout=05262014&searchText=The%20Infantry%20Hotel,Bangalore&region=&area=&roomStayQualifier=1e0e&hotelId=200701121818468835&i=19&p=1";
		URL hotelurl = new URL(link);
    	
    	HtmlPage hotelpage = webClient.getPage(hotelurl);
    	System.out.println(hotelpage);
    	List<DomElement> hotelArea = (List<DomElement>) hotelpage.getByXPath("//div[@id='detailPageViaAjax']");
    	DomElement completepage=hotelArea.get(0);
//System.out.println(completepage);
    	if((completepage!=null)&&(completepage.hasChildNodes()))
    	{
    		String address="unknown",price="unknown",tripadvisorrating="unknown",makemytriprating="unknown";
    		DomElement hotelhead = completepage.getFirstElementChild();

    		if((hotelhead!=null)&&(hotelhead.hasChildNodes()))
    		{
    			DomElement hotelheading = hotelhead.getFirstElementChild();
    			System.out.println("heading "+hotelheading);
    			if((hotelheading!=null)&&(hotelheading.hasChildNodes()))
    			{
    				DomElement leftarea = hotelheading.getFirstElementChild();
    				DomElement hotelname = leftarea.getFirstElementChild();
    				if(hotelname!=null){
    					DomElement addressE = hotelname.getElementsByTagName("p").get(0);
    					if(addressE!=null){
    						address = addressE.getTextContent().trim().replaceAll("\\s+", " ");
    					}
    				}
    				DomElement rightarea = leftarea.getNextElementSibling();
    				DomElement pricearea = rightarea.getFirstElementChild();
    				DomElement priceE = pricearea.getFirstByXPath("//span[@class='price']");
    					price = priceE.getTextContent();
    					
    				DomElement ratingarea = rightarea.getNextElementSibling();
    				DomElement tripadvisor = ratingarea.getFirstByXPath("//span[@class='triper_rate flL']");
    				DomElement makemytrip = ratingarea.getFirstByXPath("//span[@class='triper_rate noBg green flL']");
    					tripadvisorrating = tripadvisor.asText();
    					makemytriprating = makemytrip.asText();
    					System.out.println(makemytriprating);
    			}
    		}
    	}
    	

    	/*List<DomElement> servicesArea = (List<DomElement>) hotelpage.getByXPath("//div[@class='hotel_service flL']");
    	DomElement services = servicesArea.get(0).getFirstElementChild();
    	System.out.println("services"+services);
    	//DomElement services = completepage.getFirstByXPath("//div[@class='view_services clearFix']");
		Iterator<DomElement> allservices = services.getChildElements().iterator();
		String internet = "unknown", pool = "unknown", spa="unknown", restaurant = "unknown", transfers = "unknown", gym= "unknown", parking= "unknown", business= "unknown", temp1="", temp2="";
		for(int i=0;i<4;i++)
		{	System.out.println("test0");
			DomElement servtwo = allservices.next();
			DomElement serv1 = servtwo.getFirstElementChild();
			if(serv1.getFirstElementChild().getAttribute("class").matches(".*right.*"))
			{
				System.out.println("test1");
				temp1 = "Yes";
			}
			else if(serv1.getFirstElementChild().getAttribute("class").matches(".*wrong.*"))
			{System.out.println("test2");
				temp1 = "No";
			}
			DomElement serv2 = serv1.getNextElementSibling();
			if(serv2.getFirstElementChild().getAttribute("class").matches(".*right.*"))
			{System.out.println("test3");
			temp2 = "Yes";
			}
			else if(serv2.getFirstElementChild().getAttribute("class").matches(".*wrong.*"))
			{
				temp2 = "No";
			}
			switch (i) {
				case 0:
				internet = temp1;
				transfers = temp2;
				break;
				case 1:
				pool = temp1;
				gym = temp2;
				break;
				case 2:
				spa = temp1;
				parking = temp2;
				break;
			case 3:
				restaurant = temp1;
				business = temp2;
				break;
			default:
				break;
			}
}
				System.out.println("test4");
				DomElement roominfo = completepage.getFirstByXPath("//div[@id='roomInfo']");
				
				@SuppressWarnings("unchecked")
				List<DomElement> roomnames = (List<DomElement>) roominfo.getByXPath("//span[@class='flL size']");
				List<String> roomname = new ArrayList<String>();
				List<String> roomprice = new ArrayList<String>();
				for(int i=0; i<roomnames.size();i++)
				{
					DomElement roomnameE = roomnames.get(i);
					roomname.add(roomnameE.asText());
				}
				@SuppressWarnings("unchecked")
				List<DomElement> roomprices = (List<DomElement>) roominfo.getByXPath("//span[@class='price']");
				for(int i=0; i<roomprices.size();i++)
				{
					DomElement roompriceE = roomprices.get(i);
					roomprice.add(roompriceE.asText());
				}

				//System.out.println("\nHotel:"+count);
				//System.out.println("Name:"+name);
				//System.out.println("Img Src:"+imgsrc);
				System.out.println("Link:"+link);
				//System.out.println("Star:"+star);
				//System.out.println("Address:"+address);
				//System.out.println("Price:"+price);
				//System.out.println("TripAdvisor Rating:"+tripadvisorrating);
				//System.out.println("MakeMyTrip Rating:"+makemytriprating);
				System.out.println("Internet/Wifi:"+internet);
				System.out.println("Travel and Transfers:"+transfers);
				System.out.println("Swimming Pool:"+pool);
				System.out.println("Gym:"+gym);
				System.out.println("Spa/Wellness:"+spa);
				System.out.println("Parking:"+parking);
				System.out.println("Restaurant/Bar:"+restaurant);
				System.out.println("Business Facilities:"+business);
				for(int i=0;i<roomname.size() && i<roomprice.size(); i++)
				{
					System.out.println("Room:"+roomname.get(i)+" : "+roomprice.get(2*i+1));
				}*/
				//System.out.println("Name:"+name);
				/*if(count==4)
				{
					System.out.println("Success!!");
					//break;
				}*/
			}  	
}
