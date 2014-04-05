package com.zomato;

import java.net.URL;
import java.util.List;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 *first crawl the no. of pages belongs to a particular city on zomato
 *then generate all urls linked to the resturants in that city  
 * @author rajat
 *
 */

public class UrlBuilder {	
	
	public static String getCityRestaurantURL(String link,int num) throws Exception{
           String newUrl = link+"/"+"directory"+"/"+"restaurants-a-"+num;
           return newUrl;	 
	}
	 	 
	@SuppressWarnings("unchecked")
	public static int getPages(URL url) throws Exception
	 {
       	final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
       	webClient.getOptions().setThrowExceptionOnScriptError(false);
      	WebRequest request = new WebRequest(url);
      	
      	//Read the whole page
      	HtmlPage page = webClient.getPage(request);
      	
      	List<DomElement> numElement = (List<DomElement>)page.getByXPath("//div[@class='grid_16 column dirsnippet']");
          DomElement numarea = numElement.get(0);
          String number ="1";//default value
          
          if(numarea.hasChildNodes())
          {
          	number=numarea.getLastElementChild().asText();
          }
          return Integer.parseInt(number);
	 }
}