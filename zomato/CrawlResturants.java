package com.zomato;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Iterator;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * Crawls the zomato resturants
 * @author rajat
 *
 */

public class CrawlResturants {
	
	public void submittingForm() throws Exception {
	
	DomElement resturantDetails, resturantData, resturntdetail;
		
	final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
	
	//Set the URL of the page
	URL url = new URL("http://www.zomato.com/bangalore/directory/restaurants-a-1");
	WebRequest request = new WebRequest(url);
    
	//Read the whole page
	HtmlPage page = webClient.getPage(request);
	
	
	List<DomElement> table = (List<DomElement>)page.getByXPath("//div[@id='mainframe']");
    DomElement mainarea = table.get(0);
    //System.out.println(mainarea);
    
   //DomElement submain = table.getFirstElementChild();
    //System.out.println(submain);
    
    //Get list of all resturants Details
    Iterable<DomElement> resturantsIterable = mainarea.getChildElements();
    
    //Iterate through all elements
    Iterator<DomElement> resturantsIterator = resturantsIterable.iterator();
    
    //skip the first child as it is not restutant
    if(resturantsIterator.hasNext())
    {
    	resturantDetails = resturantsIterator.next();
    }    
    while(resturantsIterator.hasNext())
    {
    	resturantDetails = resturantsIterator.next();
    	DomElement singleResturant = resturantDetails.getFirstElementChild().getFirstElementChild();
    	
    	//System.out.println(singleResturant);
    	if(singleResturant==null)
    	{
    		break;//avoids null pointer exception
    	}
    	DomElement link=singleResturant.getFirstElementChild();
    	String title=link.getAttribute("title");
    	String href=link.getAttribute("href");
    	//resturantData(href);
    	URL urlToResturant = new URL(href);
    	resturantData(urlToResturant);
    	System.out.println(urlToResturant);
    }
    
}
	
	public void resturantData(URL url) throws Exception
	{
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		
		//Set the URL of the page
		//URL url = new URL("http://www.zomato.com/bangalore/a2b-veg-hsr");
		WebRequest request = new WebRequest(url);
	    
		//Read the whole page
		HtmlPage page = webClient.getPage(request);
		
		List<DomElement> addressElement = (List<DomElement>)page.getByXPath("//div[@class='grid_14 column omega']");
		List<DomElement> ratingElement	= (List<DomElement>)page.getByXPath("//div[@class='res-rating clearfix']");
		List<DomElement> phoneElement 	= (List<DomElement>)page.getByXPath("//div[@id='phoneNoString']");
		List<DomElement> infoElement 	= (List<DomElement>)page.getByXPath("//div[@class='ipadding info-tab']");
		List<DomElement> statsElement 	= (List<DomElement>) page.getByXPath("//div[@class='resStats']");
		
		//Get the address
		 DomElement addressArea = addressElement.get(0);
		 String title = addressArea.getFirstElementChild().asText();
		 System.out.println("title: "+title);
		 String address = (String) addressArea.getFirstElementChild().getNextElementSibling().asText();
		 
		 System.out.println("address: "+address);
		 
		//get the rating and value
		 DomElement ratingArea = ratingElement.get(0);
		 String rating=ratingArea.getFirstElementChild().asText();
		 String value =ratingArea.getFirstElementChild().getNextElementSibling().getFirstElementChild().getFirstElementChild().asText();
		 
		 System.out.println("rating: "+rating);
		 System.out.println("value: "+value);
		  
		 //get the phone no
		 DomElement phoneArea = phoneElement.get(0);
		 String phoneNo = phoneArea.getFirstElementChild().getFirstElementChild().getFirstElementChild().asText();
		 System.out.println("phoneNo "+phoneNo);
		 		 
		 //get other info	 
		 DomElement infoArea=infoElement.get(0); 
		 Iterable<DomElement> infoIterable = infoArea.getChildElements(); 
		 
		 //Iterate through all elements
		 Iterator<DomElement> infoIterator = infoIterable.iterator();
		 DomElement highlightsArea= infoIterator.next();
		 DomElement cuisineArea = infoIterator.next();
		 DomElement openingHoursArea = infoIterator.next();
		 DomElement costArea = infoIterator.next();
		 DomElement photosArea = infoIterator.next();
		 
		 //Resturants highlights area
		 String highlight=highlightsArea.getLastElementChild().asText();
		 
		 String highlgts[]=highlight.split("\n");
		 for(int i=1;i<highlgts.length;i++)
		 {
		 System.out.println("highlights: "+highlgts[i]);
		 }
		 
		 //cuisine area
		 String cuisine= cuisineArea.getLastElementChild().getFirstElementChild().getFirstElementChild().getLastElementChild().asText();
		 System.out.println("cusine: "+cuisine);
		 
		 //openinghours area
		 String openingHours = openingHoursArea.getLastElementChild().getFirstElementChild().getLastElementChild().asText();
		 System.out.println("openingHours: "+openingHours);
		 
		 //cost area
		 String cost = costArea.getLastElementChild().getLastElementChild().getPreviousElementSibling().getPreviousElementSibling().asText();
		 System.out.println("cost: "+cost);
		 
		 //photo area
		 List<DomElement> photoAreaElement =(List<DomElement>) photosArea.getByXPath("//div[@class='res-photo-thumbnails']");
		 Iterator<DomElement> photoIterator=photoAreaElement.get(0).getChildElements().iterator();
		 
		 while(photoIterator.hasNext())
		 {
			 try{
				 String photoLink=photoIterator.next().getFirstElementChild().getAttribute("src");
				 System.out.println("photoLinks: "+photoLink);
			 	}
			 catch(Exception e){}		   
		 }

		//stats Area
		 String stats[]=statsElement.get(0).asText().split("\n");
		 System.out.println(stats[0]);
	}
	
	 public static void main(String[] args) throws Exception {
		 CrawlResturants htmlUnit = new  CrawlResturants();
	        htmlUnit.submittingForm();
		 //htmlUnit.resturantData();
	    }
}