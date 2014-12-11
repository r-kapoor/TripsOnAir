package com.ixigo;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import com.dataTransferObject.IndianRailwayDto;

public class TransferIxigoJsonData {

	private static String dataBaseExceptionFile = "target/indianRail/dataBaseException.txt";
	private static String dataBaseException="";
	public static void transferData(IndianRailwayDto indianRailwayDto,SessionFactory sessionFactory)throws Exception
	{
		System.out.println("Begin transfer");
		Transaction tr = null;
		
		
		
		
		
		
	}	
	
	
}
