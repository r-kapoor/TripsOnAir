function getDestinationsAndStops(travelData)
{

	var legs=travelData.rome2RioData;
	var destinations=[];
	var destinationsWiseStops=[];
	for(var i=0;i<legs.length;i++)
	{
		var t=0;
		var stops=[];
		var leg=legs[i];
		var lastStop=[];
		var firstMajorSegmentStartTime=null;
		destinations[i]=leg.places[1];
			
		for(var j=0;j<leg.routes.length;j++)
		{
			if(leg.routes[j].isDefault==1)
			{

				var segments=leg.routes[j].segments;
				for(var k=0;k<segments.length;k++)
				{
					if(segments[k].isMajor==1)
					{
						if(firstMajorSegmentStartTime==null){
							firstMajorSegmentStartTime=new Date(segments[k].startTime);
						}
						if(t>0)
						{	
							stops[t-1].departureTime=new Date(segments[k].startTime);
							
						}	
						stops[t]=
						{
							name:segments[k].tName,
							arrivalTime:new Date(segments[k].endTime)
						}
						t++;
					}	
				}
				lastStop=stops.splice(-1,1)//remove last stop as it is a destination 	
			}	
		}
		destinationsWiseStops[i]=stops;
		destinations[i].arrivalTime=new Date(lastStop[0].arrivalTime);
		if(i>0){
			destinations[i-1].departureTime=firstMajorSegmentStartTime;
		}
	}
	destinations.splice(-1,1);//Last destination is origin itself so remove it

	return({
			destinations:destinations,
			destinationsWiseStops:destinationsWiseStops
		});	


}
module.exports.getDestinationsAndStops=getDestinationsAndStops;