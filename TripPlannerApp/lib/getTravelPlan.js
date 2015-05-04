/**
 * New node file
 */
require('date-utils');
var calculateBudgetOfTrip=require('../lib/calculateBudgetOfTrip');
var selectFinalTravelVehicle = function (allSegments,k,isMajorCounter,dateSet,i,idealStartTime, kind){
//console.log("Kind is train");
    if(kind=="train"){
        var vehicleData = "trainData";
    }
    else if(kind=="flight"){
        var vehicleData = "flightData";
    }
    else if(kind=="bus"){
        var vehicleData = "busData";
    }
console.log("***************vehicle data:"+vehicleData);
    var trainData=allSegments[k][vehicleData];
    var minTrainTimeDifference=-1;
    var minTrain;
    var minTrainDateOfTravel;
    var minTrainIndex;
    var currentStartDate;
    console.log("idealStartTime:"+idealStartTime);
    for(var l=0;l<trainData.length;l++)
    {
        if(trainData[l].isRecommended==1)
        {
            /*for(var m=0;m<dateSet.length;m++)
             {
             dateSet.dateStart
             dateSet.dateEnd

             }*/
            if(
                isMajorCounter==1)
            {
                currentStartDate=new Date(dateSet.dateStart[i].getTime());
            }
            else
            {
                currentStartDate=new Date(idealStartTime.getTime());
            }
            var minDateSetTrainTimeDifference=-1;
            var minTrainTime;
            while(
                currentStartDate.isBefore(dateSet.dateEnd[i]))
            {
                console.log(
                    'In while currentStartDate:'+currentStartDate+
                    ", trainData[l].DaysOfTravel:"+trainData[l].DaysOfTravel);
                if(runsOnSameDay(
                        currentStartDate,trainData[l].DaysOfTravel))
                {
                    console.log('runs on same day');
                    if(currentStartDate.equals(dateSet.dateStart[i]))
                    {
                        console.log('equals dateStart:'+(currentStartDate.toFormat("HH24")+":"+currentStartDate.toFormat("MI")+":"+currentStartDate.toFormat("SS"))+",:"+trainData[l].OriginDepartureTime);
                        if((currentStartDate.toFormat("HH24")+":"+currentStartDate.toFormat("MI")+":"+currentStartDate.toFormat("SS"))<trainData[l].OriginDepartureTime)
                        {
                            var currentTrainTime=new Date(currentStartDate.getFullYear()
                                , currentStartDate.getMonth(), currentStartDate
                                    .
                                    getDate(), parseInt(trainData[l].OriginDepartureTime
                                    .
                                    split(":")[0]),parseInt(trainData[
                                    l].OriginDepartureTime
                                    .split(":")[1]));
                            if((
                                minDateSetTrainTimeDifference==-1)||(minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween(currentTrainTime))))
                            {
                                console.log('currentTrainTime='+
                                currentTrainTime);
                                minTrainTime = currentTrainTime;
                                minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));
                            }
                        }
                    }
                    else if(currentStartDate.equals(dateSet.dateEnd[i]))
                    {
                        console.log('equals dateEnd')
                        ;
                        //This is the end date
                        if((currentStartDate.getHours()+":"+currentStartDate.getMinutes())>trainData
                                [l].OriginDepartureTime)
                        {
                            var currentTrainTime=new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(),
                                    currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]))
                                ;
                            if((minDateSetTrainTimeDifference==-1)||(
                                minDateSetTrainTimeDifference>Math.abs(
                                    idealStartTime.getMinutesBetween(currentTrainTime))))
                            {
                                console.log(
                                    '1currentTrainTime='+currentTrainTime);
                                minTrainTime = currentTrainTime;
                                minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(currentTrainTime));
                            }
                        }
                    }
                    else
                    {
                        console.log('is somewhere i n between');
                        var currentTrainTime=new Date(
                            currentStartDate.getFullYear(), currentStartDate.getMonth(),
                            currentStartDate.getDate(), parseInt(trainData[l].OriginDepartureTime.split(":")[0]),parseInt(trainData[l].OriginDepartureTime.split(":")[1]));
                        if((
                            minDateSetTrainTimeDifference==-1)||(
                            minDateSetTrainTimeDifference>Math.abs(idealStartTime.getMinutesBetween
                            (currentTrainTime))))
                        {
                            console.log('2currentTrainTime='+
                            currentTrainTime);
                            minTrainTime = currentTrainTime;
                            minDateSetTrainTimeDifference = Math.abs(idealStartTime.getMinutesBetween(
                                currentTrainTime));
                        }
                    }
                }


                currentStartDate.addDays(1);
            }
            //We have got the iteration of the train which is nearest to the ideal time
            //Finding the minimum of all trains
            console.log('minTrainTimeDifference:'+minTrainTimeDifference);
            console.log('minDateSetTrainTimeDifference:'+minDateSetTrainTimeDifference);
            if(minTrainTimeDifference == -1 || minTrainTimeDifference >
                minDateSetTrainTimeDifference)
            {

                minTrainTimeDifference = minDateSetTrainTimeDifference;
                minTrain = trainData[l];

                console.log("minTrainTime="+minTrainTime);
                console.log(
                    "minTrainTimeDifference="+
                    minTrainTimeDifference);
                minTrainDateOfTravel = minTrainTime;
                minTrainIndex = l;
            }
            //idealStartTime.getMinutesBetween(date);
        }

    }

    //Now we have got the train which needs to be taken for travel along with the date and time of it
