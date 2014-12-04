package com.ixigo;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.net.URL;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.Page;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;

public class crawlIxigoPlacesService{

	private static String testFile = "target/ixigo/test.txt";
	public static void ExtractData() throws Exception
	{
		URL url = new URL("http://www.ixigo.com/rest/content/namedentity/v2/city/id?sort=po&order=dsc&cityId=503b2a95e4b032e338f14729&entityId=1&type=Places+To+Visit&limit=1589&filterKeys=&filterValues=");
		final WebClient webClient = new WebClient(BrowserVersion.FIREFOX_24);
		webClient.getOptions().setThrowExceptionOnScriptError(false);
		WebRequest request = new WebRequest(url);
		// Read the whole page
		Page page = webClient.getPage(request);
		String content = page.getWebResponse().getContentAsString();

		JSONParser parser=new JSONParser();
		/*System.out.println("=======decode=======");
        
		  String s="[0,{\"1\":{\"2\":{\"3\":{\"4\":[5,{\"6\":7}]}}}}]";
		  Object obj=parser.parse(s);
		  JSONArray array=(JSONArray)obj;
		  System.out.println("======the 2nd element of array======");
		  System.out.println(array.get(1));
		  System.out.println();
		                
		  JSONObject obj2=(JSONObject)array.get(1);
		  System.out.println("======field \"1\"==========");
		  System.out.println(obj2.get("1"));    

		                
		  s="{}";
		  obj=parser.parse(s);
		  System.out.println(obj);
		                
		  s="[5,]";
		  obj=parser.parse(s);
		  System.out.println(obj);
		                
		  s="[5,,2]";
		  obj=parser.parse(s);
		  System.out.println(obj);*/		
	//	StringBuilder sb = new StringBuilder(home.text());
		//home.body;
	//	System.out.println("sb length:"+sb.length());
		 Object obj=parser.parse("["+content+"]");
		 JSONArray array=(JSONArray)obj;
		 System.out.println("first:"+array.get(0));
		 System.out.println("second:"+array.get(1));
		FileOutputStream exception=new FileOutputStream(testFile);
		@SuppressWarnings("resource")
		PrintStream exe=new PrintStream(exception);
		System.out.println(content.length());
		exe.print(content);
		exe.close();	
	}
	
	public static void main(String args[]) throws Exception
	{
		/*File file= new File("ConfigFiles/ixigo/ixigoIDsOfCity.txt");
		Scanner in = new Scanner(file);
		while(in.hasNext())
		{
			
			
			
		}*/
		ExtractData();
		
	}
	
}