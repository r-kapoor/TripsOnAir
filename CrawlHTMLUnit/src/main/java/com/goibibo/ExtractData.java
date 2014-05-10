package com.goibibo;

import java.net.URL;
import java.sql.Connection;
import java.sql.Statement;
import java.util.Iterator;

import org.junit.Test;

import GlobalClasses.ConnectMysql;
import GlobalClasses.HtmlUnitWebClient;

import com.dataTransferObject.GoibiboDto;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.zomato.TransferDataZomato;


/**
 * 
 * @author rahul
 *
 */

public class ExtractData extends HtmlUnitWebClient{

	@Test
    public static void getData() throws Exception {

		long startTime = System.currentTimeMillis();
		
		//Setting the connections
		Connection conn=ConnectMysql.MySqlConnection();
		Statement statement = conn.createStatement();
		
    	//Declarations
    	int i=1, durationHrs, priceRs;
    	String title, data, departureTime, origin, duration, stops, arrivalTime, destination, airline, flightNumber, price;
    	String[] dataArray;
    	DomElement flightDetails, flightData;
    	System.out.println("started Extracting Data");
    	
    	//Set the URL of the page
    	URL url = new URL("http://www.goibibo.com/flight-searchresult/#air-DEL-BLR-20140531--1-0-0-E");

    	HtmlPage page=WebClient(url);

        //Storing title of page
        title = page.getTitleText();
        
        //Getting to id="c2way"
        DomElement mainarea = page.getElementById("c2way");
        
        //Getting to list of prices of flights
        DomElement submain = mainarea.getFirstElementChild();
        
        //Get list of all Flight Details
        Iterable<DomElement> flightIterable = submain.getChildElements();
        
        //Iterate through all elements
        Iterator<DomElement> flightIterator = flightIterable.iterator();
		while(flightIterator.hasNext())
        {
        	//Get each row of flight details (ft_res_cls)
        	flightDetails = flightIterator.next();

        	//Get to ft_results
        	DomElement singleFlight = flightDetails.getFirstElementChild();

        	//Extract each detail according to the way it is stored
        	        	
        	//Extracting Departure Time and Place
            flightData = singleFlight.getFirstElementChild();
            data = flightData.getTextContent();
            dataArray = data.trim().split("\\s+");
            departureTime = dataArray[0];
            origin = dataArray[1];
            
            //Extracting Duration and Stops information
            flightData = flightData.getNextElementSibling();
            DomNodeList<HtmlElement> durAndStops = flightData.getElementsByTagName("span");
            duration = durAndStops.get(0).getTextContent();
            dataArray = flightData.asText().trim().split("\\s+");
            //System.out.println("Duration:"+d[0]+" "+d[1]);
            stops = dataArray[dataArray.length-2]+dataArray[dataArray.length-1];
            
            //Extracting Arrival Time and Place
            flightData = flightData.getNextElementSibling();
            DomNodeList<HtmlElement> nextDayInfo = flightData.getElementsByTagName("small");
            data = flightData.getTextContent();
            dataArray = data.trim().split("\\s+");
            arrivalTime = dataArray[0];
            if(nextDayInfo.getLength()>1)
            {
            	arrivalTime += " Next Day";
            }
            destination = dataArray[dataArray.length-1];
            
            //Extracting Airline and Flight Number
            flightData = flightData.getNextElementSibling();
            DomNodeList<HtmlElement> airlineData = flightData.getElementsByTagName("span");
            airline = airlineData.get(0).getFirstChild().getTextContent().trim().replaceAll("\\s+", " ");
            DomNodeList<HtmlElement> flightnumData = flightData.getElementsByTagName("i");
            flightNumber = flightnumData.get(0).getTextContent().trim().replaceAll("\\s+", " ");
            
            //Extracting Price
            flightData = flightData.getNextElementSibling().getNextElementSibling();
            price = flightData.getTextContent().trim().replaceAll("\\s+", " ").split("\\s+")[0];
            priceRs = Integer.parseInt(price.replaceAll("[^0-9]",""));
            
            String origincountry = "India", destinationcountry = "India";
            String departureDate = "2014-06-01";//YYYY-MM-DD
            String classofTravel = "Economy";
            
            //Printing All
            System.out.println("\nFlight:"+i); 
            System.out.println("Start Time:"+departureTime);
            System.out.println("Origin:"+origin);
            System.out.println("Duration:" + duration);
            System.out.println("Stops:" + stops);
            System.out.println("Arrival Time:" + arrivalTime);
            System.out.println("Destination:" + destination);
            System.out.println("Airline:" + airline);
            System.out.println("Flight No.:" + flightNumber);
            System.out.println("Price:" + price);
            System.out.println("Price in Rs:" + priceRs);
            
            GoibiboDto goibiboDto = new GoibiboDto();
            
            goibiboDto.setSource("Goibibo");
            goibiboDto.setDepartureTime(departureTime);
            goibiboDto.setDepartureDate(departureDate);
            goibiboDto.setOrigin(origin.toUpperCase());
            goibiboDto.setOrigincountry(origincountry.toUpperCase());
            goibiboDto.setDuration(duration);
            goibiboDto.setStops(stops);
            goibiboDto.setArrivalTime(arrivalTime);
            goibiboDto.setDestination(destination.toUpperCase());
            goibiboDto.setDestinationcountry(destinationcountry.toUpperCase());
            goibiboDto.setAirline(airline.toUpperCase());
            goibiboDto.setFlightNumber(flightNumber);
            goibiboDto.setPrice(price);
            goibiboDto.setClassofTravel(classofTravel);
            
            System.out.println("Starting Transferring the data to DB");
    		
    		TransferDataGoibibo.transferData(goibiboDto, statement);
            
            i++;
        }
        
        //webClient.closeAllWindows();
		long endTime   = System.currentTimeMillis();
		long totalTime = endTime - startTime;
		System.out.println("totalTime "+totalTime);
    }
	
}
