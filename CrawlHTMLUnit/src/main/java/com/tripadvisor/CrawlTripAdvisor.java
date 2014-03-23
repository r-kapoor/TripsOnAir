package com.tripadvisor;

import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

/**
 * @author rajat 
 * 	Crawls trip places from tripAdvisor
 *	mainLink: "http://www.tripadvisor.in/AllLocations-g297627-c2-Attractions-Karnataka.html"
 *	Sample ChildLink: "http://www.tripadvisor.in/AllLocations-g297628-c2-Attractions-Bangalore_Karnataka.html"
 *	Sample subChildLink:"http://www.tripadvisor.in/Attraction_Review-g297628-d325159-Reviews-Bull_Temple-Bangalore_Karnataka.html"
 * 	Get the details from the subChildLink
 */

public class CrawlTripAdvisor {

	private static String baseUrl = "http://www.tripadvisor.in";
	private static ArrayList<URL> subChildLinks = new ArrayList<URL>();
	private static int num = 0;
	private static int flag = 0;

	@SuppressWarnings("unchecked")
	public static void getDetails(URL url) throws Exception {
		
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		WebRequest request = new WebRequest(url);

		// Read the whole page
		HtmlPage page = webClient.getPage(request);
		List<DomElement> placeArea = (List<DomElement>) page
				.getByXPath("//div[@id='HEADING_GROUP']");

		// Get the Heading Group
		DomElement headinggroup = placeArea.get(0);

		// Get the heading (name)
		DomElement heading = headinggroup.getFirstElementChild();
		String name = heading.getFirstElementChild().asText();

		// Get the address and other details(if present) Element
		DomElement detailsE = heading.getNextElementSibling();
		
		// Get the address element
		DomElement addressE = detailsE.getFirstElementChild();
		String address = addressE.asText().trim();

		String phone = "unknown", ranktext = "unknown", rating = "unknown", numofreviews = "unknown", type = "unknown", fee = "unknown", duration = "unknown", description = "none";
		Boolean isTravellersChoice = false, isCoE = false;
		
		// Get the other details element
		DomElement otherE = addressE.getNextElementSibling();
		Iterator<DomElement> othersI = otherE.getChildElements().iterator();
		while (othersI.hasNext()) {
			DomElement otherC = othersI.next();
			// Getting the icon element
			DomElement iconE = otherC.getFirstElementChild();
			String classofIcon = iconE.getAttribute("class");
			
			// Checking whether it is a phone number
			if (classofIcon.contains("greenPhone")) {
				// Getting the element which contains the phone number
				DomElement phoneE = iconE.getNextElementSibling();
				phone = phoneE.asText().trim();
			}
			// Other details can be got in the same manner. The website link is
			// not spelt as it is so could not get it
		}

		// Getting the Details element
		DomElement allDetails = (DomElement) page.getByXPath(
				"//div[@class='col2of2']").get(0);

		// Iterating through all its children
		Iterator<DomElement> detailsI = allDetails.getChildElements()
				.iterator();
		while (detailsI.hasNext()) {
			// Getting a particular detail
			DomElement detail = detailsI.next();
			// Getting the type of detail
			String detailtype = detail.getAttribute("class");

			// Checking if is a ranking
			if (detailtype.contains("popRanking wrap")) {
				ranktext = detail.asText().trim().replaceAll("\\s+", " ");
			}

			// Checking if is a rating
			if (detailtype.contains("rs rating")) {
				DomElement ratingE = detail.getFirstElementChild();
				rating = ratingE.getFirstElementChild().getAttribute("content");
				numofreviews = ratingE.getNextElementSibling()
						.getFirstElementChild().asText();
			}

			// Checking if is Traveller's Choice
			if (detailtype.contains("bestLink collapsible wrap")) {
				isTravellersChoice = true;
			}

			// Checking if is Certificate of Excellence
			if (detailtype.contains("coeBadgeDiv")) {
				isCoE = true;
			}
			// Checking if listing details
			if (detailtype.contains("listing_details")) {
				Iterator<DomElement> listdetailsI = detail.getChildElements()
						.iterator();
				while (listdetailsI.hasNext()) {
					DomElement listdetail = listdetailsI.next();
					if (listdetail.hasChildNodes()) {
						// Getting the detail type
						DomElement listdetailtypeE = listdetail
								.getFirstElementChild();

						if (listdetailtypeE != null) {
							// Checking if it is actually a detail type
							if (listdetailtypeE.getTagName().contains("b")) {
								String listdetailtype = listdetailtypeE
										.asText();
								// Checking if is Type
								if (listdetailtype.contains("Type")) {
									type = listdetail.getTextContent().trim();
								}
								// Checking if is Fee
								if (listdetailtype.contains("Fee")) {
									fee = listdetail.getTextContent().trim();
								}
								// Checking if is Duration of visit
								if (listdetailtype.contains("length of visit")) {
									duration = listdetail.getTextContent()
											.trim();
								}
								// Checking if is Description
								if (listdetailtype.contains("escription")) {
									description = listdetail.getTextContent()
											.trim();
								}
							} else {
								// It is not a detail type
								if (listdetail.getAttribute("class").contains(
										"listing_description")) {
									// It is a description
									if (listdetailtypeE.getAttribute("class")
											.contains("toggle")) {
										// It is a toggle type element
										// Getting the complete description
										DomElement descE = listdetailtypeE.getFirstByXPath("//span[@class='onShow']");		
										description = descE.getTextContent().trim();												
									}
								}
							}
						}
					}

				}
			}
		}

		System.out.println("Name: " + name);
		System.out.println("Address: " + address);
		System.out.println("Phone No.: " + phone);
		System.out.println("Rank Text: " + ranktext);
		System.out.println("Rating: " + rating);
		System.out.println("Number of Reviews: " + numofreviews);
		System.out.println("Is a Traveller's Choice Award Winner: "
				+ isTravellersChoice);
		System.out.println("Is a Certificate of Excellence: " + isCoE);
		System.out.println("Type: " + type);
		System.out.println("Duration of Visit: " + duration);
		System.out.println("Fee: " + fee);
		System.out.println("Description: " + description);

	}

