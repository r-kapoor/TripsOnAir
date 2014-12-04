package com.ixigo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;

public class GetJson {

	public static void main(String[] args) throws IOException {
		
		InputStream is = null;
		try {
			is = new URL("http://www.ixigo.com/rest/content/namedentity/v2/city/id?sort=po&order=dsc&cityId=503b2a78e4b032e338f10051&entityId=1&type=Places+To+Visit&limit=226&filterKeys=&filterValues=").openStream();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		BufferedReader r = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
		JsonReader reader = new JsonReader(r);
		JsonParser parser = new JsonParser();

		reader.beginObject(); // the initial '{'
		String name = reader.nextName();
		//reader.beginObject();
		System.out.println(name);
		//assert "Documents".equals(name);
		boolean value = reader.nextBoolean();
		System.out.println(value);
		name = reader.nextName();
		System.out.println(name);
		String data = reader.nextString();
		System.out.println(data.length());
		Reader stringReader = new StringReader(data);
		JsonReader dataReader = new JsonReader(stringReader);
		dataReader.beginArray();
		while(dataReader.hasNext()) {
		  JsonObject dataObject = parser.parse(dataReader).getAsJsonObject();
		  JsonObject id = dataObject.get("_id").getAsJsonObject();
		  String oid = id.get("$oid").getAsString();
		  System.out.println(oid);
		  //JsonArray filenames = doc.getAsJsonArray("Filenames");
		  // do something with the document here
		  // ...
		}

		dataReader.endArray(); // ending ']' of Documents
		 // final '}'
		dataReader.close();
	}

}
