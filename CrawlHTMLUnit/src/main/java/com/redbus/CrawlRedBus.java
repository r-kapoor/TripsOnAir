package com.redbus;

import java.io.FileOutputStream;
import java.io.PrintStream;
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
	
	private static String cityLinks = "";
	private static String exceptionUrls="";
	private static String exceptionMsg="";
	private static String cityLinksFile = "ConfigFiles/redbus/cityLinks.txt";
	private static String exceptionFile = "target/redbus/cityException.txt";
	private static String exceptionmsgFile = "target/redbus/cityExceptionMsg.txt";
	
	@SuppressWarnings("unchecked")
	public static String getCityLinks(URL url) throws Exception {

		
		System.out.println("Starting Extracting city Links");

		String cityUrls="";
		try{
		//Read the whole page
		HtmlPage page=WebClient(url);
		
		DomElement cityE1 = page.getFirstByXPath("//div[@id='ctl00_ctl00_ContentHolder_ContentHolder_divLinks']");
		
		if((cityE1!=null)&&(cityE1.hasChildNodes()))
		{
			DomElement cityE2= cityE1.getFirstElementChild();
			if((cityE2!=null)&&(cityE2.hasChildNodes()))
			{
				Iterator<DomElement> cityColmItr =  cityE2.getChildElements().iterator();
				while(cityColmItr.hasNext())
				{
					DomElement colE= cityColmItr.next();
					if((colE!=null)&&(colE.hasChildNodes()))
					{
						Iterator<DomElement> cityRowItr =  colE.getChildElements().iterator();
						while(cityRowItr.hasNext())
						{
							DomElement rowE=cityRowItr.next();
							if((rowE!=null)&&(rowE.hasChildNodes()))
							{
								DomElement rowEchild = rowE.getFirstElementChild();
								if((rowEchild!=null)&&(rowEchild.getTagName().contains("a")))
								{
									String link=rowEchild.getAttribute("href");
									cityUrls+=link+"\n";
								}
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
		exceptionUrls+=url+"\n";
		exceptionMsg+=e+"\n";
	}
		
		FileOutputStream exception=new FileOutputStream(exceptionFile,true);
		FileOutputStream exceptionmsg=new FileOutputStream(exceptionmsgFile,true);
		PrintStream e=new PrintStream(exception);
		PrintStream e1=new PrintStream(exceptionmsg);
		e.append(exceptionUrls);
		e1.append(exceptionMsg);
		e.close();
		e1.close();
		return cityUrls;
}	
	
	public static int getNumofCity(URL url)throws Exception
	{
		int num =0;
		try{
			
		HtmlPage page=WebClient(url);
		DomElement numE=page.getFirstByXPath("//div[@id='ctl00_ctl00_ContentHolder_ContentHolder_numberStrip']");
		
		if((numE!=null)&&(numE.hasChildNodes()))
		{
			String numStr=numE.getLastElementChild().asText();
			num=Integer.parseInt(numStr);
			System.out.println("num "+num);
		}
		else
		{
			DomElement routeNumE = page.getFirstByXPath("//div[@id='ctl00_ctl00_ContentHolder_ContentHolder_cityNumberStrip']");
			if((routeNumE!=null)&&(routeNumE.hasChildNodes()))
			{
				String numStr=routeNumE.getLastElementChild().asText();
				num=Integer.parseInt(numStr);
				System.out.println("num "+num);
			}
		}
		}
		catch(Exception e)
		{
			System.out.println("Exception Occured. Adding to exceptionUrls");
			System.out.println(e);
			System.out.println(e.getMessage());
			exceptionUrls+=url+"\n";
			exceptionMsg+=e+"\n";
			
		}
		return num;
	}
	
	public static void main(String[] args) throws Exception {
	    
		//initialize the exception files 
		FileOutputStream exception=new FileOutputStream(exceptionFile);
		FileOutputStream exceptionmsg=new FileOutputStream(exceptionmsgFile);
		PrintStream e=new PrintStream(exception);
		PrintStream e1=new PrintStream(exceptionmsg);
		e.println("");
		e1.println("");
		e.close();
		e1.close();
			
		int num;   
	    URL url = new URL("http://www.redbus.in/bus-tickets/routes-directory.aspx");
	    num = getNumofCity(url);
	    Thread.sleep(5000);
	    
	    for(int i=1;i<=num;i++)
	    {
	    	URL link = new URL("http://www.redbus.in/bus-tickets/routes-"+i+".aspx");
	    	System.out.println(link);
	    	cityLinks+=getCityLinks(link);
	    	Thread.sleep(10000);
	    }
		
		//Write the links into the file
		FileOutputStream CityLinkStream = new FileOutputStream(cityLinksFile);
		PrintStream printLinks	= new PrintStream(cityLinks);
		printLinks.println(CityLinkStream);
		printLinks.close();
	    
	}
}
