package com.makemytrip;

import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNode;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.javascript.host.Screen;

public class Hotels {

    @Test
    public void homePage() throws Exception {
    	
    	//Declarations
    	int count=0;
    	final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
    	webClient.getOptions().setThrowExceptionOnScriptError(false);
    	
    	//Set the URL of the page
    	URL url = new URL("http://hotel.makemytrip.com/makemytrip/site/hotels/search?city=BLR&country=IN&checkin=05242014&checkout=05262014&area=&roomStayQualifier=1e0e&type=&sortName=");
        
        //Read the whole page
        final HtmlPage page = webClient.getPage(url);
        
        //Storing title of page
        String title = page.getTitleText();
        
        System.out.println("Title:"+title);
        
        //Getting the results
        //DomElement hotelresults = page.getElementById("results");
        DomElement allhotel = page.getElementById("listing_details");
        Iterable<DomElement> hotellist = allhotel.getChildElements();
        Iterator<DomElement> hoteliterator = hotellist.iterator();
        while(hoteliterator.hasNext())
        {
        	count++;
        	DomElement hotel = hoteliterator.next();
        	if(!hotel.getAttribute("class").matches(".*listing_section.*"))
        	{
        		continue;
        	}
        	DomElement hotelalldetails = hotel.getFirstElementChild();
        	DomElement hotelimg = hotelalldetails.getFirstElementChild();
        	DomElement imgurl = hotelimg.getFirstElementChild();
        	String imgsrc = imgurl.getAttribute("src");
        	
        	DomElement hoteltextdetails = hotelimg.getNextElementSibling();
        	DomElement nonpricedetails = hoteltextdetails.getFirstElementChild();
        	DomElement nameandstar = nonpricedetails.getFirstElementChild();
        	DomElement nameE = nameandstar.getFirstElementChild();
        	String name = nameE.getAttribute("title");
        	String link = "http://hotel.makemytrip.com/" + nameE.getAttribute("href");
        	
        	String star="unknown";
        	DomElement starE = nameE.getNextElementSibling();
        	if(starE.getAttribute("class").matches("default_star flL"))
        	{
        		star = starE.getFirstElementChild().getAttribute("title");
        		star = star.substring(0, star.indexOf("star")).trim();
        	}
        	
        	URL hotelurl = new URL(link);
        	
        	HtmlPage hotelpage = webClient.getPage(hotelurl);
        	
        	DomElement completepage = hotelpage.getElementById("detailPageViaAjax");
        	DomElement hotelhead = completepage.getFirstElementChild();
        	System.out.println(hotelhead.getAttribute("class"));
        	DomElement hotelheading = hotelhead.getFirstElementChild();
        	System.out.println(hotelheading.getAttribute("class"));
        	DomElement leftarea = hotelheading.getFirstElementChild();
        	System.out.println(leftarea.getAttribute("class"));
        	DomElement hotelname = leftarea.getFirstElementChild();
        	DomElement addressE = hotelname.getElementsByTagName("p").get(0);
        	String address = addressE.getTextContent().trim().replaceAll("\\s+", " ");
        	
        	DomElement rightarea = leftarea.getNextElementSibling();
        	DomElement pricearea = rightarea.getFirstElementChild();
        	DomElement priceE = pricearea.getFirstByXPath("//span[@class='price']");
        	String price = priceE.getTextContent();
        	
        	DomElement ratingarea = rightarea.getNextElementSibling();
        	DomElement tripadvisor = ratingarea.getFirstByXPath("//span[@class='triper_rate flL']");
        	DomElement makemytrip = ratingarea.getFirstByXPath("//span[@class='triper_rate noBg green flL']");
        	String tripadvisorrating = tripadvisor.asText();
        	String makemytriprating = makemytrip.asText();
        	
        	DomElement services = completepage.getFirstByXPath("//div[@class='view_services clearFix']");
        	Iterator<DomElement> allservices = services.getChildElements().iterator();
        	String internet = "unknown", pool = "unknown", spa="unknown", restaurant = "unknown", transfers = "unknown", gym= "unknown", parking= "unknown", business= "unknown", temp1="", temp2="";
        	for(int i=0;i<4;i++)
        	{
        		DomElement servtwo = allservices.next();
        		DomElement serv1 = servtwo.getFirstElementChild();
        		if(serv1.getFirstElementChild().getAttribute("class").matches(".*right.*"))
        		{
        			temp1 = "Yes";
        		}
        		else if(serv1.getFirstElementChild().getAttribute("class").matches(".*wrong.*"))
        		{
        			temp1 = "No";
        		}
        		DomElement serv2 = serv1.getNextElementSibling();
        		if(serv2.getFirstElementChild().getAttribute("class").matches(".*right.*"))
        		{
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
        	
        	System.out.println("\nHotel:"+count);
        	System.out.println("Name:"+name);
        	System.out.println("Img Src:"+imgsrc);
        	System.out.println("Link:"+link);
        	System.out.println("Star:"+star);
        	System.out.println("Address:"+address);
        	System.out.println("Price:"+price);
        	System.out.println("TripAdvisor Rating:"+tripadvisorrating);
        	System.out.println("MakeMyTrip Rating:"+makemytriprating);
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
        	}
        	//System.out.println("Name:"+name);
        	if(count==4)
        	{
        		System.out.println("Success!!");
        		break;
        	}
        	
        }
        

        webClient.closeAllWindows();
    }

    public static void main(String[] args) throws Exception {
        Hotels htmlUnit = new  Hotels();
        htmlUnit.homePage();
    }
}