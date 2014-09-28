/**
 * @author rajat
 */


function choose()
	{
		var origin=document.getElementById("origin").value;	
		if((origin=="")||(origin=="Enter a city"))
		{
			document.getElementById("invalid").innerHTML ="Please enter valid inputs";
			return;
		}
		var elements=document.getElementsByClassName('destination');
		for(var i=0;i<elements.length;i++)
 		{
 			if(elements[i].disabled)
 			{
 				elements[i].disabled=false;
 			}
 			else{
 				elements[i].disabled=true;
 				elements[i].value="Enter a city";
 			}
 		}

		var chooseDestbtn = document.createElement("BUTTON");
		var buttonText = document.createTextNode("Choose Destinations");
		chooseDestbtn.appendChild(buttonText);
		chooseDestbtn.setAttribute("id","chooseDest");
		chooseDestbtn.setAttribute("type","button");
		chooseDestbtn.setAttribute("onClick","onSubmit()");
		var input2Form=document.getElementById("inpBudget");
		input2Form.appendChild(chooseDestbtn);
	}