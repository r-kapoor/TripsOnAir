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
 
	newTextBoxDiv.after().html('<label>Destination #'+ counter + ' : </label>' +
	      '<input type="text" class="typeahead tt-query" name="textbox' + counter + 
	      '" id="textbox' + counter + '" value="" >');
 
	newTextBoxDiv.appendTo("#TextBoxesGroup");
 
 
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
 
     $("#getButtonValue").click(function () {
 
	var msg = '';
	for(i=1; i<counter; i++){
   	  msg += "\n Destination #" + i + " : " + $('#textbox' + i).val();
	}
    	  alert(msg);
     });
  });