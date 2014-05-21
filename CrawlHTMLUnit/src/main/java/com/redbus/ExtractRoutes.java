package com.redbus;

/**
 * @author rajat
 */

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.util.Scanner;

import GlobalClasses.HtmlUnitWebClient;

public class ExtractRoutes extends HtmlUnitWebClient{

	private static String base = "http://www.redbus.in";
	private static String routeLinks ="";
	private static String cityLinksFile = "ConfigFiles/redbus/cityLinks.txt";
	private static String routeLinksFile = "ConfigFiles/redbus/routeLinks.txt";
	private static String testLinksFile = "ConfigFiles/redbus/testLinks.txt";
	
	public static void getRoutes(URL url) throws Exception{
		
		int num=CrawlRedBus.getNumofCity(url);
		Thread.sleep(5000);
		
		if(num==0)
		{
			System.out.println("url"+url);
			routeLinks+=CrawlRedBus.getCityLinks(url);//if num is zero then extract the routes from directory url itself
			System.out.println(routeLinks);
		}
		else{
			for(int i=1;i<=num;i++)
			{
				String newLink = url.toString().substring(0, url.toString().indexOf(".aspx"))+"-"+i+".aspx";
				URL link = new URL(newLink);
				System.out.println(link);
				routeLinks+=CrawlRedBus.getCityLinks(link);
				Thread.sleep(10000);
			}
		}
	}
		
	public static void main(String[] args)throws Exception
	{
		Scanner in = new Scanner(new File(cityLinksFile));
		//Scanner in = new Scanner(new File(testLinksFile));
		in.useDelimiter("\n");
		while(in.hasNext())
		{
			String link=in.next();
			link=link.replace("\\","/");
			System.out.println("Citylink "+link);
			getRoutes(new URL(base+link));
			Thread.sleep(5000);
		}

		FileOutputStream routeStream = new FileOutputStream(routeLinksFile);
		PrintStream printRoute = new PrintStream(routeStream);
		printRoute.println(routeLinks);
		printRoute.close();
	}
}