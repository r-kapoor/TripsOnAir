package com.redbus;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.sql.Connection;
import java.sql.Statement;
import java.util.Iterator;
import java.util.List;

import GlobalClasses.ConnectMysql;
import GlobalClasses.HtmlUnitWebClient;

import com.dataTransferObject.RedBusDto;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * 
 * Crawls the main link of redBus
 * Sample Url to crawl : http://www.redbus.in/Booking/SelectBus.aspx?fromCityId=551&toCityId=1167&doj=31-Mar-2014&busType=Any&opId=0
 * @author rajat
 *
 */


public class ExtractData extends HtmlUnitWebClient{

	private static String exceptionUrls = "";
	private static String exceptionMsg = "";
	private static String exceptionFile = "target/redbus/exception.txt";
	private static String exceptionmsgFile = "target/redbus/exceptionmsg.txt";

	@SuppressWarnings("unchecked")
	public void getData(URL url) throws Exception {
	
		//set default value of variables
		try{
			
			//Setting the connections
			Connection conn=ConnectMysql.MySqlConnection();
			Statement statement = conn.createStatement();
			
		String operatorName="",busType="",departureTime="",arrivalTime="",duration="",rating="",ratingText="",fare="";
		
		//Set the URL of the page
		URL url1 = new URL("http://www.redbus.in/Booking/SelectBus.aspx?fromCityId=122&fromCityName=Bangalore&toCityId=124&toCityName=Hyderabad&doj=30-May-2014");
		
		HtmlPage page=WebClient(url1);

		List <DomElement> routesList = (List<DomElement>)page.getByXPath("//div[@id='onwardTrip']");
		DomElement routesElement=routesList.get(0).getFirstElementChild();
		
		if((routesElement!=null)&&(routesElement.hasChildNodes())){

			Iterable<DomElement> routesChildElements =routesElement.getChildElements();
			Iterator<DomElement> routesIterator = routesChildElements.iterator();

			//iterate over ul childs
			while(routesIterator.hasNext()){

				DomElement routesChildE=routesIterator.next();//li


				if((routesChildE!=null)&&(routesChildE.hasChildNodes())){

					DomElement busItem=routesChildE.getFirstElementChild();//class=busItem clearfix

					if((busItem!=null)&&(busItem.hasChildNodes())){

						Iterator<DomElement> busItemItr = busItem.getChildElements().iterator();

						while(busItemItr.hasNext())//Iterate over busItem
						{
							DomElement Item=busItemItr.next();

							if((Item!=null))
							{
								String divClass=Item.getAttribute("class");

								if(divClass.contains("detailsBlock busDataBlock")&&(Item.hasChildNodes()))
								{
									//System.out.println("test "+Item.asXml());
									//BUS Details
									Iterator<DomElement> detailsItr =Item.getChildElements().iterator();
									while(detailsItr.hasNext())
									{
										DomElement detailsE=detailsItr.next();
										if((detailsE!=null))
										{
											//System.out.println("details:"+detailsE.asXml());
											String detailsClass=detailsE.getAttribute("class");

											if(detailsClass.contains("BusName"))
											{
												operatorName=detailsE.asText().trim();	
											}

											if(detailsClass.contains("BusType"))
											{
												busType=detailsE.asText();	
											}
										}
									}
								}

								else if(divClass.contains("timeBlock busDataBlock"))
								{
									//Timing						
									if(Item.hasChildNodes())
									{
										Iterator<DomElement> timeItr=  Item.getChildElements().iterator();
										while(timeItr.hasNext())
										{
											DomElement timeE=timeItr.next();//div
											if((timeE!=null)&&(timeE.hasChildNodes()))
											{
												Iterator<DomElement> timeTypeItr=timeE.getChildElements().iterator();
												while(timeTypeItr.hasNext())
												{
													DomElement timeTypeE= timeTypeItr.next();

													if((timeTypeE!=null))
													{
														String type=timeTypeE.getAttribute("class");
														if(type.contains("DepartureTime"))
														{
															departureTime=timeTypeE.asText();
															break;
														}

														if(type.contains("ArrivalTime"))
														{
															arrivalTime=timeTypeE.asText();
															break;
														}

														if(type.contains("Duration"))
														{
															duration=timeTypeE.asText();
															break;
														}
													}
												}
											}
										}
									}
								}

								else if(divClass.contains("ratingsBlock busDataBlock"))
								{
									//ratingsBlock
									if(Item.hasChildNodes()){
										rating = Item.getFirstElementChild().getAttribute("title");
										ratingText = Item.asText().trim();
									}
								}

								else if(divClass.contains("fareBlock busDataBlock"))
								{
									if((Item.hasChildNodes())){
										DomElement fareE= Item.getFirstElementChild();//.asText();
										if((fareE!=null)&&(fareE.getTagName().contains("span"))&&(fareE.getAttribute("class").contains("fareSpan"))){
											fare=fareE.asText().trim();
										}
									}
								}
							}
						}
					}
				}
				System.out.println("\nname "+operatorName);
				System.out.println("type "+busType);//there is an issue with type
				System.out.println("depTime: "+departureTime);
				System.out.println("arrTime: "+arrivalTime);
				System.out.println("duration: "+duration);
				System.out.println("rating "+rating);
				System.out.println("ratingText: "+ratingText);
				System.out.println("fare "+fare);
				
				String origin = "Bangalore";
				String destination = "Hyderabad";
				String departureDate = "2014-02-24";//YYYY-MM-DD
				String source = "RedBus";
				
				RedBusDto redBusDto = new RedBusDto();
				
				redBusDto.setSource(source);
				redBusDto.setOperatorName(operatorName.toUpperCase());
				redBusDto.setBusType(busType.toUpperCase());
				redBusDto.setDepartureTime(departureTime);
				redBusDto.setArrivalTime(arrivalTime);
				redBusDto.setDuration(duration);
				redBusDto.setRating(rating);
				redBusDto.setRatingText(ratingText);
				redBusDto.setFare(fare);
				redBusDto.setOrigin(origin.toUpperCase());
				redBusDto.setDestination(destination.toUpperCase());
				redBusDto.setDepartureDate(departureDate);
				
				TransferDataRedBus.transferData(redBusDto, statement);

			}
		}//end of first if
		
		}catch(Exception e){
			
			System.out.println("Exception Occured. Adding to exceptionUrls");
			System.out.println(e);
			System.out.println(e.getMessage());
			exceptionUrls+=url+"\n";
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
	
	public static void main(String[] args) throws Exception {
		 ExtractData htmlUnit = new  ExtractData();
	     htmlUnit.getData(new URL("http://www.redbus.in/Booking/SelectBus.aspx?fromCityId=122&fromCityName=Bangalore&toCityId=124&toCityName=Hyderabad&doj=30-May-2014"));
		 //htmlUnit.getDetails();
	    }
}
