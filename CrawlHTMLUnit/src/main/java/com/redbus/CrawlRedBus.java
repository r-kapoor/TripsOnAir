package com.redbus;

import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * Crawls redbus
 * SampleFlow:
 * 
 * 
 * @author rajat
 *
 */

public class CrawlRedBus extends HtmlUnitWebClient{

	@SuppressWarnings("unchecked")
	public void getCityLinks() throws Exception {

		//Set the URL of the page
		//URL url = new URL("http://www.redbus.in/bus-tickets/routes-directory");
		URL url = new URL("http://www.redbus.in/bus-tickets/ahmedabad-directory.aspx");
	    
		//Read the whole page
		HtmlPage page=WebClient(url);
		//System.out.println(page.asText());
		List<DomElement> routesElement = (List<DomElement>)page.getByXPath("//div[@id='ctl00_ctl00_ContentHolder_ContentHolder_divLinks']");
		
		Iterable<DomElement> routesChildElements =routesElement.get(0).getFirstElementChild().getChildElements();
		Iterator<DomElement> routesIterator = routesChildElements.iterator();
		
		//Iterator<DomElement> rowIterator = 
		while(routesIterator.hasNext())
		{
			//System.out.println(routesIterator.next());
			DomElement box=routesIterator.next();
			Iterator<DomElement> rowIterator =box.getChildElements().iterator();
			
			while(rowIterator.hasNext())
			{
				System.out.println(rowIterator.next().getFirstElementChild().getAttribute("href"));
			}
		}
}
	
	@SuppressWarnings("unchecked")
	public void getDetails() throws Exception{
		
		//Set the URL of the page
		URL url = new URL("http://www.redbus.in/bus-tickets/ahmedabad-adipur.aspx");
		
		//Read the whole page
		HtmlPage page=WebClient(url);

		List<DomElement> routesElement = (List<DomElement>)page.getByXPath("//div[@class='W30 Form TRC P20']");
		
		DomElement routesArea = routesElement.get(0);
		List<DomElement> source =(List<DomElement>) routesArea.getFirstElementChild().getByXPath("//input[@id='DDLSource']");
		List<DomElement> destination = (List<DomElement>)routesArea.getFirstElementChild().getNextElementSibling().getByXPath("//input[@id='DDLDestination']");
		
		String sourceName=source.get(0).getAttribute("value");
		String sourceId=source.get(0).getAttribute("name");
		String destName=destination.get(0).getAttribute("value");
		String destId = destination.get(0).getAttribute("name");
		
		System.out.println("value: "+sourceName);
		System.out.println("value: "+sourceId);
		System.out.println("value2:"+destName);
		System.out.println("value2:"+destId);
		
		//call the urlBuilder
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		//get current date time with Date()
		Date date = new Date();
		
		for(int i=0;i<100;i++)
		{
			date = addDays(date,1);
			String appendDate = dateFormat.format(date);
			UrlBuilder urlbuilder = new UrlBuilder();
			URL orgUrl=urlbuilder.urlBuilder(sourceName, sourceId, destName, destId,appendDate);
			URL revUrl=urlbuilder.urlBuilder(sourceName, destName,sourceId, destId,appendDate);
		}
	}
	
	public static Date addDays(Date date, int days)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        return cal.getTime();
    }
	
	public static void main(String[] args) throws Exception {
		 CrawlRedBus htmlUnit = new  CrawlRedBus();
		 htmlUnit.getDetails();
	    }
}
