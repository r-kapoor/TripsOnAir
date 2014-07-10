/**
 * @author rajat
 */

$(document).ready(function(){
 
    var counter = 2;
 
    $("#addButton").click(function () {
 
	if(counter>5){
            alert("Only 10 Destination allow");
            return false;
	}   
 
	/*var newTextBoxDiv = $(document.createElement('div'))
    .attr("id", 'TextBoxDiv' + counter);
	
	/*var row = $(document.createElement("tr"));
	console.log("row "+row);
	// Find a <table> element with id="myTable":
	//var table = document.getElementById("inptable");

	// Create an empty <tr> element and add it to the required position of the table:
	//var row = table.insertRow(2);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	//var cell1 = row.insertCell(0);
	//var cell2 = row.insertCell(1);
	var cell1 = row.innerHTML('<td></td>');
	var cell2 = row.innerHTML(document.createElement('td'));
	// Add some text to the new cells:
	cell1.innerHTML = "<label>Destination #"+ counter + " : </label>";
	cell2.innerHTML = '<input type="text" class="typeahead tt-query" name="textbox' + counter + 
    '" id="textbox' + counter + '" value="" >';

	//newTextBoxDiv.appendTo(row);
	newTextBoxDiv.innerHTML=row;
	//newTextBoxDiv.after().html("#TextBoxDiv1");
	//row.after().html(newTextBoxDiv);*/
	//newTextBoxDiv.after().html("#TextBoxDiv1");
	//newTextBoxDiv.appendTo("#TextBoxDiv1");
	
	//var table = $(document.createElement('table')).attr("id",'inptable'+counter);
	//var oldTable=document.getElementById("inptable"+(counter-1));
	//console.log(oldTable);
	//oldTable.after().html("<div>test</div>");
	 /*$("#inptable"+(counter-1)).after('<table id="inptable"'+counter+'>'
			 						+ '<div id="TextBoxDiv"'+counter+'>'
									+ '<tr>'
									+ '<td><label>Destination #'+counter+' : </label></td>'
									+ '<td><input type="text"  value="Enter a city"  onFocus="this.value='+""+'" class="typeahead tt-query" id="textbox1"></td>'
									+ '<td></td>'
									+ '<td><a id="addButton" href="#" return false;">Add</a></td>'
									+ '</tr>'
									+ '</div>'
									+'</table>');*/
	
	/*var table = document.getElementById("inptable");
	
	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(counter);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);

	// Add some text to the new cells:
	cell1.innerHTML = "<label>Destination #2 : </label>";
	cell2.innerHTML = '<input type="text" class="typeahead tt-query" id="textbox">';*/
	
	//document.getElementById("TextBoxDiv"+counter).removeAttribute("style");					
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