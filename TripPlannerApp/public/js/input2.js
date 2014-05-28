/**
 * @author rajat
 */

$(document).ready(function(){
	var count = 1;
	var csrf = {_csrf};
	
	$("#submit").click(function () {
		 
		if(count >1){
            alert("cant submit again");
            return false;
		}   
		
		 var input2Div = $(document.createElement('div'))
	     .attr("id", 'input');
 
		 input2Div.after().html('<form method="POST" action="places">'
				 +'Tell us Your Taste</br>'
				 +'<input type="checkbox" name="placetype" value="adventure">Adventure<br>'
				 +'<input type="checkbox" name="placetype" value="religious">Religious'
				 +'<input type="visible" name="_csrf" value="'+csrf+'">'
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
});