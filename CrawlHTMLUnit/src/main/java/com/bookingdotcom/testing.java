package com.bookingdotcom;

import java.util.Scanner;

public class testing {

	public static void main(String args[])
	{
		String y = "Rs. 2,352.11";
		/*double c=Double.parseDouble(y.replaceAll("[^0-9.]",""));
		System.out.println(c);
		int u=(int)c;
		System.out.println(u);*/
		
		
		Scanner st = new Scanner(y);
        while (!st.hasNextDouble())
        {
            st.next();
        }
        double value = st.nextDouble();
        System.out.println(value);
        int u=(int)value;
		System.out.println(u);
	}
	
}
