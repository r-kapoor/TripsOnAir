package com.tripadvisor;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

import com.mysql.jdbc.*;

public class TransferData {

	public static void main(String args[]) throws Exception{
		Connection conn=ConnectMysql.MySqlConnection();

	Statement statement = conn.createStatement();
	
	String query = "SELECT * FROM Places;";

	ResultSet result = statement.executeQuery(query);
	if(result.next())
	{
		System.out.println(result.getString("Name"));
	}
	ResultSetMetaData meta = result.getMetaData();
	System.out.println(meta.getColumnCount());
	//System.out.println(result.getString("Name"));
	//System.out.println(result.last());;
	System.out.println(result.getRow());
	//CallableStatement cs = (CallableStatement) conn.prepareCall(query);
    //cs.setString(1, "12345");
    //cs.registerOutParameter(2, Types.VARCHAR);
    //cs.registerOutParameter(3, OracleTypes.CURSOR);

    //cs.execute();
	
	}			
			
}
