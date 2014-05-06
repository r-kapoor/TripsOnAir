package com.bookingdotcom;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String city = "New Delhi";
		String address = "Diplomatic Enclave, Chanakyapuri, South Delhi, 110023 New Delhi";
		if(address.matches(".*\\d{6} "+city))
		{
			String pincode = address.replaceAll("(.*)(\\d{6})(.*)","$2");
			address = address.replaceAll("(.*)(\\d{6})(.*)","$1$3");
			System.out.println(pincode);
			System.out.println(address);
		}

	}

}