	@SuppressWarnings("unchecked")
	public static ArrayList<URL> getMainLinks(URL url) throws Exception {

		ArrayList<URL> mainLinks = new ArrayList<URL>();
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		WebRequest request = new WebRequest(url);

		// Read the whole page
		HtmlPage page = webClient.getPage(request);
		
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
					String appendUrl = urlElement.getAttribute("href");
					mainLinks.add(new URL(baseUrl + appendUrl));
					//break;// only for testing the flow in less time
				}
			}
			//break;// only for testing the flow in less time
		}
		return mainLinks;
	}

	public static ArrayList<URL> getChildLinks(URL url) throws Exception {
		return (getMainLinks(url));
	}

	@SuppressWarnings("unchecked")
	public static void getSubChildLinks(URL url) throws Exception {

		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		WebRequest request = new WebRequest(url);

		// Read the whole page
		HtmlPage page = webClient.getPage(request);

		// List of main travel destinations is present in 'BODYCON' id
		List<DomElement> linkArea = (List<DomElement>) page
				.getByXPath("//div[@id='BODYCON']");
		DomElement linkElement = linkArea.get(0);

		// Reach to the table to get list of travel destinations
		Iterator<DomElement> toGetTableIterator = linkElement
				.getChildElements().iterator();

		// skip first 6 elements if there is no element of number of pages to reach the table
		// otherwise skip 7 elements
		for (int i = 1; i <= 7; i++) {

			DomElement skip = toGetTableIterator.next();

			// if the 5th element is for number of pages
			if ((i == 5) && (!(skip.toString().equals("HtmlBreak[<br>]")))) {
				DomElement noPages = skip;// store Element to get no. of pages
				String number[] = noPages.asText().split(" ");
				try {
					setNum((int) Integer.parseInt(number[number.length - 1]));
				} catch (Exception NumberFormatException) {
				}
				flag = 1;
			}
			if ((i == 6) && flag == 0)// if there is no element for number of pages then skip first 6 only
			{
				break;
			}

		}
		// reach to the table
		DomElement table = toGetTableIterator.next();

		// Iterate over the rows in the tbody
		Iterator<DomElement> columnIterator = table.getFirstElementChild()
				.getFirstElementChild().getChildElements().iterator();

		while (columnIterator.hasNext()) {
			DomElement column = columnIterator.next();

			// iterate over the columns
			Iterator<DomElement> divIterator = column.getChildElements()
					.iterator();

			while (divIterator.hasNext()) {

				// get the link for the attraction
				DomElement urlElement = divIterator.next()
						.getFirstElementChild();

				// Avoids nullpointer Exception
				if (urlElement != null) {
					String appendUrl = urlElement.getAttribute("href");
					subChildLinks.add(new URL(baseUrl + appendUrl));
				}

			}

		}
	}

	public static void getOtherSubChildLinks(URL url) throws Exception {
		
		// get the list of urls which come from changing the page number of the ChildUrl
		List<URL> listChildUrl = PlacesUrlBuilder.trpAdvUrl(url, getNum());

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

		URL url = new URL(
				"http://www.tripadvisor.in/AllLocations-g293860-c2-Attractions-India.html");
	
		ArrayList<URL> mainLinks = CrawlTripAdvisor.getMainLinks(url);
		ArrayList<URL> allChildLinks = new ArrayList<URL>();
		
		for (int i = 0; i < mainLinks.size(); i++) {
			ArrayList<URL> ChildLinks = CrawlTripAdvisor
					.getChildLinks(mainLinks.get(i));

			//store all the childlinks
			for (int j = 0; j < ChildLinks.size(); j++) {
				allChildLinks.add(ChildLinks.get(j));
			}
		}
		
		for(int k=0;k<allChildLinks.size();k++)
		{
			CrawlTripAdvisor.getSubChildLinks(allChildLinks.get(k));
			if(num!=0){
			getOtherSubChildLinks(allChildLinks.get(k));
			}
		}
		
		for(int i=0;i<subChildLinks.size();i++)
		{
			//get the details for all subchildlinks
			getDetails(subChildLinks.get(i));
		}
	}
}	