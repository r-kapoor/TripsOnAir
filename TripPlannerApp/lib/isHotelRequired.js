require('date-utils');
function isHotelRequired(destinationsAndStops)
{

	var t1= new Date(destinationsAndStops.destinations[0].arrivalTime);
	var t2 = new Date(destinationsAndStops.destinations[0].departureTime);
	console.log(t1.getHoursBetween(t2));
	//console.log(Date.parse(destinationsAndStops.destinations[0].arrivalTime));
	//console.log(new Date(Date.parse(destinationsAndStops.destinations[0].arrivalTime)));
	console.log(new Date(destinationsAndStops.destinations[0].arrivalTime));
	//console.log(destinationsAndStops.destinations[0].arrivalTime);
	//console.log(parseInt(Date.parse(destinationsAndStops.destinations[0].arrivalTime)));
	//console.log(new Date(parseInt(Date.parse(destinationsAndStops.destinations[0].arrivalTime))));
	/*var arrTime=new Date(Date.parse(destinationsAndStops.destinations[0].arrivalTime));
	var departTime=new Date(Date.parse(destinationsAndStops.destinations[0].departureTime));*/

	for(var i=0;i<destinationsAndStops.destinations.length;i++)
	{
		
		//var arrTime = Date.parse(destinationsAndStops.destinations[i].arrivalTime);
		var arrTime=new Date(destinationsAndStops.destinations[i].arrivalTime);
		var departTime=new Date(destinationsAndStops.destinations[i].departureTime);
		//var departTime = Date.parse(destinationsAndStops.destinations[i].departureTime);
		
		//departTime.getHoursBetween(arrTime);
		var hours = arrTime.getHoursBetween(departTime);
		destinationsAndStops.destinations[i].isHotelRequired=0;//By default
		if(hours>=20)
		{
			destinationsAndStops.destinations[i].isHotelRequired=1;
		}
		else
		{
			if((arrTime.getHours()>=23)||(arrTime.getHours()<4))//if between 11 pm to 4 am
			{
				if(hours>=5)
				{
					destinationsAndStops.destinations[i].isHotelRequired=1;
				}
			}
		}	
	}

	for(var i=0;i<destinationsAndStops.destinationsWiseStops.length;i++)
	{
		var stops=destinationsAndStops.destinationsWiseStops[i];
		for(var j=0;j<stops.length;j++)
		{
			var arrTime=new Date(stops[j].arrivalTime);
			var departTime=new Date(stops[j].departureTime);
			var hours=arrTime.getHoursBetween(departTime);
			if(hours>=6)
			{
				stops[j].isHotelRequired=1;
			}
			else
			{
				stops[j].isHotelRequired=0;
			}	
		}
	}
}

module.exports.isHotelRequired=isHotelRequired;