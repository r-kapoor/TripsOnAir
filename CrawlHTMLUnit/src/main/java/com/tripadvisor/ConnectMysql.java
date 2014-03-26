package com.tripadvisor;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;  
import java.sql.Connection;

/**
 * 	  
 * @author rajat
 *
 */

public class ConnectMysql{
	    public static void main(String[] args) throws SQLException, ClassNotFoundException {  
	        
	        Class.forName("com.mysql.jdbc.Driver");   
	        //for local testing
	        //if not working, then go to openshift server->right click->openshift->portforwarding->click free ports->start all->use the local port of mysql below
	       /* Connection connection = DriverManager.getConnection(  
	                    "jdbc:mysql://127.0.0.1:48799/customized", "adminzESTl5F", "duKiwg4kLMSV");  
	        *///for openshift server 
	         Connection connection = DriverManager.getConnection(  
	                   "jdbc:mysql://127.12.148.2:3306/customized", "adminzESTl5F", "duKiwg4kLMSV");
	         Statement statement = connection.createStatement();  
	         ResultSet resultSet = statement
	                    .executeQuery("SELECT Name FROM Flight");  
	          while (resultSet.next()){
	                System.out.println("NAME:"  
	                        + resultSet.getString("NAME"));	            
	           }
	}
}