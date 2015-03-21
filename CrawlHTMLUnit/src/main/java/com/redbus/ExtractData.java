package com.redbus;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.sql.Connection;
import java.sql.Statement;
import java.util.Iterator;
import java.util.Scanner;

import GlobalClasses.ConnectMysql;
import GlobalClasses.HtmlUnitWebClient;

import com.dataTransferObject.RedBusDto;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * 
 * Crawls the main link of redBus
 * Sample Url to crawl : http://www.redbus.in/bus-tickets/bangalore-ooty.aspx
 * @author rajat
 *
 */


public class ExtractData extends HtmlUnitWebClient{

	private static String base ="http://www.redbus.in";
	private static String exceptionUrls = "";
	private static String exceptionMsg = "";
	private static String exceptionFile = "target/redbus/routeException.txt";
	private static String exceptionmsgFile = "target/redbus/routeExceptionMsg.txt";
	private static String routesFile = "ConfigFiles/redbus/routeLinksTest.txt";
	
	public static void getBusData(URL url)throws Exception
	{
		String operatorName="";
		String originId="unknown",destId="unknown",originName="unknown",destName="unknown";
		try{
		
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();
		
		HtmlPage page=WebClient(url);
		
		DomElement sourceE=page.getFirstByXPath("//input[@id='DDLSource']");
		DomElement destE= page.getFirstByXPath("//input[@id='DDLDestination']");
		
		
		if((sourceE!=null)&&(sourceE.hasAttribute("name")))
		{
			originId=sourceE.getAttribute("name");
			originName=sourceE.getAttribute("value");
			//System.out.println("originId "+originId);
			//System.out.println("originName "+originName);
		}
		
		if((destE!=null)&&(destE.hasAttribute("name")))
		{
			destId=destE.getAttribute("name");
			destName=destE.getAttribute("value");
			//System.out.println("destId "+destId);
			//System.out.println("destName "+destName);
		}
		
		
		DomElement table = page.getFirstByXPath("//table[@id='Table1']");
		
		if((table!=null)&&(table.hasChildNodes()))
		{
			DomElement tbody = table.getFirstElementChild();
			
			if((tbody!=null)&&(tbody.hasChildNodes()))
			{
				Iterator<DomElement> rowItr = tbody.getChildElements().iterator();
				while(rowItr.hasNext())
				{
					String var[] = new String[7];int i=0;
					String busType="",departureTime="",arrivalTime="",rating="",ratingText="",fare="",duration="";
					DomElement rowE=rowItr.next();
					if((rowE!=null)&&(rowE.getAttribute("class").contains("TBRow"))&&(rowE.hasChildNodes()))
					{
						Iterator<DomElement> tdItr =rowE.getChildElements().iterator();
						while(tdItr.hasNext())
						{
							DomElement colmn=tdItr.next();
							var[i]=colmn.asText().trim();
							
							if(i==0)
							{
								String nameType[]=var[i].split("\n");
								operatorName=nameType[0];
								busType=nameType[1];
//								System.out.println("operatorName "+operatorName);
//								System.out.println("busType "+busType);
							}
							else if(i==1)
							{
								departureTime=var[i];
								//System.out.println("departureTime "+departureTime);
							}
							else if(i==2)
							{
								arrivalTime=var[i];
								//System.out.println("arrivalTime "+arrivalTime);
							}
							else if(i==3)
							{
								duration = var[i];
								//System.out.println("duration "+duration);
							}
							else if(i==4)
							{
								fare = var[i];
								//System.out.println("fare "+fare);
							}
							else if(i==5)
							{
								if(!var[i].toLowerCase().contains("no ratings"))
								{	
									String rateNumber[]=var[i].split("\n");
									rating=rateNumber[0].replaceAll("[^0-9.]", "");
									ratingText = rateNumber[1];
								}
//								System.out.println("rating "+rating);
//								System.out.println("ratingText "+ratingText);
							}
							i++;
						}	
							//String departureDate = "2014-02-24";//YYYY-MM-DD
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
							redBusDto.setOrigin(originName.toUpperCase());
							redBusDto.setDestination(destName.toUpperCase());
							//redBusDto.setDepartureDate(departureDate);
							
							TransferDataRedBus.transferData(redBusDto, statement);				
					}
				}
			}	
		}
	}catch(Exception e)
	{
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
		 //URL url = new URL("http://www.redbus.in/bus-tickets/bangalore-hyderabad.aspx"); 
		Scanner in = new Scanner(new File(routesFile));
		while(in.hasNext())
		{
			String link=in.next().replace("\\", "/");
			System.out.println(link);
			URL url = new URL(base+link);
			getBusData(url);
		}
	 }
}
