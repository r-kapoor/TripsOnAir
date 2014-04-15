package com.tripadvisor;

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
 *  @author rajat 
 * 	Crawls trip places from tripAdvisor
 *	mainLink: "http://www.tripadvisor.in/AllLocations-g297627-c2-Attractions-Karnataka.html"
 *	Sample ChildLink: "http://www.tripadvisor.in/AllLocations-g297628-c2-Attractions-Bangalore_Karnataka.html"
 *	Sample subChildLink:"http://www.tripadvisor.in/Attraction_Review-g297628-d325159-Reviews-Bull_Temple-Bangalore_Karnataka.html"
 * 
 */

public class CrawlTripAdvisor extends HtmlUnitWebClient{

	private static String baseUrl = "http://www.tripadvisor.in";
	private static ArrayList<DataUrl> subChildLinks = new ArrayList<DataUrl>();
	private static ArrayList<DataUrl> mainChildLinks = new ArrayList<DataUrl>();
	private static ArrayList<DataUrl> otherChildLinks = new ArrayList<DataUrl>();
	private static int num = 0;
	private static String exceptionUrls = "";
	private static String exceptionFile = "target/tripAdvisor/exception.txt";

	@SuppressWarnings("unchecked")
	public static ArrayList<DataUrl> getMainLinks(DataUrl dtUrl) throws Exception {
		
		System.out.println("Enters getMainLinks");

		ArrayList<DataUrl> mainLinks = new ArrayList<DataUrl>();
		// Read the whole page
		HtmlPage page=WebClient(dtUrl.link);

		// List of main travel destinations is present in 'BODYCON' id
		List<DomElement> linkArea = (List<DomElement>) page
				.getByXPath("//div[@id='BODYCON']");
		DomElement linkElement = linkArea.get(0);

		// Reach to the table to get list of travel destinations
		Iterator<DomElement> toGetTableIterator = linkElement
				.getChildElements().iterator();

		// skip first 4 elements to reach the table
		for (int i = 1; i <= 4; i++) {
			toGetTableIterator.next();
		}

		// reach to the table
		DomElement table = toGetTableIterator.next();

		// Iterate over the rows in the tbody
		Iterator<DomElement> rowsIterator = table.getFirstElementChild()
				.getChildElements().iterator();

		while (rowsIterator.hasNext()) {
			try{
				DomElement row = rowsIterator.next();
				// iterate over the columns
				Iterator<DomElement> columnIterator = row.getChildElements()
					.iterator();

				while (columnIterator.hasNext()) {
				
				// get the link for the attraction
				DomElement urlElement = columnIterator.next()
						.getLastElementChild();
				// Avoids nullpointer Exception
				if (urlElement != null) {
					DataUrl dt_Url = new DataUrl();
					String appendUrl = urlElement.getAttribute("href");
					
					System.out.println("Found URL:"+appendUrl);
					
					String atrInstate = urlElement.asText();
					String state = atrInstate.replace("Attractions in ","");
					dt_Url.link = new URL(baseUrl + appendUrl);
					dt_Url.country = dtUrl.country;
					
					if(dtUrl.state.equals("")){
						dt_Url.city = dtUrl.city;
						dt_Url.state = state;
					}
					else
					{
						dt_Url.city = state;
						dt_Url.state = dtUrl.state;
					}
					mainLinks.add(dt_Url);
					break;// only to test the flow in less time
					}
				}
			}catch(Exception e)
			{
				exceptionUrls+=dtUrl.link+"\n";
			}
			break;// only for to test the flow in less time
	}
		return mainLinks;
}

	public static ArrayList<DataUrl> getChildLinks(DataUrl url) throws Exception {
		return (getMainLinks(url));
	}