//Setting it in the rome2Rio data
    console.log('kind:'+kind);
    console.log('allSegments[k][vehicleData]:'+allSegments[k][vehicleData]);
    console.log('minTrainIndex:'+minTrainIndex);
    console.log('allSegments[k][vehicleData][minTrainIndex]:'+allSegments[k][vehicleData][minTrainIndex]);
    allSegments[k][vehicleData][minTrainIndex].isFinal = 1;
    allSegments[k][vehicleData][minTrainIndex].date = minTrainDateOfTravel;
    console.log("Takes Train:\n%j",allSegments[k][vehicleData][minTrainIndex]);
    if(isMajorCounter==1)
    {
        console.log("minTrainDateOfTravel:"+minTrainDateOfTravel);
        idealStartTime=new Date(minTrainDateOfTravel.getTime());
    }
    console.log("At time:"+idealStartTime);
    //adding idealStartTime in rome2Rio data
    allSegments[k].startTime=new Date(idealStartTime.getTime());


    idealStartTime.addDays(allSegments[k][vehicleData][minTrainIndex].DestDay-allSegments[k][vehicleData][minTrainIndex].OriginDay);
    idealStartTime.clearTime();
    idealStartTime.addHours(allSegments[k][vehicleData][minTrainIndex].DestArrivalTime.split(":")[0]);
    idealStartTime.addMinutes(allSegments[k][vehicleData][minTrainIndex].DestArrivalTime.split(":")[1]);

    //adding endTime in rome2Rio data
    allSegments[k].endTime=new Date(idealStartTime.getTime());

    console.log("idealStartTime after taking train before buffer:"+idealStartTime);
    //Adding buffer Time
    idealStartTime.addHours(2);
    console.log("idealStartTime after taking train after buffer:"+idealStartTime);
};

function getTravelPlan(rome2RioData,dateSet,dates,times,ratingRatio,totalDurationOfTrip,numPeople,callback)
{
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


    //console.log("totalDurationOfTrip:"+totalDurationOfTrip+":"+"travelDuration"+travelDuration);
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

        for(var i=0;i<rome2RioData.length;i++)
        {
            var allRoutes=rome2RioData[i].routes;
            for(var j=0;j<allRoutes.length;j++)
            {
                if(allRoutes[j].isDefault==1)
                {
                    //console.log("isDefault for route"+j);
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
                                selectFinalTravelVehicle(allSegments, k, isMajorCounter, dateSet, i, idealStartTime, "train");

                            }

                            //if flight
                            else if((allSegments[k].kind)&&(allSegments[k].kind=="flight"))
                            {
                                selectFinalTravelVehicle(allSegments, k, isMajorCounter, dateSet, i, idealStartTime, "flight");
                            }

                            //if bus
                            else if((allRoutes[j].name.toUpperCase() == 'BUS REDBUS'||allRoutes[j].name.toUpperCase() == 'BUS')&&(allSegments[k].kind)&&(allSegments[k].kind=="bus"))
                            {

                                ////adding idealStartTime in rome2Rio data
                                //allSegments[k].startTime=new Date(idealStartTime.getTime());
                                //console.log("Takes Bus at Time:"+idealStartTime);
                                //idealStartTime.addMinutes(allSegments[k].duration);
                                //console.log("Reaches at Time:"+idealStartTime);
                                ////adding endTime in rome2Rio data
                                //allSegments[k].endTime=new Date(idealStartTime.getTime());
                                ////Adding buffer Time
                                //idealStartTime.addHours(2);
                                ////TODO:getBusSchedule and apply logic accordingly
                                selectFinalTravelVehicle(allSegments, k, isMajorCounter, dateSet, i, idealStartTime, "bus");
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

                        }

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
        calculateBudgetOfTrip.calculateBudgetOfTrip(rome2RioData,numPeople,callback);
    }
    else {
        calculateBudgetOfTrip.calculateBudgetOfTrip(null,numPeople,callback);
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
