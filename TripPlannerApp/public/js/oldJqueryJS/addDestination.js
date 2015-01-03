/**
 * @author rajat
 */

$(document).ready(function(){
 
    var counter = 2;

    $("#addButton").click(function () {

	if(counter>5){
            alert("Only 5 Destination allow");
            return false;
	}   
 
	var table = document.getElementById("inptable");

	// Create an empty <tr> element and add it to the required position of the table:
	var row = table.insertRow(counter);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.innerHTML = "<label>Destination #"+ counter + " : </label>";
	cell2.innerHTML = '<input type="text" class="typeahead tt-query destination" id="textbox' + counter + '">';
		
	$('input.typeahead').typeahead({
			name: 'origin',
			local: ['Ahmedabad', 'Bangalore','Goa','Chennai', 'Chandigarh', 'New Delhi', 'Ludhiana', 'Guwahati', 'Pune', 'Hyderabad', 'Mumbai','Katra','Patnitop','Jammu','Phalagam','Srinagar','Dharamshala','Haridwar','Rishikesh','Gulmarg','Dalhousie','Amritsar','Leh','Manali','Kargil']
		})
					
		counter++;
     });
 
     $("#close").click(function () {
    	 var att=document.createAttribute("style");
    	 att.value="display: none";
    	 document.getElementById("TextBoxDiv"+counter).setAttributeNode(att);
    	 console.log(counter);
    	 counter--;
     });
  });