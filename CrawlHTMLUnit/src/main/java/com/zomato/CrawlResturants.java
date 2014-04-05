package com.zomato;

import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * @author rajat
 * Crawls the zomato resturants
 * Starting Url:"http://www.zomato.com/"
 * Sample CityResturantsUrl:"http://www.zomato.com/bangalore/directory/restaurants-a-1"
 * Sample ResturantUrl:"http://www.zomato.com/bangalore/anjappar-koramangala"
 * Get the data from the ResturantUrl
 */

public class CrawlResturants {
	
	private static ArrayList<zmtURL> cityRestsUrls= new ArrayList<zmtURL>();

	@SuppressWarnings("unchecked")
	public static void getResturantLink(zmtURL zmturl) throws Exception {
		
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		WebRequest request = new WebRequest(zmturl.url);
    
		//Read the whole page
		HtmlPage page = webClient.getPage(request);

		List<DomElement> table = (List<DomElement>)page.getByXPath("//div[@id='mainframe']");
		DomElement mainarea = table.get(0);
		
		//Get list of all restaurants Details
		Iterable<DomElement> resturantsIterable = mainarea.getChildElements();
    
		//Iterate through all elements
		Iterator<DomElement> resturantsIterator = resturantsIterable.iterator();
    
		while(resturantsIterator.hasNext())
		{
			DomElement resturantE=resturantsIterator.next();
			if(resturantE.getTagName().contains("div"))
			{
				if((resturantE!=null)&&(resturantE.hasChildNodes()))
				{
					DomElement resturantE1=resturantE.getFirstElementChild();
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
							ExtractData.resturantData(zmtLink);
						}
					}
				}
			}
		}
}

		public static void getCityLinks() throws Exception {
		 
			final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
			webClient.getOptions().setThrowExceptionOnScriptError(false);

			//Set the URL of the page
			URL url1 = new URL("http://www.zomato.com");
			WebRequest request = new WebRequest(url1);
		    
			//Read the whole page
			HtmlPage page = webClient.getPage(request);
			
			@SuppressWarnings("unchecked")
			List<DomElement> cityE = (List<DomElement>)page.getByXPath("//div[@class='left country_city_list country-1']");
			
			//get the element for list of India's city
			DomElement cityA=cityE.get(0);
			if((cityA!=null)&&(cityA.hasChildNodes())){
			
			Iterator<DomElement> cityIterator=cityA.getChildElements().iterator();

			while(cityIterator.hasNext())
			{
				DomElement cityDataE=cityIterator.next();
				String link=cityDataE.getAttribute("href");
				String city = cityDataE.asText();
				URL firstURL=new URL(UrlBuilder.getCityRestaurantURL(link,1));
				int num=UrlBuilder.getPages(firstURL);
		 		for(int i=1;i<=num;i++)
		 		{
		 			URL newURL=new URL(UrlBuilder.getCityRestaurantURL(link,i));
		 			zmtURL zmtLink = new zmtURL();
		 			zmtLink.country = "India";
		 			zmtLink.city = city;
		 			zmtLink.title = "unknown";
		 			zmtLink.url = newURL;
		 			cityRestsUrls.add(zmtLink);
		 		}
			}
		}
 }

	 public static void main(String[] args) throws Exception {	 
		 CrawlResturants.getCityLinks();
		 for(int i=0;i<cityRestsUrls.size();i++)
		 {
			 getResturantLink(cityRestsUrls.get(i));
		 }
	}
}