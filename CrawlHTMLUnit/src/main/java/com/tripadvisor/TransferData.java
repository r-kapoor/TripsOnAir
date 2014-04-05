package com.tripadvisor;

import java.sql.Connection;

import com.mysql.jdbc.CallableStatement;


public class TransferData {

	public static void main(String args[]) throws Exception{
		Connection conn=ConnectMysql.MySqlConnection();

	
	//int result = statement
    //.executeUpdate("INSERT INTO Places VALUES('"+type+"','test',3,'"+address+"',333031,'"+phone+"',3,'"+description+"',4,'value-10',123,234,0,1)WHERE EXISTS(SELECT * FROM Places WHERE Name = '"+name+"')");
	String sql = "SELECT * FROM Places WHERE Name = 'test'"	;	
	String sql2= "INSERT INTO Places VALUES('t1','test1',4,'gn',333031,'12344',4,'not available',4,'value-10',123,234,0,1)";
	
	String plSql=	"declare l_exst number(1); "
			+ "begin "
			+ ""+sql+" "
			+"end;";
		/*	+ "select * where exists("+sql+") "
			+ "then 1 "
			+ "else 0 "
			+ "end  into l_exst "
			+ "from dual;"
			+ "if l_exst = 1 "
			+ "then "
			+ ""+sql2+"; "
			+ "end;";  */
	//ResultSet result = statement.executeQuery(plSql);
	CallableStatement cs = (CallableStatement) conn.prepareCall(plSql);
    //cs.setString(1, "12345");
    //cs.registerOutParameter(2, Types.VARCHAR);
    //cs.registerOutParameter(3, OracleTypes.CURSOR);

    cs.execute();
	
	}			
			
}
