package com.zomato;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Scanner;

import GlobalClasses.HtmlUnitWebClient;

import com.dataTransferObject.ZomatoDto;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class ExtractData extends HtmlUnitWebClient{
	
	private static String exceptionUrls = "";
	private static String exceptionMsg = "";
	private static String exceptionFile = "target/zomato/exception.txt";
	private static String exceptionmsgFile = "target/zomato/exceptionmsg.txt";
	private static String AllLinksFile = "ConfigFiles/zomato/restaurantLinks.txt";
	
	@SuppressWarnings("resource")
	public static void getResturantData(zmtURL link) throws Exception
	{
		try{
		String address="",locality="",phone="",highlights="",openingHours="",cuisines="";
		String homeDelivery = "", dineIn = "", nonveg = "", ac = "", bar = "",numofvotes="";
		ArrayList<URL> photoLink=new ArrayList<URL>();
		String rating = "";
		int cost =-1;
		
		System.out.println("Getting Data");
		
		HtmlPage page=WebClient(link.url);
		
		System.out.println("Extracting from the page");
		
		DomElement addressArea 	= 	page.getFirstByXPath("//div[@class='grid_14 column omega']");
		DomElement ratingArea	= 	page.getFirstByXPath("//div[@class='res-rating pos-relative clearfix']");
		DomElement phoneArea 	= 	page.getFirstByXPath("//div[@id='phoneNoString']");
		DomElement infoArea 	= 	page.getFirstByXPath("//div[@class='ipadding info-tab']");
		DomElement photoArea 	= 	page.getFirstByXPath("//div[@class='res-photo-thumbnails']");

		//Get the address
		 if((addressArea!=null)&&(addressArea.hasChildNodes()))
		 {
			 DomElement addressE1=addressArea.getFirstElementChild();
			 if(addressE1!=null){
				DomElement addressE2 = addressE1.getNextElementSibling();
				if((addressE2!=null)&&(addressE2.hasChildNodes())){
					address = addressE2.asText().trim();
					DomElement localityE = addressE2.getFirstElementChild();
					if(localityE!=null)
					{
							locality=localityE.asText();						
					}
				}
			 }
		 }
		 
		//get the rating and no. of votes
		 if((ratingArea!=null)&&(ratingArea.hasChildNodes()))
		 {
			 rating = ratingArea.getFirstElementChild().asText().trim();
			 String votes=ratingArea.getLastElementChild().asText().trim();
			 numofvotes = votes.replaceAll("\\D+","");
		 }
		 
		 //get the phone no
		 if((phoneArea!=null)&&(phoneArea.hasChildNodes()))
		 {
			 DomElement phoneE1 = phoneArea.getFirstElementChild();
			 if((phoneE1!=null)&&(phoneE1.hasChildNodes()))
			 {
				 DomElement phoneE2 = phoneE1.getFirstElementChild();
				 if((phoneE2!=null)&&(phoneE2.hasChildNodes())){
						 phone = phoneE2.asText();
				 }
			 }
		 }
		 
		 //get other info
		 if((infoArea!=null)&&(infoArea.hasChildNodes())){
			 Iterable<DomElement> infoIterable = infoArea.getFirstElementChild().getChildElements(); 
			
			 //Iterate through all elements
			 Iterator<DomElement> infoIterator = infoIterable.iterator();
		 
			 while(infoIterator.hasNext())
			 {
				 DomElement infoE1=infoIterator.next();
				 if((infoE1!=null)&&(infoE1.hasChildNodes()))
				 {
					 DomElement infoE2=infoE1.getLastElementChild();
					 if((infoE2!=null)&&(infoE2.hasChildNodes()))
					 {	
						 DomElement infoE3= infoE2.getFirstElementChild();
						 
						 if((infoE3!=null)&&(infoE3.getTagName().contains("label")))
						 {
							 
							 String infoLable1=infoE3.asText().trim();
							 if(infoLable1.contains("Highlights"))
							 {
								 String HL[]=infoE2.asText().split("\n");
								 for(int i=1;i<HL.length;i++)
								 {
									 HL[i]=HL[i].trim();
									 if(HL[i].contains("Home Delivery"))
									 {
										 if(HL[i].contains("No"))
										 {
											 homeDelivery = "no";
										 }
										 else
										 {
											 homeDelivery = "yes";
										 }
									 }
									 if(HL[i].contains("Dine-In Available"))
									 {
										 dineIn = "yes";
									 }
									 if(HL[i].contains("Veg"))
									 {
										 if(HL[i].equals("Serves Non Veg"))
										 {
											 nonveg = "yes";
										 }
										 else if(HL[i].equals("Vegetarian Only"))
										 {
											 nonveg="no";											 
										 }
									 }
									 if(HL[i].contains("Air Conditioned"))
									 {
										 ac="yes";
									 }
									 if(HL[i].contains("Bar"))
									 {
										 if(HL[i].equals("Bar Available"))
										 {
											 bar = "yes";
										 }
										 else if(HL[i].equals("Bar Not Available"))
										 {
											 bar = "no";
										 }
									 }
									 highlights+=HL[i];
								 }
							 }
							 if(infoLable1.contains("Cost"))
							 {
								 Scanner in = new Scanner(infoE2.asText().trim()).useDelimiter("[^0-9]+");
								 cost = in.nextInt();
							 }
						 }
						 
						 if((infoE3!=null)&&(infoE3.hasChildNodes()))
						 {
							 DomElement infoE4 = infoE3.getFirstElementChild();
							 if((infoE4!=null)&&(infoE4.getTagName().contains("label")))
							 {
								 String infoLable2=infoE4.asText().trim();
								 if(infoLable2.contains("Opening hours"))
								 {
									 Iterator<DomElement> timeItr =infoE3.getChildElements().iterator();
									 while(timeItr.hasNext())
									 {
										DomElement timeE= timeItr.next();
										if((timeE.getTagName().contains("span")&&(timeE.getAttribute("class").contains("res-info-timings"))))
										{
											openingHours =timeE.asText().trim();
										}		
									 }
								 }
							 }
							 
							 if((infoE4!=null)&&(infoE4.hasChildNodes()))
							 {
								 DomElement infoE5 = infoE4.getFirstElementChild();
								 if((infoE5!=null)&&(infoE5.getTagName().contains("label")))
								 {
									 String infoLable3=infoE5.asText().trim();
									 if(infoLable3.contains("Cuisines"))
									 {
										 cuisines =infoE5.getNextElementSibling().asText().trim();
									 }
								 }
							 }
						 }
					 }
				 }

			 }
		 }
		 //photo area
		 if((photoArea!=null)&&(photoArea.hasChildNodes()))
		 {
			 Iterator<DomElement> photoIterator=photoArea.getChildElements().iterator();
			 while(photoIterator.hasNext())
			 {
				 try{
				 DomElement photoE2=photoIterator.next();
				 if((photoE2!=null)&&(photoE2.hasChildNodes())&&(photoE2.getTagName().contains("a")))
				 {
					 DomElement photoE3=photoE2.getFirstElementChild();
					 if((photoE3!=null)&&(photoE3.getTagName().contains("img")))
					 {
						 photoLink.add(new URL(photoE3.getAttribute("src")));
					 }		 
				 }	   
				}catch(Exception e){
					System.out.println("Exception occured");
					System.out.println(e.getMessage());
				}
			}
		}
		
		System.out.println("link "+ link.url);
		System.out.println("Title "+link.title);
		System.out.println("Country "+link.country);
		System.out.println("City "+link.city);
		System.out.println("address: "+address);
		System.out.println("locality: "+locality);
		System.out.println("rating: "+rating);
		System.out.println("votes: "+numofvotes);
		System.out.println("phoneNo "+phone);
		System.out.println(homeDelivery+","+ dineIn+","+ nonveg+"," +ac+"," +bar);
		System.out.println("Cost "+cost);
		System.out.println("openingHours "+openingHours);
		System.out.println("cuisines "+cuisines);
		for(int k=0;k<photoLink.size();k++)
		{
			 System.out.println(photoLink.get(k));
		}

		ZomatoDto zomatoDto = new ZomatoDto();
		
		zomatoDto.setSource("Zomato");
		zomatoDto.setCity(link.city.toUpperCase());		
		zomatoDto.setCountry(link.country.toUpperCase());
		zomatoDto.setLocality(locality);
		zomatoDto.setName(link.title.toUpperCase());
		zomatoDto.setAddress(address);
		zomatoDto.setPhone(phone);
		zomatoDto.setRating(rating);
		zomatoDto.setNumofvotes(numofvotes);
		zomatoDto.setHomeDelivery(homeDelivery);
		zomatoDto.setDineIn(dineIn);
		zomatoDto.setNonveg(nonveg);
		zomatoDto.setAc(ac);
		zomatoDto.setBar(bar);
		zomatoDto.setCost(cost);
		zomatoDto.setOpeninghrs(openingHours);
		zomatoDto.setCuisines(cuisines.toUpperCase());
		zomatoDto.setPhotolink(photoLink);
		
		System.out.println("Starting Transferring the data to DB");
		
		TransferDataZomato.transferData(zomatoDto);
		
		}catch(Exception e){
		
			System.out.println("Exception Occured. Adding to exceptionUrls");
			System.out.println(e);
			System.out.println(e.getMessage());
			exceptionUrls+=link.country+"&&&"+link.city+"&&&"+link.title+"&&&"+link.url+"\n";
			exceptionMsg+=e+"\n";
		}
		
		FileOutputStream exception=new FileOutputStream(exceptionFile);
		FileOutputStream exceptionmsg=new FileOutputStream(exceptionmsgFile);
		PrintStream e=new PrintStream(exception);
		PrintStream e1=new PrintStream(exceptionmsg);
		e.println(exceptionUrls);
		e1.println(exceptionMsg);
		e.close();
		e1.close();	
	}
	
	public static void main(String args[])throws Exception
	{
		Scanner inLink = new Scanner(new File(AllLinksFile));
		inLink.useDelimiter("\n");
		
		while(inLink.hasNext())
		{
			String link=inLink.next();
			String zmtLink[]=link.split("&&&");
			zmtURL zmturl = new zmtURL();
			zmturl.country = zmtLink[0] ;
			zmturl.city  =   zmtLink[1];
			zmturl.title =   zmtLink[2];
			zmturl.url = new URL(zmtLink[3]);
			
			getResturantData(zmturl);
			Thread.sleep(10000);
		}
		
		//for testing
		
		 /*  URL url = new URL("http://www.zomato.com/bangalore/adupadi-indiranagar");
		    zmtURL zmtLink = new zmtURL();
		 	zmtLink.country = "India";
		 	zmtLink.city = "Bangalore";
		 	zmtLink.title = "The 13th Floor";
		 	zmtLink.url = url;
			getResturantData(zmtLink);*/
	}
}