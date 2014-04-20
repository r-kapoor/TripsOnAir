package com.bookingdotcom;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * 
 * @author rajat
 *
 */

public class ExtractPrice {

	private static String urlFile = "ConfigFiles/bookingdotcom/priceCheckingUrls.txt";
	private static ArrayList<URL> priceExtractUrls = new ArrayList<URL>();
	
	@SuppressWarnings("resource")
	public static void getPrice() throws Exception
	{
		ArrayList<URL> list = new ArrayList<URL>(); 
		Scanner in = new Scanner(new File(urlFile));
		while(in.hasNext())
		{
			String url=in.next();
			list=UrlBuilder.HotelUrlBuilder(url);
			for(int i=0;i<list.size();i++)
			{
				priceExtractUrls.add(list.get(i));
			}
		}	
		
		for(int j=0;j<priceExtractUrls.size();j++)
		{
			ExtractData.getPrices(priceExtractUrls.get(j));
			System.out.println(priceExtractUrls.get(j));
			Thread.sleep(3000);
		}
	}
	
	
	public static void main(String args[]) throws Exception
	{
		getPrice();
	}
	
}