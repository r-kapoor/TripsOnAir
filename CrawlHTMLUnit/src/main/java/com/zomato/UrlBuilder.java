package com.zomato;

import java.net.MalformedURLException;
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
 *first crawl the no. of pages belongs to a particular city on zomato
 *then generate all urls linked to the resturants in that city  
 * @author rajat
 *
 */

public class UrlBuilder {

	private static String base ="http://www.zomato.com/";
	private static ArrayList<String> city= new ArrayList<String>();
	
	 public static void main(String[] args) throws Exception {
		 
		 //fetch cities from the database
		 
		 //city.add("bangalore");city.add("indore");city.add("jaipur");city.add("lucknow");city.add("ludhiana");city.add("mumbai");city.add("pune");
		 city.add("ncr");
		 //city.add("ahmedabad");city.add("Calcuta");city.add("chandigarh");city.add("chennai");city.add("gauhati");city.add("hyderabad");
		 //get the number of pages in the city url
		 
		 //traverse through the city list
		// Iterator<String> it = city.iterator();
		 for (int i=0; i < city.size(); i++)
		 {
		     String firstUrl = base+city.get(i)+"/"+"directory"+"/"+"restaurants-a-1";
		     System.out.println(firstUrl);
		     
		     URL urlToDirectory = new URL(firstUrl);
		     //get the number of pages
		     int num = getPages(urlToDirectory);
		     //System.out.println(num);
		    /* for(int j=1;j<num;j++)
			  {
		    	String possibleUrl = base+city.get(i)+"/"+"directory"+"/"+"restaurants-a-"+j;//generate the url
				System.out.println(possibleUrl);
			  }
			  */
		 }
	}
	 	 
	 public static int getPages(URL url) throws Exception
	 {
		 final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
			
			//Set the URL of the page
			URL url1 = new URL("http://www.zomato.com/ncr/directory/restaurants-a-1");
			WebRequest request = new WebRequest(url1);
		    
			//Read the whole page
			HtmlPage page = webClient.getPage(request);
			//System.out.print(page.asText());
			
			List<DomElement> numElement = (List<DomElement>)page.getByXPath("//div[@class='grid_16 column dirsnippet']");
		    DomElement numarea = numElement.get(0);
		    
		    String number[] = numarea.asText().split("|");
		    int len = number.length;
		    String num="";
		    
		    while(number[len-1]!=" ")
		    {
		    	num = num + number[len-1];
		    }
		    System.out.println("testnumber: "+num);
		 return Integer.parseInt(num);
		
	 }
}
