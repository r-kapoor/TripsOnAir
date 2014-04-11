package com.bookingdotcom;

import java.net.URL;
import java.util.Iterator;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * 
 * @author rajat
 *
 */

public class Crawlbookingdotcom extends HtmlUnitWebClient {

	@SuppressWarnings("unchecked")
	public static void getMainLinks() throws Exception
	{
		URL url = new URL("http://www.booking.com/searchresults.en-us.html?sid=7b7d702321d2432adf95631646a1179f;dcid=1;checkin_year_month_monthday=2014-04-30;checkout_year_month_monthday=2014-05-01;city=-2106102;class_interval=1;csflt=%7B%7D;or_radius=0;property_room_info=1;review_score_group=empty;score_min=0;ssb=empty;rows=20;offset=40");
		HtmlPage page=WebClient(url);

		DomElement linkArea = page.getFirstByXPath("//div[@id='hotellist_inner']");

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
								//getData();
								break;
							}
						}
					}
				}
			}
		}
	}
	
	public static void main(String args[])throws Exception
	{
		//getMainLinks();
		ExtractData.getData();
	}

}
