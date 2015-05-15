/**
 * New node file
 */
require('date-utils');
var calculateBudgetOfTrip=require('../lib/calculateBudgetOfTrip');
var selectFinalTravelVehicle = function (allSegments,k,isMajorCounter,dateSet,i,idealStartTime, kind, durationDelayAfterStops){
//console.log("Kind is train");
    console.log('Kind:'+kind);
    if(kind=="train"){
        var vehicleData = "trainData";
    }
    else if(kind=="flight"){
        var vehicleData = "flightData";
    }
    else if(kind=="bus"){
        var vehicleData = "busData";
    }
    var trainData=allSegments[k][vehicleData];
    var minTrainTimeDifference=-1;
    var minTrain;
    var minTrainDateOfTravel;
    var minTrainIndex = -1;
    var currentStartDate;

    var dateSetStart = dateSet.dateStart[i].clone().addMinutes(durationDelayAfterStops);
    var dateSetEnd = dateSet.dateEnd[i].clone().addMinutes(durationDelayAfterStops);
    console.log("idealStartTime:"+idealStartTime);
    console.log("dateSetStart:"+dateSetStart);
    console.log("dateSetEnd:"+dateSetEnd);

    if(trainData.length > 0){
        for(var l=0;l<trainData.length;l++)
        {
            if(trainData[l].isRecommended==1)
            {
                /*for(var m=0;m<dateSet.length;m++)
                 {
                 dateSet.dateStart
                 dateSet.dateEnd

                 }*/
                if(isMajorCounter==1)
                {
                    currentStartDate=new Date(dateSetStart.getTime());
                }
                else
                {
                    currentStartDate=new Date(idealStartTime.getTime());
                }
                var minDateSetTrainTimeDifference=-1;
                var minTrainTime;
                var dateStartDay = dateSetStart.clone().clearTime();
                var dateEndDay = dateSetEnd.clone().clearTime();
                var idealStartDay = idealStartTime.clone().clearTime();
                if(isMajorCounter == 1){
                    console.log('1st Major Travel, Finding the vehicle nearest to ideal start time..');
                    while(currentStartDate.isBefore(dateSetEnd))
                    {
                        var currentStartDay = currentStartDate.clone().clearTime();
                        console.log('In while currentStartDate:'+currentStartDate+", trainData[l].DaysOfTravel:"+trainData[l].DaysOfTravel);
                        if(runsOnSameDay(currentStartDate,trainData[l].DaysOfTravel))
                        {
                            console.log('runs on same day');
                            if(currentStartDay.equals(dateStartDay))
                            {
                                console.log('equals dateStart:'+(currentStartDate.toFormat("HH24")+":"+currentStartDate.toFormat("MI")+":"+currentStartDate.toFormat("SS"))+",:"+trainData[l].OriginDepartureTime);
                                if((currentStartDate.toFormat("HH24")+":"+currentStartDate.toFormat("MI")+":"+currentStartDate.toFormat("SS"))<trainData[l].OriginDepartureTime)
                                {
                                    var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
                                    if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
                                    {
                                        console.log('currentTrainTime='+currentTrainTime);
                                        minTrainTime = currentTrainTime;
                                        minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));
                                    }
                                }
                            }
                            else if(currentStartDay.equals(dateEndDay))
                            {
                                console.log('equals dateEnd');
                                //This is the end date
                                if((dateSetEnd.toFormat("HH24")+":"+dateSetEnd.toFormat("MI")+":"+dateSetEnd.toFormat("SS"))>trainData[l].OriginDepartureTime)
                                {
                                    var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
                                    if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
                                    {
                                        console.log('1currentTrainTime='+currentTrainTime);
                                        minTrainTime = currentTrainTime;
                                        minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));
                                    }
                                }
                            }
                            else
                            {
                                console.log('is somewhere in between');
                                var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(),currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
                                if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
                                {
                                    console.log('2currentTrainTime='+currentTrainTime);
                                    minTrainTime = currentTrainTime;
                                    minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));
                                }
                            }
                        }
                        currentStartDate.addDays(1);
                    }
                }
                else {
                    console.log('Major segment after another major segment. Finding the nearest vehicle to ideal start time');
                    while(true)
                    {
                        var currentStartDay = currentStartDate.clone().clearTime();
                        console.log('In while currentStartDate:'+currentStartDate+", trainData[l].DaysOfTravel:"+trainData[l].DaysOfTravel);
                        if(runsOnSameDay(currentStartDate,trainData[l].DaysOfTravel))
                        {
                            console.log('runs on same day');
                            if(currentStartDay.equals(idealStartDay))
                            {
                                console.log('equals idealStartDay:'+(currentStartDate.toFormat("HH24")+":"+currentStartDate.toFormat("MI")+":"+currentStartDate.toFormat("SS"))+",:"+trainData[l].OriginDepartureTime);
                                if((currentStartDate.toFormat("HH24")+":"+currentStartDate.toFormat("MI")+":"+currentStartDate.toFormat("SS"))<trainData[l].OriginDepartureTime)
                                {
                                    var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
                                    if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
                                    {
                                        console.log('currentTrainTime='+currentTrainTime);
                                        minTrainTime = currentTrainTime;
                                        minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));
                                        break;
                                    }
                                }
                            }
                            else
                            {
                                console.log('is somewhere after ideal start day');
                                var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(),currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
                                if((minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
                                {
                                    console.log('2currentTrainTime='+currentTrainTime);
                                    minTrainTime = currentTrainTime;
                                    minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));
                                    break;
                                }
                            }
                        }
                        currentStartDate.addDays(1);
                    }
                }
                //We have got the iteration of the train which is nearest to the ideal time
                //Finding the minimum of all trains
                console.log('minTrainTimeDifference:'+minTrainTimeDifference);
                console.log('minDateSetTrainTimeDifference:'+minDateSetTrainTimeDifference);
                if(minDateSetTrainTimeDifference == -1){
                    console.log('No iteration of the vehicle was found to be running within the days');
                }
                else {
                    if(minTrainTimeDifference == -1 || minTrainTimeDifference > minDateSetTrainTimeDifference)
                    {
                        console.log('Set This Vehicle as new min');
                        minTrainTimeDifference = minDateSetTrainTimeDifference;
                        minTrain = trainData[l];

                        console.log("minTrainTime="+minTrainTime);
                        console.log("minTrainTimeDifference="+minTrainTimeDifference);
                        minTrainDateOfTravel = minTrainTime;
                        minTrainIndex = l;
                    }
                    else {
                        console.log('The earlier selected vehicle was nearer to ideal time than this');
                    }
                }
                //idealStartTime.getMinutesBetween(date);
            }

        }

        //Now we have got the train which needs to be taken for travel along with the date and time of it
        //Setting it in the rome2Rio data
        console.log('kind:'+kind);
        console.log('allSegments[k][vehicleData].length:'+allSegments[k][vehicleData].length);
        console.log('minTrainIndex:'+minTrainIndex);

        if(minTrainIndex != -1 && minTrainDateOfTravel != undefined){
            console.log('minTrainIndex:'+minTrainIndex);
            console.log('allSegments[k][vehicleData][minTrainIndex]:'+JSON.stringify(allSegments[k][vehicleData][minTrainIndex]));
            allSegments[k][vehicleData][minTrainIndex].isFinal = 1;
            allSegments[k][vehicleData][minTrainIndex].date = minTrainDateOfTravel;
            console.log("Takes Train:\n%j",allSegments[k][vehicleData][minTrainIndex]);
            //Commenting as don't know why setting ideal start time to train time only when 1st major segment
            //if(isMajorCounter==1)
            //{
                console.log("minTrainDateOfTravel:"+minTrainDateOfTravel);
                idealStartTime=new Date(minTrainDateOfTravel.getTime());
            //}
            console.log("At time:"+idealStartTime);
            //adding idealStartTime in rome2Rio data
            allSegments[k].startTime=new Date(idealStartTime.getTime());


            idealStartTime.addDays(allSegments[k][vehicleData][minTrainIndex].DestDay-allSegments[k][vehicleData][minTrainIndex].OriginDay);
            idealStartTime.clearTime();
            idealStartTime.addHours(allSegments[k][vehicleData][minTrainIndex].DestArrivalTime.split(":")[0]);
            idealStartTime.addMinutes(allSegments[k][vehicleData][minTrainIndex].DestArrivalTime.split(":")[1]);

            //adding endTime in rome2Rio data
            allSegments[k].endTime=new Date(idealStartTime.getTime());
            allSegments[k].duration = allSegments[k].startTime.getMinutesBetween(allSegments[k].endTime);
            if(allSegments[k][vehicleData][minTrainIndex].fare != undefined){
                allSegments[k].indicativePrice.price = allSegments[k][vehicleData][minTrainIndex].fare;
            }

            console.log("idealStartTime after taking train before buffer:"+idealStartTime);
            //Adding buffer Time
            idealStartTime.addHours(2);
            console.log("idealStartTime after taking train after buffer:"+idealStartTime);
            return idealStartTime;
        }
        else {
            console.log('ISSUE: Could not select any possible vehicle within date set');
            console.log('Details:');
            if(allSegments[k].sName != undefined){
                console.log('sName:'+allSegments[k].sName);
            }
            if(allSegments[k].tName != undefined){
                console.log('tName:'+allSegments[k].tName);
            }
            if(allSegments[k].sAirport != undefined){
                console.log('sAirport:'+allSegments[k].sAirport.name);
            }
            if(allSegments[k].tAirport != undefined){
                console.log('tAirport:'+allSegments[k].tAirport.name);
            }
            return null;
        }

    }
    else {
        console.log('----------------');
        console.log('UNEXPECTED ISSUE: Vehicle Data is empty even after being the default segment');
        console.log('----------------');
        return null;
    }
};