	@SuppressWarnings("unchecked")
	public static void getSubChildLinks(DataUrl dtUrl) throws Exception {

		try{
		// Read the whole page
		HtmlPage page=WebClient(dtUrl.link);

		// List of main travel destinations is present in 'BODYCON' id
		List<DomElement> linkArea = (List<DomElement>) page
				.getByXPath("//div[@id='BODYCON']");
		DomElement linkElement = linkArea.get(0);

		// Reach to the table to get list of travel destinations
		Iterator<DomElement> linkIterator = linkElement
				.getChildElements().iterator();
		
		while(linkIterator.hasNext())
		{
			try{
			DomElement linkE = linkIterator.next();
			
			if(linkE.getTagName().contains("div"))
			{
				if(linkE.hasChildNodes())
				{
					String number[] = linkE.asText().split(" ");
					try {
							setNum((int) Integer.parseInt(number[number.length - 1]));
						} catch (Exception NumberFormatException) {}
					
				}
			}
			
			if(linkE.getTagName().contains("table"))
			{
				DomElement row=linkE.getFirstElementChild().getFirstElementChild();
				if(row.hasChildNodes())
				{
					Iterator<DomElement> columnIterator=row.getChildElements().iterator();
					
					while(columnIterator.hasNext())
					{
						DomElement clmE=columnIterator.next();
						if(clmE.hasChildNodes())
						{
							Iterator<DomElement> divIterator=clmE.getChildElements().iterator();
							while(divIterator.hasNext())
							{
								DomElement divE=divIterator.next();
								if(divE.hasChildNodes())
								{
									if(divE.getTagName().contains("a")){
									String otherChildurl=divE.getAttribute("href");
									
									System.out.println("Found Child URL:"+otherChildurl);
									
									String atrIncity=divE.asText();
									URL newOtherChildUrl=new URL(baseUrl + otherChildurl);
									if(!(subChildLinks.contains(newOtherChildUrl))){
										DataUrl dtLink = new DataUrl();
										dtLink.link= newOtherChildUrl;
										dtLink.country = dtUrl.country;
										dtLink.state = dtUrl.state;
										dtLink.city = dtUrl.city;
										otherChildLinks.add(dtLink);
									}
								}
									
									if(divE.getTagName().contains("div")){
										String subChildUrl=divE.getFirstElementChild().getAttribute("href");
										URL newSubChildUrl=new URL(baseUrl + subChildUrl);
										if(!(subChildLinks.contains(newSubChildUrl))){
											DataUrl dtlink = new DataUrl();
											dtlink.link= newSubChildUrl;
											dtlink.state = dtUrl.state;
											dtlink.country = dtUrl.country;
											dtlink.city = dtUrl.city;
											subChildLinks.add(dtlink);
										}
									}
								
								}
							}
						}
					}
				}
			}
		}//end of try statement
			catch(Exception e)
			{
				exceptionUrls+=dtUrl.link+"\n";
			}
		}
	}catch(Exception e)
	{
		exceptionUrls+=dtUrl.link+"\n";
	}
}

	public static void getOtherSubChildLinks(DataUrl url) throws Exception {
		
		// get the list of urls which come from changing the page number of the ChildUrl
		List<DataUrl> listChildUrl = PlacesUrlBuilder.trpAdvUrl(url, getNum());

		// get the subchildUrl for the above list of childUrls
		for (int k = 0; k < listChildUrl.size(); k++) {
			getSubChildLinks(listChildUrl.get(k));
		}
	}

	//getter and setter for number of pages associated with a url
	public static int getNum() {
		return num;
	}

	public static void setNum(int num) {
		CrawlTripAdvisor.num = num;
	}
	
	public static void main(String[] args) throws Exception {

		DataUrl dtUrl = new DataUrl();
		URL url = new URL(
				"http://www.tripadvisor.in/AllLocations-g293860-c2-Attractions-India.html");
		dtUrl.link=url;
		dtUrl.country = "India";
		dtUrl.state = "";
		dtUrl.city = "";
		
		ArrayList<DataUrl> mainLinks = CrawlTripAdvisor.getMainLinks(dtUrl);
		
		for (int i = 0; i < mainLinks.size(); i++) {
			ArrayList<DataUrl> ChildLinks = CrawlTripAdvisor.getChildLinks(mainLinks.get(i));

			//store all the childlinks
			for (int j = 0; j < ChildLinks.size(); j++) {
				if(!(mainChildLinks.contains(ChildLinks.get(j)))){
				mainChildLinks.add(ChildLinks.get(j));}
			}
			Thread.sleep(3000);
		}
		
		System.out.println("Got all child links");

		for(int k=0;k<mainChildLinks.size();k++)
		{
			CrawlTripAdvisor.getSubChildLinks(mainChildLinks.get(k));
			if(getNum()!=0){
			getOtherSubChildLinks(mainChildLinks.get(k));
			setNum(0);
			}
			Thread.sleep(3000);
		}
		
		for(int k=0;k<otherChildLinks.size();k++)
		{
			CrawlTripAdvisor.getSubChildLinks(otherChildLinks.get(k));
			if(num!=0){
			getOtherSubChildLinks(otherChildLinks.get(k));
			}
			Thread.sleep(3000);
		}
		
		System.out.println("Got all subchild links. Now getting the details");
		
		for(int i=0;i<subChildLinks.size();i++)
		{
			//get the details for all subchildlinks
			ExtractData.getDetails(subChildLinks.get(i));
			Thread.sleep(4000);
		}
		
		FileOutputStream exception=new FileOutputStream(exceptionFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(exception);
		e.println(exceptionUrls);
		e.close();
		
		/*DataUrl du = new DataUrl();
		URL url = new URL("http://www.tripadvisor.in/Attraction_Review-g503691-d523963-Reviews-Radhanagar_Beach-Havelock_Island_Andaman_and_Nicobar_Islands.html");
		du.link= url;
		du.country="test";
		du.state="test";
		du.city = "test";
		ExtractData.getDetails(du);*/

	}
}	