/**
 * @author rajat
 */

function createQueryString(){
	var origin = document.getElementById("origin").value;
	var destination = document.getElementById("textbox1").value;
	var query="origin="+origin+"&"+"destination="+destination;
	return query;
}

function setRanges(){

	var query = createQueryString();
	var xmlhttp;
	
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }

	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
		  console.log("in ready state");
		  document.getElementById("input2").innerHTML=xmlhttp.responseText;
	    }
	  }
		xmlhttp.open("GET","/range?"+query,true);
		xmlhttp.send();
};


/*$(document).ready(function(){
	var count = 1;
	//var csrf = {_csrf};
	
	$("#submit").click(function () {
		 
		if(count >1){
            alert("cant submit again");
            return false;
		}   
		
		 var input2Div = $(document.createElement('div'))
	     .attr("id", 'input');
 
		 input2Div.after().html('<form method="POST" action="places">'
				 +'Tell us Your Taste<br>'
				 +'<input type="checkbox" name="placetype" value="adventure">Adventure<br>'
				 +'<input type="checkbox" name="placetype" value="religious">Religious'
				 +'<input type="visible" name="_csrf" value="'+csrf_token+'">'
                 +'<input type="submit" value="Save">'
				 +'</select>'
				 +'</form>'
				 +'<form action="">'+ 'Tell us where your Budget lies'
				 +'<select name="budget">'
				 +'<option value="five">0-5000</option>'
				 +'<option value="ten">5000-10000</option>'
				 +'<option value="thirty">10000-30000</option>'
				 +'<option value="fifty">30000-50000</option>'
				 +'<option value="high">more than 50000</option>'
				 +'</select>'
				 +'</form>');
 
		 input2Div.appendTo("#input2");
			count++;
	 });
});*/