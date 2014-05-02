package com.redbus;

import java.net.URL;
import java.util.Iterator;
import java.util.List;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * 
 * Crawls the main link of redBus
 * Sample Url to crawl : http://www.redbus.in/Booking/SelectBus.aspx?fromCityId=551&toCityId=1167&doj=31-Mar-2014&busType=Any&opId=0
 * @author rajat
 *
 */


public class ExtractData extends HtmlUnitWebClient{

	@SuppressWarnings("unchecked")
	public void getData() throws Exception {
	
		//set default value of variables
		
		String busName="unknown",busType="unknown",depTime="unknown",arrTime="unknown",duration="unknown",rating="unknown",ratingText="unknown",fare="unknown";
		
		//Set the URL of the page
		URL url = new URL("http://www.redbus.in/Booking/SelectBus.aspx?fromCityId=122&fromCityName=Bangalore&toCityId=124&toCityName=Hyderabad&doj=30-May-2014");
		
		HtmlPage page=WebClient(url);

		List <DomElement> routesList = (List<DomElement>)page.getByXPath("//div[@id='onwardTrip']");
		DomElement routesElement=routesList.get(0).getFirstElementChild();
		
		if((routesElement!=null)&&(routesElement.hasChildNodes())){

		Iterable<DomElement> routesChildElements =routesElement.getChildElements();
		Iterator<DomElement> routesIterator = routesChildElements.iterator();
	
		//iterate over ul childs
		while(routesIterator.hasNext()){
		
		DomElement routesChildE=routesIterator.next();//li
		
			
		if((routesChildE!=null)&&(routesChildE.hasChildNodes())){
			
			DomElement busItem=routesChildE.getFirstElementChild();//class=busItem clearfix
			
			if((busItem!=null)&&(busItem.hasChildNodes())){
			
			Iterator<DomElement> busItemItr = busItem.getChildElements().iterator();
			
			while(busItemItr.hasNext())//Iterate over busItem
			{
				DomElement Item=busItemItr.next();
				
				if((Item!=null))
				{
					String divClass=Item.getAttribute("class");
					
					if(divClass.contains("detailsBlock busDataBlock")&&(Item.hasChildNodes()))
					{
						//System.out.println("test "+Item.asText());
						//BUS Details
						Iterator<DomElement> detailsItr =Item.getChildElements().iterator();
						while(detailsItr.hasNext())
						{
							DomElement detailsE=detailsItr.next();
							if((detailsE!=null))
							{
								String detailsClass=detailsE.getAttribute("class");
								
								if(detailsClass.contains("BusName"))
								{
									busName=detailsE.asText().trim();	
								}
								
								if(detailsClass.contains("BusType"))
								{
									busType=detailsE.asText();	
								}
							}
						}
					}
					
					else if(divClass.contains("timeBlock busDataBlock"))
					{
						//Timing						
						if(Item.hasChildNodes())
						{
							Iterator<DomElement> timeItr=  Item.getChildElements().iterator();
							while(timeItr.hasNext())
							{
								DomElement timeE=timeItr.next();//div
								if((timeE!=null)&&(timeE.hasChildNodes()))
								{
									Iterator<DomElement> timeTypeItr=timeE.getChildElements().iterator();
									while(timeTypeItr.hasNext())
									{
										DomElement timeTypeE= timeTypeItr.next();
										
										if((timeTypeE!=null))
										{
											String type=timeTypeE.getAttribute("class");
											if(type.contains("DepartureTime"))
											{
												depTime=timeTypeE.asText();
												break;
											}

											if(type.contains("ArrivalTime"))
											{
												arrTime=timeTypeE.asText();
												break;
											}
											
											if(type.contains("Duration"))
											{
												duration=timeTypeE.asText();
												break;
											}
										}
									}
								}
							}
						}
					}
					
					else if(divClass.contains("ratingsBlock busDataBlock"))
					{
						//ratingsBlock
						if(Item.hasChildNodes()){
						rating = Item.getFirstElementChild().getAttribute("title");
						ratingText = Item.asText().trim();
						}
					}
					
					else if(divClass.contains("fareBlock busDataBlock"))
					{
						if((Item.hasChildNodes())){
							DomElement fareE= Item.getFirstElementChild();//.asText();
							if((fareE!=null)&&(fareE.getTagName().contains("span"))&&(fareE.getAttribute("class").contains("fareSpan"))){
								fare=fareE.asText().trim();
							}
						}
					}
				}
			}
		}
	}
}
}//end of first if
		
		System.out.println("name "+busName);
		System.out.println("type "+busType);//there is an issue with type
		System.out.println("depTime: "+depTime);
		System.out.println("arrTime: "+arrTime);
		System.out.println("duration: "+duration);
		System.out.println("rating "+rating);
		System.out.println("ratingText: "+ratingText);
		System.out.println("fare "+fare);
		
		
}
	
	public static void main(String[] args) throws Exception {
		 ExtractData htmlUnit = new  ExtractData();
	        htmlUnit.getData();
		 //htmlUnit.getDetails();
	    }
}
