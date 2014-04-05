package com.ixigo;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;


public class crawlIxigoPlaces {
	public static void main(String args[]) throws IOException
	{
			//Declarations
			String PlaceCategory[]=new String[5];
			
			//Getting the complete Page of a Place(City)
			Document home = Jsoup.connect("http://www.ixigo.com/travel-guide/lucknow").get();
			
			//Getting the title
			String title = home.title();
			System.out.println("Title:"+title);
			
			//Getting the mainpart of the page which contains all data
			Elements mainPartouter = home.body().select("div#ixiPage").select("div#ixiPageContent").select("div.wrapper").select("div.container").select("div#ixiSearchResponse.grid-row").select("div.main-section.span24.offset1").select("div#ixiResBody");
			
			//Getting the name of the place
			Elements name = mainPartouter.select("div.entity-header").select("div.pos-rel").select("div.ixi-h-1");
			
			//Getting the places to visit listed on the main page
			Elements place = mainPartouter.select(".cur-default.jt .ixi-block #whatToSeeWidget #whatToSee .top-mar.overflow-vis #placeToSeeGallery .carousel-inner .item .namedentity-item .namedentity-info  .ne-title a span.link");
			
			//Getting the description of the place
			Elements description = mainPartouter.select(".cur-default.jt #panoramioWidgetContainer .show.pos-rel.top-mar .grid-row .span10 .description-container");
			
			//Getting the places to visit button which leads to the page where all places are listed
			Elements placestovisit = mainPartouter.select(".cur-default.jt .ixi-block #whatToSeeWidget.zeus-widget-container #whatToSee .box-h .rfloat a.i-b.download-button.ne-score");
			
						
			//Printing the details got to stdout
			System.out.println("Places:\n"+placestovisit.text());
			System.out.println("Name:"+name.text());
			System.out.println("Places to visit:\n"+place.text());
			System.out.println("Description:\n"+description.text());
			
			//Getting the link to the places to visit page
			String linkHref = placestovisit.attr("href");
			
			//Getting the said page
			Document visitplaces = Jsoup.connect("http://www.ixigo.com"+linkHref).get();
			
			//Getting the main part of the page
			Elements mainPart = visitplaces.body().select("div#ixiPage").select("div#ixiPageContent").select("div.wrapper").select("div.container").select("div#ixiSearchResponse.grid-row").select("div.main-section.span24.offset1").select("div#ixiResBody");
			
			//Getting all the places in the element
			Elements allPlaces = mainPart.select("div.namedentity-item.lfloat.entity");
			Iterator<Element> placesIterator = allPlaces.iterator();
			
			//Iterating through each place
			while(placesIterator.hasNext())
			{
				//Declarations
				String Adultsentry="", Childentry="", minlimit = "", maxlimit = "";
				
				//Getting the details of a place
				Element someplace = placesIterator.next();

				//Getting the Title of the place
				Elements Ptitle = someplace.select("div.ne-title span.link");
				String PlaceTitle = Ptitle.text();
				
				//Getting the address
				Elements Paddress = someplace.select("div.ne-address span.address-text");
				String PlaceAddress = Paddress.text();
				
				//Getting the timings
				Elements Ptimings = someplace.select("div.timings-container span.timings-text");
				String PlaceTimings = Ptimings.text();
				
				//Getting all the categories
				Elements Pcategory = someplace.select("div.ne-category span.category-block.i-b");
				for(int i=0;i<Pcategory.size();i++)
				{
					PlaceCategory[i]=Pcategory.get(i).text();
				}
				
				//Getting the link of the page which has page details
				Elements Pdesc = someplace.select("div.ne-desc div.read-more a");
				
				//reading the page which has details
				Document placePage = Jsoup.connect("http://www.ixigo.com"+Pdesc.attr("href")).get();
				
				//Getting the rating of the place
				Elements Prating = placePage.body().select("span.lfloat.neratingValue");
				String PlaceRating = Prating.text();
				
				//getting the about
				Elements Pdesc1 = placePage.body().select("div#aboutText");
				String PlaceDesc = Pdesc1.text();
				
				//Getting the Entry fee
				Elements Pdesccont = placePage.body().select("div.ne-desc-cont");
				Elements Pdescchildren = Pdesccont.get(0).children();
				Iterator<Element> PdescIter = Pdescchildren.iterator();
				while(PdescIter.hasNext())
				{
					Element Pdescchild = PdescIter.next();
					if(Pdescchild.text().contains("Visit Duration"))
					{
						Element prices = Pdescchild.child(1);
						if(prices.text().contains("to"))
						{
							String durations = prices.text();
							minlimit = durations.substring(0, prices.text().indexOf("to")).trim();
							maxlimit = prices.text().substring(prices.text().indexOf("to"),prices.text().indexOf("hour")).replaceAll("[^0-9]","").trim();
						}
					}
					if(Pdescchild.text().contains("Entry Fee"))
					{
						//System.out.println("Containing Entry Fee:"+Pdescchild.text());
						Elements prices = Pdescchild.child(1).children();
						Iterator<Element> priceIter = prices.iterator();
						while(priceIter.hasNext())
						{
							Element priceper = priceIter.next();
							//System.out.println("Each Price:"+priceper.text());
							if(priceper.text().contains("no entry fee"))
							{
								Adultsentry = "0";
								Childentry = "0";
							}
							if(priceper.text().contains("adults"))
							{
								Adultsentry = priceper.text().replaceAll("[^0-9]","");
							}
							if(priceper.text().contains("children"))
							{
								Childentry = priceper.text().replaceAll("[^0-9]","");
							}
							
							
						}
					}
				}
				
				//Printing the info to stdout
				System.out.println("\nPlace:"+PlaceTitle);
				System.out.println("Address:"+PlaceAddress);
				System.out.println("Timings:"+PlaceTimings);
				for(int i=0;i<Pcategory.size();i++)
				{
					System.out.println("Category "+(i+1)+":"+PlaceCategory[i]);
				}
				System.out.println("Description:"+PlaceDesc);
				System.out.println("Rating:"+PlaceRating);
				if(Adultsentry.isEmpty())
				{
					Adultsentry="unknown";
				}
				if(Childentry.isEmpty())
				{
					Childentry="unknown";
				}
				System.out.println("Adults Entry Fee:"+Adultsentry);
				System.out.println("Children Entry Fee:"+Childentry);
				if(minlimit.isEmpty())
				{
					minlimit="unknown";
				}
				if(maxlimit.isEmpty())
				{
					maxlimit="unknown";
				}
				System.out.println("Lower Limit Expected time:"+minlimit);
				System.out.println("Upper Limit Expected time:"+maxlimit);
				
				
			}
			System.out.println("End of Places to Visit");
			/*----- End of Places to Visit ----------*/ 
			
			//Getting the things to do button
			Elements thingstodo = mainPartouter.select(".cur-default.jt .ixi-block #thingsToDoWidget.zeus-widget-container #whatToSee .box-h .rfloat a.i-b.download-button.ne-score");
			
			
			//Getting the link to the places to visit page
			linkHref = thingstodo.attr("href");
			System.out.println("Link:"+linkHref);
			
			//Getting the said page
			Document thingstodos = Jsoup.connect("http://www.ixigo.com"+linkHref).get();
			
			//Getting the main part of the page
			mainPart = thingstodos.body().select("div#ixiPage").select("div#ixiPageContent").select("div.wrapper").select("div.container").select("div#ixiSearchResponse.grid-row").select("div.main-section.span24.offset1").select("div#ixiResBody");
			
			//System.out.println(mainPart.html());
			//Getting all the places in the element
			allPlaces = mainPart.select("div.namedentity-item.lfloat.entity");
			placesIterator = allPlaces.iterator();
			
			//Iterating through each place
			while(placesIterator.hasNext())
			{
				//Declarations
				String minlimit="", maxlimit="";
				
				//Getting the details of a place
				Element someplace = placesIterator.next();

				//Getting the Title of the place
				Elements Ptitle = someplace.select("div.ne-title span.link");
				String PlaceTitle = Ptitle.text();
				
				//Getting the address
				Elements Paddress = someplace.select("div.ne-address span.address-text");
				String PlaceAddress = Paddress.text();
				
				//Getting the timings
				Elements Ptimings = someplace.select("div.timings-container span.timings-text");
				String PlaceTimings = Ptimings.text();
				
				//Getting all the categories
				Elements Pcategory = someplace.select("div.ne-category span.category-block.i-b");
				for(int i=0;i<Pcategory.size();i++)
				{
					PlaceCategory[i]=Pcategory.get(i).text();
				}
				
				//Getting the link of the page which has page details
				Elements Pdesc = someplace.select("div.ne-title a");
				
				//reading the page which has details
				Document placePage = Jsoup.connect("http://www.ixigo.com"+Pdesc.attr("href")).get();
				
				//Getting the rating of the place
				Elements Prating = placePage.body().select("span.lfloat.neratingValue");
				String PlaceRating = Prating.text();
				
				//getting the about
				Elements Pdesc1 = placePage.body().select("div#aboutText");
				String PlaceDesc = Pdesc1.text();
				Pdesc1 = placePage.body().select("div.entity-blurb-text");
				PlaceDesc = Pdesc1.text() + PlaceDesc;
				
				//Getting the Entry fee
				Elements Pdesccont = placePage.body().select("div.ne-desc-cont");
				Elements Pdescchildren = Pdesccont.get(0).children();
				Iterator<Element> PdescIter = Pdescchildren.iterator();
				while(PdescIter.hasNext())
				{
					Element Pdescchild = PdescIter.next();
					if(Pdescchild.text().contains("Visit Duration"))
					{
						Element prices = Pdescchild.child(1);
						if(prices.text().contains("to"))
						{
							minlimit = prices.text().substring(0, prices.text().indexOf("to")).trim();
							maxlimit = prices.text().substring(prices.text().indexOf("to"),prices.text().indexOf("hours")).replaceAll("[^0-9]","").trim();
						}
					}
				}
				
				//Printing the info to stdout
				System.out.println("\nThing To Do:"+PlaceTitle);
				System.out.println("Address:"+PlaceAddress);
				System.out.println("Timings:"+PlaceTimings);
				for(int i=0;i<Pcategory.size();i++)
				{
					System.out.println("Category "+(i+1)+":"+PlaceCategory[i]);
				}
				System.out.println("Description:"+PlaceDesc);
				System.out.println("Rating:"+PlaceRating);
				if(minlimit.isEmpty())
				{
					minlimit="unknown";
				}
				if(maxlimit.isEmpty())
				{
					maxlimit="unknown";
				}
				System.out.println("Lower Limit Expected time:"+minlimit);
				System.out.println("Upper Limit Expected time:"+maxlimit);
				
				
			}
			System.out.println("End of Things To Do");
			
			/*----- End of Things To Do ----------*/ 
			
			
			
			
	}

}
