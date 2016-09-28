TripsOnAir
==============

Tripsonair is an online end to end automated itinerary planner.

## About

Save your time and effort in planning trips through an automated trip planner. Our state-of-the-art algorithms analyze the available travel options, accommodation and attractions to plan a perfect holiday for you in real-time, which can be further customized and personalized.
* Long gone are the days when travelers used to book packages or contact travel agents
* People want to plan trips on their own. In doing this they have to visit multiple websites to gather information that is fragmented in nature.
* This leads to spending a lot of time and frustration ultimately leading to either planning a substandard trip or dropping the plan altogether
* Tripsonair aims to remove these difficulties by taking the travelers’ requirements and planning the complete trip automatically, thereby reducing the efforts of travelers
* The algorithm takes into account user budget, taste, days of travel and provides the best order of destinations, optimal travel options and daily minute to minute itinerary
* The itinerary schedules attractions/places to visit, hotel checkin/checkout and meals by considering city arrival-departure time, opening-closing timing of the places, hotel location, places in proximity and same direction
* The generated itinerary can be further customized and personalized

## Project Organisation

/Crawlers :  Crawlers for getting data from multitude of websites

/TripPlannerApp : NodeJS AngularJS web app which forms the UI for planning trips

## Tools/Tech Used

JAVA - HTMLUnit - Hibernate : For crawling

NodeJS : Server Side of webapp

AngularJS : Client Side of webapp

redis : Cache for the server

KrakenJS : For setting up boiled plate code of project

BootStrap : Designing the UI of web pages


## Website

[TripsOnAir](http://www.tripsonair.com) : *the website is currently down due to lack of funds for AWS hosting*

[Project Website](https://r-kapoor.github.io/TripsOnAir/)

## Set up project

Clone the project.
Setup a MySQL server, Redis server and install node
In the TripPlannerApp dir run
```
npm install
npm start
```
The server will run on localhost:8000

## Calling For Contributions

The project is calling for contributions and suggestions
