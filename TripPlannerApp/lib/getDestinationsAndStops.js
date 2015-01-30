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
        console.log('destinations['+i+']:'+JSON.stringify(destinations[i]));
		var lastMajorSegment;
		for(var j=0;j<leg.routes.length;j++)
		{
			if(leg.routes[j].isDefault==1)
			{
				var segments=leg.routes[j].segments;
				for(var k=0;k<segments.length;k++)
				{
					if(segments[k].isMajor==1)
					{
                        lastMajorSegment = segments[k];
						if(firstMajorSegmentStartTime==null){
							firstMajorSegmentStartTime=new Date(segments[k].startTime);
                            console.log('firstMajorSegmentStartTime:'+firstMajorSegmentStartTime);
						}
						if(t>0)
						{
							stops[t-1].departureTime=new Date(segments[k].startTime);
                            console.log('stops['+t+'-1].departureTime:'+stops[t-1].departureTime);
						}
						stops[t]=
						{
							name:segments[k].tName,
							arrivalTime:new Date(segments[k].endTime)
						};
                        console.log('stops['+t+']:'+JSON.stringify(stops[t]));
						t++;
					}
				}
				lastStop=stops.splice(-1,1)//remove last stop as it is a destination
                if(lastMajorSegment != undefined) {
                    if(lastMajorSegment.kind == 'flight') {

                        for(var x = 0; x < leg.routes[j].stops.length; x++) {
                            if(leg.routes[j].stops[x].kind == 'airport') {
                                if(lastMajorSegment.tCode == leg.routes[j].stops[x].code) {
                                    destinations[i].LocationOfArrival = leg.routes[j].stops[x].pos;
                                }
                            }
                        }
                    }
                    else if(lastMajorSegment.kind == 'train' && lastMajorSegment.subkind == 'train' && lastMajorSegment.vehicle == 'train') {
                        destinations[i].LocationOfArrival = lastMajorSegment.tPos;
                    }
                    else if(lastMajorSegment.kind == 'bus' && lastMajorSegment.subkind == 'bus' && lastMajorSegment.vehicle == 'bus') {
                        destinations[i].LocationOfArrival = lastMajorSegment.tPos;
                    }
                    else {
                        destinations[i].LocationOfArrival = destinations[i].pos;
                    }
                }
			}
		}
		destinationsWiseStops[i]=stops;
		destinations[i].arrivalTime=new Date(lastStop[0].arrivalTime);
        console.log('destinations['+i+'].arrivalTime:'+destinations[i].arrivalTime);
		if(i>0){
			destinations[i-1].departureTime=firstMajorSegmentStartTime;
            console.log('destinations['+i+'-1].departureTime:'+destinations[i-1].departureTime);
		}
	}
	destinations.splice(-1,1);//Last destination is origin itself so remove it

	return({
			destinations:destinations,
			destinationsWiseStops:destinationsWiseStops
		});


}
module.exports.getDestinationsAndStops=getDestinationsAndStops;
