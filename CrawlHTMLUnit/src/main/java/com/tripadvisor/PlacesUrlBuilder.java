package com.tripadvisor;

import java.net.URL;
import java.util.ArrayList;

/**
 * Generate URL for different pageNumber in the sample url
 * Sample Url:"http://www.tripadvisor.in/AllLocations-g297628-c2-Attractions-Bangalore_Karnataka.html"
 * @author rajat
 * 
 */

public class PlacesUrlBuilder {

	public static ArrayList<URL> trpAdvUrl(URL url, int num) throws Exception {
		int x = 0;
		ArrayList<URL> urlList = new ArrayList<URL>();

		String URL = url.toString();
		int t = URL.indexOf("c2");

		String s1 = URL.substring(0, t);
		String s2 = URL.substring(t + 2, URL.length());

		for (int i = 1; i < num; i++) {
			x = x + 100;
			String newUrl = s1 + "c2-o" + x + s2;
			URL newurl = new URL(newUrl);
			urlList.add(newurl);
		}
		return urlList;
	}
}