function getTravelPlan(rome2RioData,dateSet,dates,times,ratingRatio,totalDurationOfTrip,numPeople,callback)
{
    if(rome2RioData == null){
        //No trip possible
        calculateBudgetOfTrip.calculateBudgetOfTrip(null,numPeople,callback);
    }
    else {
        var travelDuration=0;var cityTourDuration=[];
        for(var i=0;i<rome2RioData.length;i++)
        {
            var allRoutes=rome2RioData[i].routes;
            for(var j=0;j<allRoutes.length;j++)
            {
                if(allRoutes[j].isDefault==1)
                {
                    travelDuration+=allRoutes[j].duration;
                }
            }
        }

        var tripPossible = true;
        for(var k=0;k<ratingRatio.length;k++)
        {
            //console.log("RatingRatio:"+ratingRatio[k]);
            console.log('totalDurationOfTrip:'+totalDurationOfTrip);
            console.log('travelDuration:'+travelDuration);
            if(totalDurationOfTrip < travelDuration) {
                //Trip is not possible with this combination
                tripPossible = false;
            }
            cityTourDuration.push((parseFloat(ratingRatio[k])*parseFloat(totalDurationOfTrip-travelDuration)));
        }

        if(tripPossible) {
            //console.log("citytoue:"+cityTourDuration);

            //Planing the whole travel

            //ideal StartTime for trip
            var idealStartTime;
            var idealStartMorningTimeHours=6;
            var idealStartEveningTimeHours=18;

            if(times[0]=="Morning")
            {
                idealStartTime=new Date(dates[0].getTime()+idealStartMorningTimeHours*60000*60);
            }
            else
            {
                idealStartTime=new Date(dates[0].getTime()+idealStartEveningTimeHours*60000*60);
            }

            console.log("Trip Starts AT:"+idealStartTime);

            outer:
            for(var i=0;i<rome2RioData.length;i++)
            {
                var allRoutes=rome2RioData[i].routes;
                for(var j=0;j<allRoutes.length;j++)
                {
                    if(allRoutes[j].isDefault==1)
                    {
                        //console.log("isDefault for route"+j);
                        var durationDelayAfterStops = 0;
                        var allSegments=allRoutes[j].segments;
                        var isMajorCounter=0;
                        for(var k=0;k<allSegments.length;k++)
                        {
                            //console.log("Segment No:"+k);
                            //console.log("isMajor"+allSegments[k].isMajor);
                            //console.log("Kind:"+allSegments[k].kind);
                            if(allSegments[k].isMajor==0)
                            {
                                //adding endTime in rome2Rio data
                                allSegments[k].startTime=new Date(idealStartTime.getTime());
                                console.log("Before Taking Minor Travel:"+idealStartTime);
                                idealStartTime.addMinutes(allSegments[k].duration);
                                //adding endTime in rome2Rio data
                                allSegments[k].endTime=new Date(idealStartTime.getTime());
                                console.log("After Taking Minor Travel:"+idealStartTime);
                            }
                            if(allSegments[k].isMajor==1)
                            {
                                isMajorCounter++;
                                if((allSegments[k].kind)&&(allSegments[k].kind=="train"))
                                {
                                    console.log("idealStartTime before selecting train:"+idealStartTime);
                                    idealStartTime = selectFinalTravelVehicle(allSegments, k, isMajorCounter, dateSet, i, idealStartTime, "train", durationDelayAfterStops);
                                    console.log("idealStartTime after selecting train:"+idealStartTime);

                                }

                                //if flight
                                else if((allSegments[k].kind)&&(allSegments[k].kind=="flight"))
                                {
                                    console.log("idealStartTime before selecting flight:"+idealStartTime);
                                    idealStartTime = selectFinalTravelVehicle(allSegments, k, isMajorCounter, dateSet, i, idealStartTime, "flight", durationDelayAfterStops);
                                    console.log("idealStartTime after selecting flight:"+idealStartTime);
                                }

                                //if bus
                                else if((allSegments[k].kind)&&(allSegments[k].kind=="bus"))
                                {
                                    console.log("idealStartTime before selecting bus:"+idealStartTime);
                                    idealStartTime = selectFinalTravelVehicle(allSegments, k, isMajorCounter, dateSet, i, idealStartTime, "bus", durationDelayAfterStops);
                                    console.log("idealStartTime after selecting bus:"+idealStartTime);
                                }

                                //if taxi
                                else if((allSegments[k].subkind)&&(allSegments[k].subkind=="taxi"))
                                {
                                    if(idealStartTime.getHours()>=21||idealStartTime.getHours()<4)
                                    {
                                        if(idealStartTime.getHours()>=21)
                                        {
                                            idealStartTime.addDays(1);
                                        }
                                        idealStartTime.clearTime();
                                        idealStartTime.addHours(5);
                                    }

                                    //adding idealStartTime in rome2Rio data
                                    allSegments[k].startTime=new Date(idealStartTime.getTime());
                                    console.log("Takes Taxi at Time:"+idealStartTime);
                                    idealStartTime.addMinutes(allSegments[k].duration);
                                    //adding endTime in rome2Rio data
                                    allSegments[k].endTime=new Date(idealStartTime.getTime());
                                    console.log("Reaches at Time:"+idealStartTime);
                                    //Adding buffer Time
                                    idealStartTime.addHours(2);
                                }

                                else if((allSegments[k].subkind)&&(allSegments[k].subkind=="cab"))
                                {
                                    if(idealStartTime.getHours()>=21||idealStartTime.getHours()<4)
                                    {
                                        if(idealStartTime.getHours()>=21)
                                        {
                                            idealStartTime.addDays(1);
                                        }
                                        idealStartTime.clearTime();
                                        idealStartTime.addHours(5);
                                    }

                                    //adding idealStartTime in rome2Rio data
                                    allSegments[k].startTime=new Date(idealStartTime.getTime());
                                    console.log("Takes Cab at Time:"+idealStartTime);
                                    idealStartTime.addMinutes(allSegments[k].duration);
                                    //adding endTime in rome2Rio data
                                    allSegments[k].endTime=new Date(idealStartTime.getTime());
                                    console.log("Reaches at Time:"+idealStartTime);
                                    //Adding buffer Time
                                    idealStartTime.addHours(2);
                                }

                                else
                                {
                                    //console.log("Other is:%j",allSegments[k]);

                                    //adding idealStartTime in rome2Rio data
                                    allSegments[k].startTime=new Date(idealStartTime.getTime());
                                    console.log("Takes Other at Time:"+idealStartTime);
                                    idealStartTime.addMinutes(allSegments[k].duration);
                                    //adding endTime in rome2Rio data
                                    allSegments[k].endTime=new Date(idealStartTime.getTime());
                                    console.log("Reaches at Time:"+idealStartTime);
                                }

                                if(idealStartTime == null){
                                    console.log('Breaking out of trip planning');
                                    tripPossible = false;
                                    break outer;
                                }

                            }
                            durationDelayAfterStops += allSegments[k].duration;
                        }

                    }
                }
                if(i!=(rome2RioData.length-1))
                {
                    //Adding tourTime for each city according cityRatings
                    console.log("cityTourDuration"+cityTourDuration[i]);
                    console.log("duration parsed:"+parseInt(cityTourDuration[i]));
                    idealStartTime.addMinutes(parseInt(cityTourDuration[i]));
                    console.log("Leaving from city:"+idealStartTime);
                }
            }
            if(!tripPossible){
                console.log('Trip Planning Not Possible');
                calculateBudgetOfTrip.calculateBudgetOfTrip(null,numPeople,callback);
            }
            else {
                calculateBudgetOfTrip.calculateBudgetOfTrip(rome2RioData,numPeople,callback);
            }
        }
        else {
            calculateBudgetOfTrip.calculateBudgetOfTrip(null,numPeople,callback);
        }
    }
}


module.exports.getTravelPlan=getTravelPlan;


function runsOnSameDay(currentDate,TrainDaysOfTravel)
{
    if(TrainDaysOfTravel=="0")
    {
        return true;
    }
    var TrainDaysOfTravelArray=TrainDaysOfTravel.split("");
    console.log("TrainDaysOfTravelArray:"+TrainDaysOfTravelArray+" currentDate.getDay()+1:"+(currentDate.getDay()+1));
    var currentDay = currentDate.getDay()+1;
    if(TrainDaysOfTravelArray.indexOf(currentDay.toString())!=-1)
    {
        console.log('true');
        return true;
    }
    console.log('false');
    return false;
}
