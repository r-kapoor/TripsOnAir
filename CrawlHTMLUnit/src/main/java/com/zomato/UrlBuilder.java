package com.zomato;

import java.net.URL;
import java.util.List;

import GlobalClasses.HtmlUnitWebClient;

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

public class UrlBuilder extends HtmlUnitWebClient{	
	
	public static String getCityRestaurantURL(String link,int num) throws Exception{
           String newUrl = link+"/"+"directory"+"/"+"restaurants-a-"+num;
           return newUrl;	 
	}

	public static int getPages(URL url) throws Exception
	 {
		HtmlPage page=WebClient(url);
 
      	  DomElement numE = page.getFirstByXPath("//div[@class='grid_16 column dirsnippet']");
          String number ="1";//default value
          
          if(numE.hasChildNodes())
          {
          	number=numE.getLastElementChild().asText();
          }
          return Integer.parseInt(number);
	 }
}