package com.indianRail;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

import GlobalClasses.getHibernateSession;

import com.dataTransferObject.IndianRailwayDto;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


/**
 * @author rajat
 * Crawl railways data from cleartrip
 * Starting Link:https://www.cleartrip.com/trains/list?page=1
 * IMP: If crawled again, then remove train data with train No = 12493, 12494
 */

public class CrawlIndianRail extends getHibernateSession {

	private static String exceptionUrls = "";
	private static String exceptionUrlsFile = "target/indianRail/exceptionUrls.txt";
	
	public void getTrains()throws Exception {
		int count=0;
		URL detailsUrl=new URL("https://www.test2345.com");
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		String resources[] = {"com/hibernate/RailwayStation.hbm.xml","com/hibernate/RailwayTimetable.hbm.xml", "com/hibernate/Trains.hbm.xml"};
		SessionFactory sessionFactory = getHibernateSessionFactory(resources);
		Session session=getHibernateSession(sessionFactory);
		DomElement trainNoDetails;
		int pagesNo=6;//Need to be set Manually
		//Set the URL of the page
		for(int i=0;i<=pagesNo;i++){
			
			URL url = new URL("https://www.cleartrip.com/trains/list?page="+i);
			//URL url = new URL("https://www.hkujhbiu.com");
			try{
			WebRequest request = new WebRequest(url);	    
			//Read the whole page
			HtmlPage page = webClient.getPage(request);
			
			List<DomElement> table = (List<DomElement>)page.getByXPath("//table[@class='results']");
		    DomElement mainarea = table.get(0);
		    
		    if((mainarea!=null)&&(mainarea.hasChildNodes()))
		    {
		    	DomElement mainAreaChild=mainarea.getFirstElementChild().getNextElementSibling();
		    	if((mainAreaChild!=null)&&(mainAreaChild.hasChildNodes()))
		    	{
		    		Iterable<DomElement> TrainDetails=mainAreaChild.getChildElements();
		    		Iterator<DomElement> TrainDetailsIterator = TrainDetails.iterator();
		    		
		    		while(TrainDetailsIterator.hasNext())
			        {
		    			/*if(count<90)
		    			{
		    				count++;
		    				TrainDetailsIterator.next();
		    				continue;
		    			}*/
		    			try{
			    			//Get each row of TrainDetails (tr)
							trainNoDetails = TrainDetailsIterator.next();						
				        	if(trainNoDetails!=null){
					        	String TrainNo = trainNoDetails.getFirstElementChild().asText();
					        	String TrainName=trainNoDetails.getFirstElementChild().getNextElementSibling().asText();
					        	detailsUrl  = new URL("https://www.cleartrip.com/trains/"+TrainNo);
					        	System.out.println("detailsUrl: "+detailsUrl);
					        	//set the train no. and train Name in dto
					        	IndianRailwayDto indianRailwayDto = new IndianRailwayDto();
					        	indianRailwayDto.setName(TrainName);
					        	indianRailwayDto.setTrainNo(Integer.parseInt(TrainNo));
					        	if(TrainName.toLowerCase().contains("duronto"))
			        			{
					        		indianRailwayDto.setType("DURONTO");
			        			}
					        	else if(TrainName.toLowerCase().contains("rajdhani"))
					        	{
					        		indianRailwayDto.setType("RAJDHANI");
					        	}
					        	else if(TrainName.toLowerCase().contains("jan shatabdi"))
					        	{
					        		indianRailwayDto.setType("JAN SHATABDI");
					        	}
					        	else if(TrainName.toLowerCase().contains("shatabdi"))
					        	{
					        		indianRailwayDto.setType("SHATABDI");
					        	}
					        	else if(TrainName.toLowerCase().contains("garib rath"))
					        	{
					        		indianRailwayDto.setType("GARIB RATH");
					        	}
					        	else if(TrainName.toLowerCase().contains("superfast"))
								{
					        		indianRailwayDto.setType("SUPERFAST");
								}
					        	else if((TrainName.toLowerCase().contains("express"))||(TrainName.toLowerCase().contains("mail")))
					        	{
					        		indianRailwayDto.setType("EXPRESS");
					        	}
					        	getDetails(detailsUrl,indianRailwayDto);
					        	TransferDataRailway.transferData(indianRailwayDto,session);
			        		}
		    			}
		    			catch(Exception e){
		    				exceptionUrls=new Date()+" "+detailsUrl+"\n";
		    				System.out.println(detailsUrl+",Error:"+e+",Error Message:"+e.getMessage());
		    				exceptionUrls+="Error:"+e+",Error Message:"+e.getMessage()+"\n";
		    				if(!(e.getMessage().contains("IndexOutOfBoundsException"))||(e.getMessage().contains("UnknownHostException"))){
		    					Thread.sleep(5*60*1000);//sleep for 5 mins
		    				}
		    				System.out.println("Writing Exceptions, if any, into file");		
		    				FileOutputStream exception=new FileOutputStream(exceptionUrlsFile,true);
		    				@SuppressWarnings("resource")
		    				PrintStream exe=new PrintStream(exception);
		    				exe.append(exceptionUrls);
		    				exe.close();
		    			}
			        }
		    	}
		    }
		}
		catch(Exception e)
		{
			exceptionUrls=new Date()+" "+url+":";
			System.out.println(url+":"+e.getMessage());
			exceptionUrls+=e.getMessage()+"\n";
			if(!(e.getMessage().contains("IndexOutOfBoundsException"))||(e.getMessage().contains("UnknownHostException"))){
				Thread.sleep(5*60*1000);//sleep for 5 mins
				}
			System.out.println("Writing Exceptions, if any, into file");		
			FileOutputStream exception=new FileOutputStream(exceptionUrlsFile, true);
			@SuppressWarnings("resource")
			PrintStream e1=new PrintStream(exception);
			e1.append(exceptionUrls);
			e1.close();
		}
	}
		
		/*System.out.println("Writing Exceptions, if any, into file");		
		FileOutputStream exception=new FileOutputStream(exceptionUrlsFile);
		@SuppressWarnings("resource")
		PrintStream e=new PrintStream(exception);
		e.append(exceptionUrls);
		e.close();*/
}
	public void getDetails(URL url,IndianRailwayDto indianRailwayDto) throws Exception {
		
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		DomElement way2go;
		String days="",pantry="",stationName="",stationCode="";
		final ArrayList<arrayListObject> trainDataList= new ArrayList<arrayListObject>();
		
		//Set the URL of the page
		//URL url = new URL("https://www.cleartrip.com/trains/12723");
		WebRequest request = new WebRequest(url);
	    
		//Read the whole page
		HtmlPage page = webClient.getPage(request);
		
		List<DomElement> trainDetails = (List<DomElement>)page.getByXPath("//div[@class='trainDetails']");
	    DomElement mainarea = trainDetails.get(0);

	    if((mainarea!=null)&&(mainarea.hasChildNodes())){
		    DomElement basicDetails= mainarea.getFirstElementChild();
		    DomElement path=mainarea.getLastElementChild();
		    
		    if((basicDetails!=null)&&(path!=null)&&(basicDetails.hasChildNodes())&&(path.hasChildNodes()))
		    {
		    	String basicDetail[]= basicDetails.getFirstElementChild().asText().split("\n");
			    for(int i=0;i<basicDetail.length;i++)
			    {
			    	if(basicDetail[i].indexOf("Days ")!=-1)
			    	{
			    		days=basicDetail[i].replace("Days ","").trim();
			    	}
			    	else if(basicDetail[i].indexOf("Pantry ")!=-1)
			    	{
			    		pantry=basicDetail[i].replace("Pantry ","").trim();
			    	}
			    }

			    String day[]=days.split(",");String dayNo="";

			    if(day.length==7)
			    {
			    	indianRailwayDto.setDays("0");
			    }
			    else
			    {
			    	for(int i=0;i<day.length;i++)
				    {
				    	if(day[i].trim().equals("Su"))
				    	{
				    		dayNo+="1";
				    	}
				    	else if(day[i].trim().equals("M"))
				    	{
				    		dayNo+="2";
				    	}
				    	else if(day[i].trim().equals("T"))
				    	{
				    		dayNo+="3";
				    	}
				    	else if(day[i].trim().equals("W"))
				    	{
				    		dayNo+="4";
				    	}
				    	else if(day[i].trim().equals("Th"))
				    	{
				    		dayNo+="5";
				    	}
				    	else if(day[i].trim().equals("F"))
				    	{
				    		dayNo+="6";
				    	}
				    	else if(day[i].trim().equals("Sa"))
				    	{
				    		dayNo+="7";
				    	}
				    	else
				    	{
				    		dayNo="8";
				    	}
				    }
			    	indianRailwayDto.setDays(dayNo);
			    	
			    }
			    if(pantry.toLowerCase().contains("yes"))
			    {
			    	indianRailwayDto.setPantry((byte)1);
			    }
			    else if(pantry.toLowerCase().contains("no"))
			    {
			    	indianRailwayDto.setPantry((byte)0);
			    }
			    else
			    {
			    	indianRailwayDto.setPantry((byte)(-1));
			    }
   
			    DomElement pathFirstChild=path.getFirstElementChild();
			    if((pathFirstChild!=null)&&(pathFirstChild.hasChildNodes()))
			    {
			    	DomElement pathFirstChildsChild=pathFirstChild.getFirstElementChild();
			    	if(pathFirstChildsChild.hasChildNodes())
			    	{
			    		  Iterable<DomElement> pathDetails = pathFirstChildsChild.getChildElements();
			    		  Iterator<DomElement> pathDetailsIterator = pathDetails.iterator();
			    		  DateFormat formatter = new SimpleDateFormat("hh:mm:ss");
			    		  while(pathDetailsIterator.hasNext())
			    		  {
			    			  //Get each row of TrainDetails (tr)
								way2go = pathDetailsIterator.next();
								//make trainData object 
								arrayListObject trainData= new arrayListObject();
					        	//Get to all tds
								if(way2go.hasChildNodes()){
									Iterator<DomElement> way2goIterator=way2go.getChildElements().iterator();
						        	int columnNo=1;
									while(way2goIterator.hasNext())
									{
										String element=way2goIterator.next().asText();
										if(columnNo==1)
										{
											columnNo++;
											continue;
										}
										else if(columnNo==2)
						        		{
						        			stationName=element.substring(0,element.indexOf("(")).trim();
						        			stationCode=element.substring(element.indexOf("(")+1,element.indexOf(")"));
						        			trainData.setStationName(stationName);
						        			trainData.setStationCode(stationCode);
						        		}
						        		else if(columnNo==3)
						        		{
						        			if(element.contains("Starts"))
						        			{
						        				trainData.setArrTime(null);
						        			}
						        			else
						        			{
						        				trainData.setArrTime(new java.sql.Time(formatter.parse(element.trim()+":00").getTime()));
						        			}
						        			
						        		}
						        		else if(columnNo==4)
						        		{
						        			if(element.contains("Ends"))
						        			{
						        				trainData.setDeptTime(null);
						        			}
						        			else{
						        				trainData.setDeptTime(new java.sql.Time(formatter.parse(element.trim()+":00").getTime()));
						        			}
						        		}
						        		else if(columnNo==6)
						        		{
						        			trainData.setDistTravelled(Integer.parseInt(element.replaceAll("[^0-9]", "").trim()));
						        		}
						        		
						        		else if(columnNo==7)
						        		{
						        			trainData.setDay(Byte.valueOf(element.trim()));
						        		}
						        		else if(columnNo==8)
						        		{
						        			trainData.setRoute(Byte.valueOf(element.trim()));
						        		}
										columnNo++;
						        	}
									trainDataList.add(trainData);
								}
			    		  }
			    		  indianRailwayDto.setStationsDetails(trainDataList);
			    	}
			    }
			 }
	    }
}
	
	public static void main(String[] args) throws Exception {
		CrawlIndianRail htmlUnit = new  CrawlIndianRail();
	       htmlUnit.getTrains();
	    }
	
}