/**
 * New node file
 */

function showRoutes()
{
	
	var query=createQuery();
	console.log("query:"+query);
	//var ajaxQuery = $.getJSON('/showRoutes?'+query);
	//ajaxQuery.done(function(data) {
		
		//console.log("GotData:"+data);		
		
		var clientData = [
		                  { first: "Rey", last: "Bango", age: 42, id: 1, phone: [ "954-600-1234", "954-355-5555" ] },
		                  { first: "Mark", last: "Goldberg", age: 51, id: 2, phone: ["954-600-1234", "954-355-5555"] },
		                  { first: "Jen", last: "Statford", age: "25", id: 3, phone: ["954-600-1234", "954-355-5555"] }
		              ];
		var markup = "<li><b>${first}</b> (${last})</li>";
		$.template( "clientTemplate", markup);
		$.tmpl( "clientTemplate", clientData ).appendTo(".sideBySide");
		//$("#clientTemplate").tmpl(clientData).appendTo("div");
	//});
}

function createQuery()
{
	query="cities=";
	var items = [];
    $("ul.citiesOrder").children().each(function() {
      var item = $(this).text();
      query+=item+",";
      //items.push(item);
    });
    return (query.substring(0,(query.length-1)));
}


function getRouteTemplate()
{
	







}

