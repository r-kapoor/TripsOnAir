/**
 * @author rajat
 */

$(document).ready(function(){
 
    var counter = 2;
 
    $("#addButton").click(function () {
 
	if(counter>10){
            alert("Only 10 Destination allow");
            return false;
	}   
 
	var newTextBoxDiv = $(document.createElement('div'))
    .attr("id", 'TextBoxDiv' + counter);
	
	var row = $(document.createElement('tr'));
	
	// Find a <table> element with id="myTable":
	//var table = document.getElementById("inptable");

	// Create an empty <tr> element and add it to the required position of the table:
	//var row = table.insertRow(2);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	//var cell1 = row.insertCell(0);
	//var cell2 = row.insertCell(1);
	var cell1 = row.appendChild(document.createElement('td'));
	var cell2 = row.appendChild(document.createElement('td'));
	// Add some text to the new cells:
	cell1.innerHTML = "<label>Destination #"+ counter + " : </label>";
	cell2.innerHTML = '<input type="text" class="typeahead tt-query" name="textbox' + counter + 
    '" id="textbox' + counter + '" value="" >';

	//newTextBoxDiv.appendTo(row);
	newTextBoxDiv.innerHTML=row;
	//newTextBoxDiv.after().html("#TextBoxDiv1");
	//row.after().html(newTextBoxDiv);
	//newTextBoxDiv.after().html("#TextBoxDiv1");
	counter++;
     });
 
     $("#close").click(function () {
	if(counter==2){
          alert("No more textbox to remove");
          return false;
       }   
 
	counter--;
 
        $("#TextBoxDiv" + counter).remove();
 
     });
  });