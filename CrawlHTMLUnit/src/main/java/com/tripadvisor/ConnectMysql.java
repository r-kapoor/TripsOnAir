package com.tripadvisor;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;  
import java.sql.Connection;

/**
 * 	  
 * @author rajat
 *
 */

public class ConnectMysql{
	    public static Statement MySqlConnection() throws SQLException, ClassNotFoundException {  
	        
	        Class.forName("com.mysql.jdbc.Driver");
	        
	        //for local testing, do port forwarding through rhc client and set the port below accordingly 	        
	        /*Connection connection = DriverManager.getConnection(  
	                    "jdbc:mysql://127.0.0.1:3307/Holiday", "adminzESTl5F", "duKiwg4kLMSV");*/
        
	        //for openshift server 
	         Connection connection = DriverManager.getConnection(  
	                   "jdbc:mysql://127.12.148.2:3306/Holiday", "adminzESTl5F", "duKiwg4kLMSV");
	        Statement statement = connection.createStatement();
	         return statement;
	}
}