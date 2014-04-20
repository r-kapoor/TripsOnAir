package com.bookingdotcom;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.util.Iterator;
import java.util.ArrayList;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.makemytrip.Hotels;

/**
 * 
 * @author rajat
 * Sample MainLink : "http://www.booking.com/hotel/in/the-leela-palace-kempinski-new-delhi.en-gb.html?checkin=2014-05-05;checkout=2014-05-07;"
 */

public class Crawlbookingdotcom extends HtmlUnitWebClient {

	private static int num = -1;
	private static int flag = 0;//to know loop enters first time in getMainLinks() method
	private static String baseUrl = "http://www.booking.com";
	private static ArrayList<URL> mainLinks = new ArrayList<URL>();
	private static String mainUrls = "";
	private static String mainUrlsFile = "ConfigFiles/bookingdotcom/priceCheckingUrls.txt";
	
	
	public static void getMainLinks(URL url) throws Exception
	{
		HtmlPage page=WebClient(url);

		DomElement linkArea = page.getFirstByXPath("//div[@id='hotellist_inner']");
		DomElement numArea = page.getFirstByXPath("//ul[@class='x-list']");

		if((getFlag()==0)&&(numArea!=null)&&(numArea.hasChildNodes()))
		{
			DomElement numE=numArea.getLastElementChild();
			if((numE!=null)&&(numE.getTagName().contains("li")))
			{
				String number = numE.asText().trim();
				setNum(Integer.parseInt(number));
				System.out.println("num "+getNum());
			}
		}
		
		if((linkArea!=null)&&(linkArea.hasChildNodes()))
		{
			Iterator<DomElement> linkIterator=linkArea.getChildElements().iterator();
			while(linkIterator.hasNext())
			{
				DomElement hotelE1=linkIterator.next();
				DomElement hotelE2=hotelE1.getLastElementChild();
				if((hotelE2!=null)&&(hotelE2.hasChildNodes()))
				{
					Iterator<DomElement> detailsIterator=hotelE2.getChildElements().iterator();
					while(detailsIterator.hasNext())
					{
						DomElement detailsE=detailsIterator.next();
						if((detailsE!=null)&&(detailsE.getTagName().contains("h3"))&&(detailsE.hasChildNodes()))
						{
							DomElement detailsEChd=detailsE.getFirstElementChild();
							if(detailsEChd.getTagName().contains("a"))
							{
								String href=detailsEChd.getAttribute("href");
								mainLinks.add(new URL(baseUrl+href));
								System.out.println("hotelUrl "+href);
								break;
							}
						}
					}
				}
			}
		}
		
		if(getFlag()==0){
			//getOtherPagesUrl(url.toString(),getNum());
		}
	}
	
	public static void getOtherPagesUrl(String url,int num) throws Exception
	{
		int offset=20;
		setFlag(1);
		for(int i=1;i<=num;i++)
		{
			String pageUrl = url+";"+"offset="+offset;
			System.out.println("pageUrl "+pageUrl);
			getMainLinks(new URL(pageUrl));
			offset = offset+20;
		}
		setFlag(0);
		setNum(-1);
	}
	
	public static int getNum(){
		return num;
	}

	public static void setNum(int num) {
		Crawlbookingdotcom.num = num;
	}
	
	public static int getFlag() {
		return flag;
	}

	public static void setFlag(int flag) {
		Crawlbookingdotcom.flag = flag;
	}

	public static void main(String args[])throws Exception
	{
		UrlBuilder.cityUrlBuilder();
		
		for(int j=0;j<mainLinks.size();j++)
		{
			URL link = mainLinks.get(j);
			//ExtractData.getData(link);
			mainUrls+=link.toString()+"\n";
			
		}
		
		FileOutputStream url=new FileOutputStream(mainUrlsFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(url);
		e.println(mainUrls);
		e.close();
		
		/*for(int j=0;j<mainLinks.size();j++)
		{
			URL link = mainLinks.get(j);
			ExtractData.getData(link);
			//mainUrls+=link.toString()+"\n";
			
		}*/
	}
}
