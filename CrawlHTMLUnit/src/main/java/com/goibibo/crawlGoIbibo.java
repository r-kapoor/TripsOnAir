package com.goibibo;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * 
 * @author rajat
 *
 */

public class crawlGoIbibo extends HtmlUnitWebClient{

	private static String baseURL ="http://www.goibibo.com";
	private static String AllLinksFile ="ConfigFiles/goibibo/links.txt";
	
   public static ArrayList<String> getCityLinks(URL url)throws Exception
   {
	   final ArrayList<String> CityLinks = new ArrayList<String>();
	   HtmlPage page=WebClient(url);
	   DomElement linkE=(DomElement)page.getFirstByXPath("//div[@class='cLeft cfare']");
	   
	   if((linkE!=null)&&(linkE.hasChildNodes()))
	   {
		   Iterator<DomElement> linkItr= linkE.getChildElements().iterator();
		   while(linkItr.hasNext())
		   {
			   DomElement linkItrE=linkItr.next();
			   if((linkItrE!=null)&&(linkItrE.hasChildNodes()))
			   {
				   Iterator<DomElement> urlItr =linkItrE.getChildElements().iterator();//cfArray
				   while(urlItr.hasNext())
				   {
					   DomElement urlE=urlItr.next();
					   if((urlE!=null)&&(urlE.getTagName().contains("a")))
					   {
						   String link = urlE.getAttribute("href");
						   CityLinks.add(link);
						   //System.out.println(link);
					   }
				   }
			   }   
		   }
	   }
	   return CityLinks;
   }
	
	
   public static ArrayList<String> getCityFlightLink(URL cityUrl)throws Exception
   {  
	   ArrayList<String> CityFlightLinks = new ArrayList<String>();
	   CityFlightLinks= getCityLinks(cityUrl); 
	   return CityFlightLinks;
	   
   }

    public static void main(String[] args) throws Exception {
        //crawlGoIbibo htmlUnit = new  crawlGoIbibo();
    	ArrayList<String> CityLinks = new ArrayList<String>();
    	ArrayList<String> CityFlightLinks = new ArrayList<String>();
    	String AllCityFlightLinks = "";
    	
    	URL url = new URL("http://www.goibibo.com/air-fare-calendar/");
    	
    	CityLinks=getCityLinks(url);
    	for(int i=0;i<CityLinks.size();i++)
    	{
    		URL cityUrl=new URL(baseURL+CityLinks.get(i));
    		System.out.println("cityUrl "+cityUrl);
    		CityFlightLinks=getCityFlightLink(cityUrl);
    		
    		for(int j=0;j<CityFlightLinks.size();j++)
    		{
    			AllCityFlightLinks+=CityFlightLinks.get(j)+"\n";
    		}
    		Thread.sleep(3000);
    	}
    	
    	FileOutputStream links=new FileOutputStream(AllLinksFile);
		PrintStream e=new PrintStream(links);
		e.println(AllCityFlightLinks);
		e.close();

    }
}