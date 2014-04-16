package com.tripadvisor;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

import GlobalClasses.HtmlUnitWebClient;

import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.dataTransferObject.*;

/**
 * @author rahul
 * Get the details from the subChildLink
 * Sample subChildLink:"http://www.tripadvisor.in/Attraction_Review-g297628-d325159-Reviews-Bull_Temple-Bangalore_Karnataka.html"
 */


public class ExtractData extends HtmlUnitWebClient{

	private static String exceptionFile = "target/tripAdvisor/exception.txt";
	private static String exceptionUrls = "";
	private static String exceptionmsgFile = "target/tripAdvisor/exceptionmsg.txt";
	private static String exceptionMsg = "";
	@SuppressWarnings("unchecked")
	public static void getDetails(DataUrl url) throws Exception {
		
		try{
		// Read the whole page
			
		System.out.println("Getting details for link:"+url.link);
		
		HtmlPage page=WebClient(url.link);
		List<DomElement> placeArea = (List<DomElement>) page
				.getByXPath("//div[@id='HEADING_GROUP']");

		
		// Get the Heading Group
		DomElement headinggroup = placeArea.get(0);

		// Get the heading (name)
		DomElement heading = headinggroup.getFirstElementChild();
		String name = heading.getFirstElementChild().asText();
		
		System.out.println("Got name");

		// Get the address and other details(if present) Element
		DomElement detailsE = heading.getNextElementSibling();
		
		// Get the address element
		DomElement addressE = detailsE.getFirstElementChild();
		String address = addressE.asText().trim();

		System.out.println("Got address");
		
		String phone = "", ranktext = "", rating = "", numofreviews = "", type = "", fee = "", duration = "", description = "",photoLink="";
		Boolean isTravellersChoice = false, isCoE = false;
		String durValue="";int durationV = -1;
		
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
			
			System.out.println("Getting other details");
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
				
				System.out.println("Getting Listing Details");
				
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
		DomElement photoArea = (DomElement) page.getFirstByXPath("//div[@class='photo ']");
		if((photoArea!=null)&&(photoArea.hasChildNodes()))
		{
			if(photoArea.getFirstElementChild().hasChildNodes())
			{	
				DomElement photoE1=photoArea.getFirstElementChild();
				if((photoE1!=null)&&(photoE1.hasChildNodes()))
				{
					DomElement photoE2 = photoE1.getFirstElementChild();
					if(photoE2.getTagName().contains("div")&&(photoE2.hasChildNodes()))
					{
						DomElement photoE3 =photoE2.getFirstElementChild();
						if((photoE3!=null)&&(photoE3.hasChildNodes()))
						{
							photoLink=photoE3.getAttribute("src");
							
							System.out.println("Got Photolink");
						}
					}
				}
				
			}
		}
		
		if(!(duration.equals(""))){
			@SuppressWarnings("resource")
		Scanner in = new Scanner(duration).useDelimiter("[^0-9]+");
		durationV= in.nextInt();
		 
		}
		durValue +=durationV;
		fee= fee.replace("Fee: ","");
		type = type.replace("Type: ","");
		String des[]=description.split("\n");
		if(des.length>1)
		{
			description=des[1];
		}
		
		//Getting the country, state and city
		String country = url.country;
		String city = url.city;
		String state = url.state;
		
		//Transforming the address by removing the city and country and getting pincode
		TransformAddress transadd = new TransformAddress(address);
		transadd.modifyAddress(city, country);
		
		System.out.println("Printing the details extracted");
		
		System.out.println("Name: " + name);
		System.out.println("Country "+country);
		System.out.println("City "+city);
		System.out.println("State "+state);
		System.out.println("Address: " + transadd.address);
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

		System.out.println("Setting the details got");
		
		TripAdvisorDto tripAdvisorDto = new TripAdvisorDto();
		
		tripAdvisorDto.setSource("TripAdvisor");
		tripAdvisorDto.setCity(city.toUpperCase());
		tripAdvisorDto.setState(state.toUpperCase());
		tripAdvisorDto.setCountry(country.toUpperCase());
		tripAdvisorDto.setName(name.toUpperCase());
		tripAdvisorDto.setAddress(transadd.address);
		tripAdvisorDto.setPincode(transadd.pincode);
		tripAdvisorDto.setPhone(phone);
		tripAdvisorDto.setRanktext(ranktext);
		tripAdvisorDto.setRating(rating);
		tripAdvisorDto.setNumofreviews(numofreviews);
		tripAdvisorDto.setIsCoE(isCoE);
		tripAdvisorDto.setIsTravellersChoice(isTravellersChoice);
		tripAdvisorDto.setType(type.toUpperCase());
		tripAdvisorDto.setDurValue(durValue);
		tripAdvisorDto.setDescription(description);
		tripAdvisorDto.setPhotolink(photoLink);
		tripAdvisorDto.setFee(fee);
		
		System.out.println("Starting Transferring the data to DB");
		
		TransferData.transferData(tripAdvisorDto);
		
		}catch(Exception e){
			System.out.println("Exception Occured. Adding to exceptionUrls");
			System.out.println(e);
			System.out.println(e.getMessage());
			exceptionUrls+=url.link+"\n";
			exceptionMsg+=e+"\n";
		}
		
		FileOutputStream exception=new FileOutputStream(exceptionFile);
		FileOutputStream exceptionmsg=new FileOutputStream(exceptionmsgFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(exception);
		PrintStream e1=new PrintStream(exceptionmsg);
		e.println(exceptionUrls);
		e1.println(exceptionMsg);
		e.close();
		e1.close();
		
	}
}