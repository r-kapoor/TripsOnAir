package com.tripadvisor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class TransformAddress {
	
	public String address;
	public String pincode;
	
	public TransformAddress(String address)
	{
		this.address = address;
		pincode = "";
	}

	public void modifyAddress(String city, String country) {
		/*
		 * Sample Test Addresses and City Country Combinatations
		//String address = "N. H. 24 | Near Noida Mor, New Delhi 110092, India (Minto Road)";
		//String address = "East Nizamudhin | 5 km (3 mi) southeast of Connaught Pl., New Delhi, India (Minto Road)";
		//String address = "Mehrauli, New Delhi, India (Mahrauli)";
		//String address = "Lucknow, India";
		//String address = "K R Colony, Domlur Layout, Airport Road, Bangalore 560071, India";
		//String address = "India";
		String address = "Lucknow 248118, India";
		
		String country = "India";
		//String city = "New Delhi";
		//String city = "Bangalore";
		String city = "Lucknow";
		
		String pincode="";
		*/
		if(!address.isEmpty())
		{
			if(address.contains(","))
			{
				if(address.contains(", "+country))
				{
					int start = address.lastIndexOf(", "+country);
					int end = start+2+country.length();
					address = address.substring(0, start)+address.substring(end);
					if(address.contains(","))
					{
						if(address.contains(", "+city))
						{
							start = address.lastIndexOf(", "+city);
							end = start+2+city.length();
							address = address.substring(0, start)+address.substring(end);
							Matcher m = Pattern.compile("(?<!\\d)\\d{6}(?!\\d)").matcher(address.substring(start));
							if(m.find())
							{
								pincode = m.group();
								start = address.lastIndexOf(pincode);
								end = start + 6;
								address = address.substring(0, start)+address.substring(end);
							}
						}
					}
					else if(address.contains(city))
					{
						start = address.lastIndexOf(city);
						end = start+city.length();
						address = address.substring(0, start)+address.substring(end);
						Matcher m = Pattern.compile("(?<!\\d)\\d{6}(?!\\d)").matcher(address.substring(start));
						if(m.find())
						{
							pincode = m.group();
							start = address.lastIndexOf(pincode);
							end = start + 6;
							address = address.substring(0, start)+address.substring(end);
						}
					}
						
				}
			}
			else if(address.contains(country))
			{
				int start = address.lastIndexOf(country);
				int end = start+country.length();
				address = address.substring(0, start)+address.substring(end);
			}
		}
		System.out.println("Address: "+address);
		System.out.println("Pincode: "+pincode);
		System.out.println("City: "+city);
		System.out.println("Country: "+country);

	}

}