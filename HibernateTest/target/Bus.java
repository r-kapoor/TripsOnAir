// default package
// Generated Oct 14, 2014 11:08:41 PM by Hibernate Tools 3.4.0.CR1


import java.util.Date;

/**
 * Bus generated by hbm2java
 */
public class Bus  implements java.io.Serializable {


     private Integer busId;
     private String operator;
     private int originCityId;
     private Date departureDate;
     private Date departureTime;
     private String dropPoint;
     private String dropAddress;
     private int destinationId;
     private Date arrivalTime;
     private Date duration;
     private Integer seatsAvailable;
     private Boolean a/c;
     private Boolean sleeper;
     private float rating;
     private int numofReviews;
     private float price;
     private String description;
     private boolean redBus;

    public Bus() {
    }

	
    public Bus(String operator, int originCityId, Date departureDate, Date departureTime, int destinationId, Date arrivalTime, Date duration, float rating, int numofReviews, float price, boolean redBus) {
        this.operator = operator;
        this.originCityId = originCityId;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.destinationId = destinationId;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.rating = rating;
        this.numofReviews = numofReviews;
        this.price = price;
        this.redBus = redBus;
    }
    public Bus(String operator, int originCityId, Date departureDate, Date departureTime, String dropPoint, String dropAddress, int destinationId, Date arrivalTime, Date duration, Integer seatsAvailable, Boolean a/c, Boolean sleeper, float rating, int numofReviews, float price, String description, boolean redBus) {
       this.operator = operator;
       this.originCityId = originCityId;
       this.departureDate = departureDate;
       this.departureTime = departureTime;
       this.dropPoint = dropPoint;
       this.dropAddress = dropAddress;
       this.destinationId = destinationId;
       this.arrivalTime = arrivalTime;
       this.duration = duration;
       this.seatsAvailable = seatsAvailable;
       this.a/c = a/c;
       this.sleeper = sleeper;
       this.rating = rating;
       this.numofReviews = numofReviews;
       this.price = price;
       this.description = description;
       this.redBus = redBus;
    }
   
    public Integer getBusId() {
        return this.busId;
    }
    
    public void setBusId(Integer busId) {
        this.busId = busId;
    }
    public String getOperator() {
        return this.operator;
    }
    
    public void setOperator(String operator) {
        this.operator = operator;
    }
    public int getOriginCityId() {
        return this.originCityId;
    }
    
    public void setOriginCityId(int originCityId) {
        this.originCityId = originCityId;
    }
    public Date getDepartureDate() {
        return this.departureDate;
    }
    
    public void setDepartureDate(Date departureDate) {
        this.departureDate = departureDate;
    }
    public Date getDepartureTime() {
        return this.departureTime;
    }
    
    public void setDepartureTime(Date departureTime) {
        this.departureTime = departureTime;
    }
    public String getDropPoint() {
        return this.dropPoint;
    }
    
    public void setDropPoint(String dropPoint) {
        this.dropPoint = dropPoint;
    }
    public String getDropAddress() {
        return this.dropAddress;
    }
    
    public void setDropAddress(String dropAddress) {
        this.dropAddress = dropAddress;
    }
    public int getDestinationId() {
        return this.destinationId;
    }
    
    public void setDestinationId(int destinationId) {
        this.destinationId = destinationId;
    }
    public Date getArrivalTime() {
        return this.arrivalTime;
    }
    
    public void setArrivalTime(Date arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    public Date getDuration() {
        return this.duration;
    }
    
    public void setDuration(Date duration) {
        this.duration = duration;
    }
    public Integer getSeatsAvailable() {
        return this.seatsAvailable;
    }
    
    public void setSeatsAvailable(Integer seatsAvailable) {
        this.seatsAvailable = seatsAvailable;
    }
    public Boolean getA/c() {
        return this.a/c;
    }
    
    public void setA/c(Boolean a/c) {
        this.a/c = a/c;
    }
    public Boolean getSleeper() {
        return this.sleeper;
    }
    
    public void setSleeper(Boolean sleeper) {
        this.sleeper = sleeper;
    }
    public float getRating() {
        return this.rating;
    }
    
    public void setRating(float rating) {
        this.rating = rating;
    }
    public int getNumofReviews() {
        return this.numofReviews;
    }
    
    public void setNumofReviews(int numofReviews) {
        this.numofReviews = numofReviews;
    }
    public float getPrice() {
        return this.price;
    }
    
    public void setPrice(float price) {
        this.price = price;
    }
    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    public boolean isRedBus() {
        return this.redBus;
    }
    
    public void setRedBus(boolean redBus) {
        this.redBus = redBus;
    }




}


