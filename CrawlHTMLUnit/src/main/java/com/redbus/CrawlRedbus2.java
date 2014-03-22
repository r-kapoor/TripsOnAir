package com.redbus;

import java.net.URL;
import java.util.Iterator;
import java.util.List;

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


public class CrawlRedbus2 {

	public void submittingForm() throws Exception {
	
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		//Handels javaScript Exception
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		
		//Set the URL of the page
		URL url = new URL("http://www.redbus.in/Booking/SelectBus.aspx?fromCityId=551&toCityId=1167&doj=31-Mar-2014&busType=Any&opId=0");
		WebRequest request = new WebRequest(url);
    
		//Read the whole page
		HtmlPage page = webClient.getPage(request);
		//System.out.println(page.asText());
		List<DomElement> routesElement = (List<DomElement>)page.getByXPath("//ul[@class='BusList']");
		
		Iterable<DomElement> routesChildElements =routesElement.get(0).getChildElements();
		Iterator<DomElement> routesIterator = routesChildElements.iterator();
	
		while(routesIterator.hasNext()){
		
		Iterator<DomElement> routesChildIterator=routesIterator.next().getChildElements().iterator();
			
		//skip the first element
		DomElement skip1 = routesChildIterator.next();
		
		//Iterator<DomElement> rowIterator = 
		
			DomElement detailsBlock =routesChildIterator.next();
			//skip the third element	
			DomElement skip3 = routesChildIterator.next();
			DomElement timeBlock = routesChildIterator.next();
			DomElement seatsBlock = routesChildIterator.next();
			DomElement ratingsBlock = routesChildIterator.next();
			//skip the 7th Element
			DomElement skip7 = routesChildIterator.next();
			DomElement fareBlock = routesChildIterator.next();
			
			//BUS Details
			String busDetails[] = detailsBlock.asText().split("\n");
			String busName = busDetails[0];
			String busType = busDetails[1];
			System.out.println("busName: "+busName);
			System.out.println("busType: "+busType);
			
			//Timing
			String Timing[] = timeBlock.asText().split("\n");
			String depTime = Timing[0];
			String arrTime = Timing[1];
			String duration = Timing[2];
			System.out.println("depTime: "+depTime);
			System.out.println("arrTime: "+arrTime);
			System.out.println("duration: "+duration);
			
			//Seats Available
			
			// Should be check real time through cross Domain Communication
			
			//ratingsBlock
			String ratings = ratingsBlock.getFirstElementChild().getAttribute("title");
			System.out.print("rating: "+ratings);
		}
	}
	
	public static void main(String[] args) throws Exception {
		 CrawlRedbus2 htmlUnit = new  CrawlRedbus2();
	        htmlUnit.submittingForm();
		 //htmlUnit.getDetails();
	    }
}
