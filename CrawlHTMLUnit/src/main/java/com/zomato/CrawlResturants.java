package com.zomato;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * @author rajat
 * Crawls the zomato resturants
 * Sample CityResturantsUrl:"http://www.zomato.com/bangalore/directory/restaurants-a-1"
 * Sample ResturantUrl:"http://www.zomato.com/bangalore/anjappar-koramangala"
 * Get the data from the ResturantUrl
 */

public class CrawlResturants extends HtmlUnitWebClient{
	
	private static ArrayList<zmtURL> cityRestsUrls= new ArrayList<zmtURL>();
	private static ArrayList<zmtURL> ResturantUrls = new ArrayList<zmtURL>();
	private static String exceptionUrls = "";
	private static String exceptionMsg = "";
	private static String exceptionFile = "target/zomato/exception.txt";
	private static String exceptionmsgFile = "target/zomato/exceptionmsg.txt";

	@SuppressWarnings("unchecked")
	public static void getResturantLink(zmtURL zmturl) throws Exception {
		
		try{
		HtmlPage page=WebClient(zmturl.url);

		DomElement mainArea = page.getFirstByXPath("//div[@id='mainframe']");
		
		if((mainArea!=null)&&(mainArea.hasChildNodes())){
	
		//Get list of all restaurants Details
		Iterable<DomElement> resturantsIterable = mainArea.getChildElements();
    
		//Iterate through all elements
		Iterator<DomElement> resturantsIterator = resturantsIterable.iterator();
    
		while(resturantsIterator.hasNext())
		{
			DomElement resturantE=resturantsIterator.next();
			if(resturantE.getTagName().contains("div"))
			{
				if((resturantE!=null)&&(resturantE.hasChildNodes()))
				{
					DomElement resturantE1=resturantE.getFirstElementChild();//grid_6 column alpha
					if((resturantE1!=null)&&(resturantE1.hasChildNodes()))
					{
						DomElement resturantE2 = resturantE1.getFirstElementChild();
						if((resturantE2!=null)&&(resturantE2.hasChildNodes()))
						{
							DomElement resturantE3=resturantE2.getFirstElementChild();
							String link=resturantE3.getAttribute("href");
							String title = resturantE3.asText().trim();
							URL urlToResturant = new URL(link);
							zmtURL zmtLink = new zmtURL();
							zmtLink.url = urlToResturant;
							zmtLink.title = title;
							zmtLink.city =zmturl.city;
							zmtLink.country = zmturl.country;
							System.out.println("ResturantLink "+zmtLink.url);
							ResturantUrls.add(zmtLink);
						}
					}
				}
			}
		}
	}
		}catch(Exception e){
			System.out.println("Exception Occured. Adding to exceptionUrls");
			System.out.println(e);
			System.out.println(e.getMessage());
			exceptionUrls+=zmturl.url+"\n";
			exceptionMsg+=e+"\n";		
		}
		
		FileOutputStream exception=new FileOutputStream(exceptionFile);
		FileOutputStream exceptionmsg=new FileOutputStream(exceptionmsgFile);
		PrintStream e=new PrintStream(exception);
		PrintStream e1=new PrintStream(exceptionmsg);
		e.println(exceptionUrls);
		e1.println(exceptionMsg);
		e.close();
		e1.close();
}

		public static void getCityLinks() throws Exception {

			//Set the URL of the page
			URL url = new URL("http://www.zomato.com/bangalore/directory/restaurants-a-1");
		    
			//Read the whole page
			HtmlPage page=WebClient(url);
			
			@SuppressWarnings("unchecked")
			DomElement cityE = page.getFirstByXPath("//div[@class='left country_city_list country-1']");
			
			if((cityE!=null)&&(cityE.hasChildNodes())){
			
			Iterator<DomElement> cityIterator=cityE.getChildElements().iterator();

			while(cityIterator.hasNext())
			{
				URL firstURL = new URL("http://www.testing.com");
				try{
				DomElement cityDataE=cityIterator.next();
				String link=cityDataE.getAttribute("href");
				String city = cityDataE.asText();
				firstURL=new URL(UrlBuilder.getCityRestaurantURL(link,1));
				int num=UrlBuilder.getPages(firstURL);
		 		for(int i=1;i<=num;i++)
		 		{
		 			URL newURL=new URL(UrlBuilder.getCityRestaurantURL(link,i));
		 			zmtURL zmtLink = new zmtURL();
		 			zmtLink.country = "India";
		 			zmtLink.city = city;
		 			zmtLink.title = "unknown";
		 			zmtLink.url = newURL;
		 			System.out.println("cityRestUrl "+newURL);
		 			cityRestsUrls.add(zmtLink);
		 		}
				}catch(Exception e){
					System.out.println("Exception Occured. Adding to exceptionUrls");
					System.out.println(e);
					System.out.println(e.getMessage());
					exceptionUrls+=firstURL+"\n";
					exceptionMsg+=e+"\n";	
				}
		 		Thread.sleep(5000);
			}
		}
}

	 public static void main(String[] args) throws Exception {	
		 
		 /*
		 CrawlResturants.getCityLinks();
		 
		 System.out.println("Got all city Directory Links.Now get their resturants");
		 for(int i=0;i<cityRestsUrls.size();i++)
		 {
			 getResturantLink(cityRestsUrls.get(i));
			 Thread.sleep(5000);
		 }
		 System.out.println("Got all resturants links.Now extract data");
		 for(int i=0;i<ResturantUrls.size();i++)
		 {
			 ExtractData.getResturantData(ResturantUrls.get(i));
			 Thread.sleep(5000);
		 }
		 
		 */
		 
		//for testing
		
		   URL url = new URL("http://www.zomato.com/bangalore/alto-vino-bengaluru-marriott-hotel-whitefield-whitefield");
		 	//URL url = new URL("http://www.zomato.com/bangalore/directory/restaurants-a-1");
		    zmtURL zmtLink = new zmtURL();
		 	zmtLink.country = "India";
		 	zmtLink.city = "Bangalore";
		 	zmtLink.title = "alto-vino-bengaluru-marriott-hotel";
		 	zmtLink.url = url;
			ExtractData.getResturantData(zmtLink);
		 	 //getResturantLink(zmtLink);
		 	  
		 
	}
}