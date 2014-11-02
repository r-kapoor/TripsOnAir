/**
 * @author rajat
 * Global submit function
 * Require:Csrf token script should be there on the page otherwise it won't submit
 */


function onSubmit(dto,action,cookieKey)
{
	console.log("OnSubmit");	
	var c=$("<form></form>");
	c.attr("action","/"+action);
	c.css("display","none");
	c.attr("method","GET");
	var cookieValue = "?";
	for(var key in dto)
	{
		if (dto.hasOwnProperty(key)) {
			console.log("key:"+dto[key]);
			var d=$("<input type='hidden'/>");
			d.attr("name",key);
			d.attr("value",dto[key]);
			c.append(d);
			cookieValue += key + "=" + dto[key] + "&";
		}
	}
	if(cookieKey)
	{
		$.cookie(cookieKey, cookieValue);
	}
	var csrf=$("<input type='hidden'/>");
	csrf.attr("name","_csrf");
	csrf.attr("value",csrf_token);
	$("body").append(c);
	c.submit();
};