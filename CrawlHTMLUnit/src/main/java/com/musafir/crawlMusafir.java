package com.musafir;


import java.net.URL;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import org.junit.Test;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class crawlMusafir {

    @SuppressWarnings("unchecked")
	@Test
    public void submittingForm() throws Exception {
    	
    	//Declarations
    	String title,stopinfo="";
    	boolean thereis=false;
    	List<DomElement> prices;
    	String[] airline=new String[20];
    	String[] flightno=new String[20];
    	String[] connectpt=new String[20];
    	Arrays.fill(airline, "");
    	int in,in1,f=1;
    	DomElement flightDetails, flightData, flghtdetail;
    	
    	final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
    	
    	//Set the URL of the page
    	URL url = new URL("http://in.musafir.com/Trip/Flights.aspx?p=1&f=0&sd=20/03/14&o=BLR&d=GOI&ad=1&spid=3PQ5X&rii=0");
    	WebRequest request = new WebRequest(url);
        
    	//Read the whole page
    	HtmlPage page = webClient.getPage(request);
    	
        //Storing title of page
        title = page.getTitleText();
        
        //Getting to class 'listing flights'        
        @SuppressWarnings("unchecked")
		List<DomElement> table = (List<DomElement>) page.getByXPath("//table[@class='listing flights']");
        DomElement mainarea = table.get(0);
        
        //Getting to list (tbody) of prices of flights
        DomElement submain = mainarea.getFirstElementChild();
        
        //Get list of all Flight Details
        Iterable<DomElement> flightIterable = submain.getChildElements();
        
        //Iterate through all elements
        Iterator<DomElement> flightIterator = flightIterable.iterator();
		while(flightIterator.hasNext())
        {
        	//Get each row of flight details (tr)
        	flightDetails = flightIterator.next();
        	
        	//Get to td - Details of flight except prices
        	DomElement singleFlight = flightDetails.getFirstElementChild();
        	
        	//Get to the interior of the table
        	flghtdetail = singleFlight.getFirstElementChild().getFirstElementChild().getFirstElementChild();
        	
        	//Extract each detail according to the way it is stored
        	
        	//Extracting Airline, Flight No. and Stops
        	flightData = flghtdetail.getFirstElementChild();
        	DomElement airlinenflghtno = flightData.getFirstElementChild();
        	DomNodeList<HtmlElement> listairs = airlinenflghtno.getElementsByTagName("li");
        	ListIterator<HtmlElement> iterair = listairs.listIterator();
        	in=0;
        	Arrays.fill(airline, "");
        	Arrays.fill(flightno, "");
        	while(iterair.hasNext())
        	{
        		HtmlElement flight = iterair.next();
				HtmlElement flightt = flight.getElementsByTagName("p").get(0);
				airline[in] = flightt.getFirstChild().getTextContent().trim();
				DomNodeList<HtmlElement> flghtnolist = flightt.getElementsByTagName("em");
				ListIterator<HtmlElement> flghtnoit = flghtnolist.listIterator();
				while(flghtnoit.hasNext())
				{
					HtmlElement flghtno = flghtnoit.next();
					flightno[in] = flghtno.getTextContent().trim();
					if(in>0&&airline[in].isEmpty())
					{
						airline[in]=airline[in-1];
					}
					in++;
				}
        	}
        	DomElement stops = airlinenflghtno.getNextElementSibling();
        	int stoplines = stops.getChildElementCount();
        	
        	in1=0;
        	Arrays.fill(connectpt, "");
        	stopinfo="";
        	if(stoplines==0)
        	{
        		stopinfo = stops.getTextContent();
        	}
        	else
        	{
        		stopinfo = stops.getFirstChild().getTextContent();
        	}
        	thereis=false;
    		if(!stopinfo.isEmpty())
    		{
    			thereis = true;
    			if(stoplines>0)
            	{
                	in1=0;
                	if(stopinfo.contains("Connect"))
                	{
                		DomNodeList<HtmlElement> connects = stops.getElementsByTagName("em");
        				ListIterator<HtmlElement> connectit = connects.listIterator();
        				in1=0;
        				while(connectit.hasNext())
        				{
        					HtmlElement stoppoint = connectit.next();
        					connectpt[in1] = stoppoint.getTextContent().trim();
        					in1++;
        				}
                	}
            	}
    		}
    		
    		//Extracting Start Date
    		flightData = flightData.getNextElementSibling();
    		HtmlElement month = flightData.getElementsByTagName("dfn").get(0);
    		String startmonth = month.getTextContent();
    		HtmlElement date = flightData.getElementsByTagName("p").get(0);
    		String startdate = date.getTextContent();
    		
    		//Extracting Departure Time
    		flightData = flightData.getNextElementSibling();
    		HtmlElement deptime = flightData.getElementsByTagName("p").get(0);
    		String starttime = deptime.getTextContent();
    		
    		//Extracting Arrival Time
    		flightData = flightData.getNextElementSibling();
    		HtmlElement time1 = flightData.getElementsByTagName("p").get(0);
    		String endtime = time1.getTextContent();
    		if(flightData.getElementsByTagName("em").getLength()>0)
    		{
    			endtime+=" Next Day";
    		}
    		
    		//Extracting Duration
    		flightData = flightData.getNextElementSibling();
    		HtmlElement dur = flightData.getElementsByTagName("p").get(0);
    		String duration = dur.getTextContent();
    		
    		//Extracting Price
    		
    		
    		
    		System.out.println("Flight:"+f++);
        	for(int i=0;i<in;i++)
        	{
        		System.out.println("Airline:"+airline[i]);
        		System.out.println("Flight No.:"+flightno[i]);
        	}
        	
        	if(thereis)
        	{
        		System.out.println("Stop Info:"+stopinfo);
        	}
        	if(stoplines>0)
        	{
            	for(int i=0;i<in1;i++)
            	{
            		System.out.println("Connects In:"+connectpt[i]);
            	}
        	}
        	System.out.println("Start Date:"+startdate+" "+startmonth);
        	System.out.println("Departure Time:"+starttime);
        	System.out.println("Arrival Time:"+endtime);
        	System.out.println("Duration:"+duration);
        	
        	DomElement priceDetails = singleFlight.getNextElementSibling();
        	//prices = (List<DomElement>) priceDetails.getByXPath("//span[@class='net']");
        	//System.out.println(prices.size());
        	//String price = prices.get(0).getTextContent();
        	
        	String price = priceDetails.getLastElementChild().getFirstElementChild().getFirstElementChild().getTextContent();
        	System.out.println("Price:"+price);
      	
        	
        	
        }
        
        webClient.closeAllWindows();
    }

    public static void main(String[] args) throws Exception {
        crawlMusafir htmlUnit = new  crawlMusafir();
        htmlUnit.submittingForm();
    }
}