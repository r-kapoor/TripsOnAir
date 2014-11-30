package com.dgca;


import java.io.File;
import java.io.FileNotFoundException;
import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Scanner;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Session;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.DgcaDto;

public class ReadDgcaFlights extends getHibernateSession{

	public static void main(String[] args) {
		String[] resources = {"com/hibernate/FlightSchedule.hbm.xml", "com/hibernate/City.hbm.xml"};
		Session session=getHibernateSession(resources);
		DateFormat formatter = new SimpleDateFormat("hh:mm:ss");
		File dgcaFile = new File("./ConfigFiles/dgca/flight.csv");
		try {
			Scanner scanner = new Scanner(dgcaFile);
			scanner.useDelimiter(System.getProperty("line.separator"));
			int lineNum=0;
			String originCity = "";
			while(scanner.hasNext())
			{
				//System.out.println("Processing Line:"+lineNum);
				lineNum++;
				String line = scanner.next();
				String[] columns = line.split(",");
				if(columns.length == 1)
				{
					//It is the name of the source
					originCity = columns[0];
					continue;
				}
				
				DgcaDto dgcaDto = new DgcaDto();
				dgcaDto.setOriginCity(originCity);
				String destinationCity = columns[0];
				String operator = columns[1];
				String flightNumber = columns[2];
				String carrierType = columns[3];
				
				String daysOfTravelFile = columns[4];
				String daysOfTravel = "";
				if(daysOfTravelFile.equals("Daily"))
				{
					daysOfTravel = "0";//0 means Daily in db
				}
				else
				{
					//The days are present in the file 1-7 for Monday - Sunday
					//In the db they are as 1-7 for Sunday - Saturday
					for(int charInd=0; charInd < daysOfTravelFile.length(); charInd++)
					{
						char day = daysOfTravelFile.charAt(charInd);
						if(day == '7')
						{
							daysOfTravel += '1'; //7 in file = Sunday = 1 in db
						}
						else
						{
							daysOfTravel += (char)(day+1);
						}
					}
				}
				if(daysOfTravel.equals(""))
				{
					daysOfTravel = "8"; //Value 8 implies some problem
				}
				
				String departureTimeFile = columns[5];
				departureTimeFile = StringUtils.leftPad(departureTimeFile, 4, '0');
				departureTimeFile = departureTimeFile.substring(0,2) + ":" +departureTimeFile.substring(2) + ":00";
				Time departureTime = new Time(0);
				try {
					departureTime = new Time(formatter.parse(departureTimeFile).getTime());
				} catch (ParseException e) {
					e.printStackTrace();
				}
				
				String arrivalTimeFile = columns[6];
				arrivalTimeFile = StringUtils.leftPad(arrivalTimeFile, 4, '0');
				arrivalTimeFile = arrivalTimeFile.substring(0,2) + ":" +arrivalTimeFile.substring(2) + ":00";
				Time arrivalTime = new Time(0);
				try {
					arrivalTime = new Time(formatter.parse(arrivalTimeFile).getTime());
				} catch (ParseException e) {
					e.printStackTrace();
				}
				
				String hopsFile = "0";
				if(columns.length == 8)
				{
					hopsFile = columns[7];
				}
				int hops = 0;
				try {
					hops = Integer.parseInt(hopsFile);					
				} catch (NumberFormatException e) {
					e.printStackTrace();
				}				
				
				dgcaDto.setDestinationCity(destinationCity);
				dgcaDto.setOperator(operator);
				dgcaDto.setFlightNumber(flightNumber);
				dgcaDto.setDaysOfTravel(daysOfTravel);
				dgcaDto.setDepartureTime(departureTime);
				dgcaDto.setArrivalTime(arrivalTime);
				dgcaDto.setHops(hops);
				dgcaDto.setCarrierType(carrierType);
				
				System.out.println(dgcaDto);
				
				TransferDataFlights.transferData(dgcaDto, session);
				
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
}
