/**
 * @author rajat
 * Global submit function
 * Require:Csrf token script should be there on the page otherwise it won't submit
 */


function onSubmit(dto,action)
{
	console.log("OnSubmit");	
	var c=$("<form></form>");
	c.attr("action","/"+action);
	c.css("display","none");
	c.attr("method","GET");
	
	for(var key in dto)
	{
		if (dto.hasOwnProperty(key)) {
			console.log("key:"+dto[key]);
			var d=$("<input type='hidden'/>");
			d.attr("name",key);
			d.attr("value",dto[key]);
			c.append(d);
		}
	}
	var csrf=$("<input type='hidden'/>");
	csrf.attr("name","_csrf");
	csrf.attr("value",csrf_token);
	$("body").append(c);
	c.submit();
};