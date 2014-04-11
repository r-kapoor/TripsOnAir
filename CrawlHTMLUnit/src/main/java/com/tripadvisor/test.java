package com.tripadvisor;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		/*
		String ranktext= "Ranked #1111 of 181 attractions in Bangalore";
		int rank=0,totalplaces=0;
		if(ranktext.matches("Ranked #\\d+ of \\d+ attractions in.*"))
		{
			int pos = ranktext.indexOf('#');
			int pos1 = ranktext.indexOf(' ',pos);
			rank = Integer.parseInt(ranktext.substring(pos+1, pos1));
			
			pos=ranktext.indexOf(' ',pos1+1);
			pos1=ranktext.indexOf(' ', pos+1);
			totalplaces=Integer.parseInt(ranktext.substring(pos+1, pos1));
			
		}
		System.out.println(rank +" "+ totalplaces);
		String rating = "0";
		System.out.println((rating.matches(".*\\d+.*")));
		int numofreviewsI=0;
		double wt;
		double score1 = 20, score2 = 100;
		//System.out.println(Math.pow((numofreviewsI-250),3));
		wt=	Math.atan((Math.pow(numofreviewsI-250.0,3)/Math.pow(250.0,3)))*(70/Math.PI)+40;
		System.out.println(wt);
		System.out.println((score2 * wt / 100) + (score1 * (100 - wt) / 100));
		*/
		String type = "Architectural Buildings, Religious Sites";
		type = type.toUpperCase();
		System.out.println(type.matches("[a-zA-Z0-9\\s+],\\s+.*"));
		type.replaceAll("[a-zA-Z0-9 ],\\s+.*",  ".*,.*");
		System.out.println(type);
		

	}

}