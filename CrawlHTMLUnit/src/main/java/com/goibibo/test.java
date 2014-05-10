package com.goibibo;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String arrivaltime = "10:50";
		int nextday = 0;
		if(arrivaltime.contains("Next Day"))
		{
			nextday = 1;
			arrivaltime = arrivaltime.replaceAll("(\\d+:\\d+) Next Day", "$1");
		}
		System.out.println(nextday +" "+arrivaltime);
	}

}
