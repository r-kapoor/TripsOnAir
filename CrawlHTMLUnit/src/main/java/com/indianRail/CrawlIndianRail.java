package com.indianRail;

import java.net.URL;
import java.util.Iterator;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * Crawl railways data from cleartrip
 * @author rajat
 *
 */


public class CrawlIndianRail {

	public void submittingForm() throws Exception {
			
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		DomElement trainNoDetails;
		
		//Set the URL of the page
		for(int i=1;i<=5;i++){
		URL url = new URL("https://www.cleartrip.com/trains/list?page="+i);
		WebRequest request = new WebRequest(url);
	    
		//Read the whole page
		HtmlPage page = webClient.getPage(request);
		//System.out.println("Test: "+page.asText());
		
		List<DomElement> table = (List<DomElement>)page.getByXPath("//table[@class='results']");
	    DomElement mainarea = table.get(0);
	    Iterable<DomElement> TrainDetails =mainarea.getFirstElementChild().getNextElementSibling().getChildElements();
	    Iterator<DomElement> TrainDetailsIterator = TrainDetails.iterator();
		while(TrainDetailsIterator.hasNext())
        {
        	//Get each row of TrainDetails (tr)
			trainNoDetails = TrainDetailsIterator.next();
        	
        	//Get to td - Details of flight except prices
        	String TrainNo = trainNoDetails.getFirstElementChild().asText();
        	URL detailsUrl  = new URL("https://www.cleartrip.com/trains/"+TrainNo);
        	System.out.println("detailsUrl: "+detailsUrl);
        	//getDetails(detailsUrl);
        }
	}
}
	public void getDetails(URL url) throws Exception {
		
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		DomElement way2go;
		
		//Set the URL of the page
		//URL url = new URL("https://www.cleartrip.com/trains/12723");
		WebRequest request = new WebRequest(url);
	    
		//Read the whole page
		HtmlPage page = webClient.getPage(request);
		//System.out.println("Test: "+page.asText());
		
		List<DomElement> trainDetails = (List<DomElement>)page.getByXPath("//div[@class='trainDetails']");
	    DomElement mainarea = trainDetails.get(0);
	    DomElement basicDetails= mainarea.getFirstElementChild();
	    DomElement path=mainarea.getLastElementChild();
	    
	    
	    String basicDetail[]= basicDetails.getFirstElementChild().asText().split("\n");
	    
	    String name=basicDetail[0];
	    String Starts = basicDetail[1].replace("Starts ","");
	    String ends = basicDetail[2].replace("Ends ","");
	    String days = basicDetail[3].replace("Days ","");
	    String pantry = basicDetail[4].replace("Pantry ","");
	    /*for(int i=0;i<basicDetail.length;i++){
		    System.out.println("Details :"+basicDetail[i]);
		    }*/
	    
	    System.out.println("name: "+name);
	    System.out.println("Starts: "+Starts);
	    System.out.println("ends: "+ends);
	    System.out.println("days: "+days);
	    System.out.println("pantry: "+pantry);						
	    						
	    
	    Iterable<DomElement> pathDetails=path.getFirstElementChild().getFirstElementChild().getChildElements();
	    Iterator<DomElement> pathDetailsIterator = pathDetails.iterator();
	    while(pathDetailsIterator.hasNext())
        {
        	//Get each row of TrainDetails (tr)
			way2go = pathDetailsIterator.next();
			System.out.println("\npath2go: ");
        	//Get to all tds
			Iterator<DomElement> way2goIterator=way2go.getChildElements().iterator();
        	while(way2goIterator.hasNext())
        	{
        		System.out.println(way2goIterator.next().asText());
        	}

        }
	    
	}
	
	public static void main(String[] args) throws Exception {
		CrawlIndianRail htmlUnit = new  CrawlIndianRail();
	       htmlUnit.submittingForm();
		 //htmlUnit.getDetails();
	    }
	
}