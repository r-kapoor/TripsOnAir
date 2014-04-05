package com.tripadvisor;

import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * @author rahul
 * Get the details from the subChildLink
 * Sample subChildLink:"http://www.tripadvisor.in/Attraction_Review-g297628-d325159-Reviews-Bull_Temple-Bangalore_Karnataka.html"
 */


public class ExtractData {

	@SuppressWarnings("unchecked")
	public static void getDetails(DataUrl url) throws Exception {
		
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		WebRequest request = new WebRequest(url.link);

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

		String phone = "unknown", ranktext = "unknown", rating = "unknown", numofreviews = "unknown", type = "unknown", fee = "unknown", duration = "unknown", description = "none",photoLink="unknown";
		Boolean isTravellersChoice = false, isCoE = false;
		int durValue=0;
		
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
		
		//Getting the Element for photo Links
		DomElement photoArea = (DomElement) page.getByXPath("//div[@class='photo ']").get(0);
		if((photoArea!=null)&&(photoArea.hasChildNodes()))
		{
			if(photoArea.getFirstElementChild().hasChildNodes())
			{
				DomElement photoE=photoArea.getFirstElementChild().getFirstElementChild();
				if(photoE.getTagName().contains("div")&&(photoE.hasChildNodes()))
				{
					photoLink=photoE.getFirstElementChild().getAttribute("src");
				}
			}
		}
		
		if(!(duration.equals("unknown"))){
			@SuppressWarnings("resource")
		Scanner in = new Scanner(duration).useDelimiter("[^0-9]+");
		 durValue = in.nextInt();
		}
		
		fee= fee.replace("Fee: ","");
		type = type.replace("Type: ","");
		description=description.split("\n")[1];
		
		if(!(ranktext.equals("unknown"))){
		@SuppressWarnings("resource")
		Scanner vl = new Scanner(ranktext).useDelimiter("[^0-9]+");
		 int x = vl.nextInt();
		 int y = vl.nextInt();
		// System.out.println("x: "+x);
		 //System.out.println("y: "+y);
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
		System.out.println("Duration of Visit: " + durValue);
		System.out.println("Fee: " + fee);
		System.out.println("Description: " + description);
		System.out.println("photolink: "+ photoLink);
		
		/*Statement statement=ConnectMysql.MySqlConnection();
		int result = statement
        .executeUpdate("INSERT INTO Places VALUES('"+type+"','test',3,'"+address+"',333031,'"+phone+"',3,'"+description+"',4,'value-10',123,234,0,1)WHERE EXISTS(SELECT * FROM Places WHERE Name = '"+name+"')");
				/*while (resultSet.next()){
						System.out.println("NAME:"  
								+ resultSet.getString("NAME"));	            
				}
		/*int result = statement
				.executeUpdate("INSERT INTO Flight VALUES('"+name+"',234)");
		*/
		/*int result = statement
		        .executeUpdate("update Places set PlaceID = 3 where Name = "+name+"");
		*/
		//ResultSet result1 = statement.executeQuery("select CASE WHEN count(1) > 0 THEN 'true' ELSE 'false' END from Places where Name = '"+name+"'");
		
		//"IF EXISTS(SELECT FROM Places WHERE ID = -1 ) THEN select type from Places"

//DELETE FROM dbo.DimDate WHERE ID = -1

//ELSE*/
		//System.out.println("result: "+result);
		//ResultSet.
	}
}