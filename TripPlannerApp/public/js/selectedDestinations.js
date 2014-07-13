$(document).ready(function(){
 
    var counter = 2;
	console.log('print');
    $(".destination").click(function () {
 console.log('enters');
	var id = $(this).attr('id');
     alert("City:"+id);
	if(counter>5){
            alert("Only 10 Destination allow");
            return false;
	}
	counter++;
     });
 
     $("#destinationRemoved").click(function () {
    	 var att=document.createAttribute("style");
    	 att.value="display: none";
    	 document.getElementById("TextBoxDiv"+counter).setAttributeNode(att);
    	 console.log(counter);
    	 counter--;
     });
  });