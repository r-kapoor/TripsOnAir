/**
 * Created by rkapoor on 06/03/15.
 */
function getValidDateLimits(startDate,endDate,startTime,endTime,daysOfTravelArray,OriginDepartureTime)
{
    console.log("Checking for limits");
    console.log("startDate,enddate:,startTime,endTime,OriginDeptTime"+startDate+","+endDate+","+startTime+","+endTime+","+OriginDepartureTime);
    console.log("daysofTravelArray:"+daysOfTravelArray);


    var validDates = [];
    if(daysOfTravelArray[0]==0)
    {
        var currentStDate = startDate.clone().clearTime();
        var enDate = endDate.clone().clearTime();
        var stDate = startDate.clone().clearTime();
        while(true) {
            if(currentStDate.isAfter(enDate)) {
                break;
            }
            if(stDate.equals(currentStDate)) {
                if(OriginDepartureTime > startTime) {
                    if(currentStDate.equals(enDate)){//start date is also end date
                        if(OriginDepartureTime < endTime){
                            validDates.push(currentStDate.clone());
                        }
                    }
                    else
                    {
                        validDates.push(currentStDate.clone());
                    }
                }
                currentStDate.addDays(1);
                continue;
            }
            else if(enDate.equals(currentStDate)) {
                if(OriginDepartureTime < endTime) {
                    validDates.push(currentStDate.clone());
                }
                currentStDate.addDays(1);
                continue;
            }
            else {
                validDates.push(currentStDate.clone());
            }
            currentStDate.addDays(1);
        }
        return validDates;
    }

    for(var i=0;i<daysOfTravelArray.length;i++)
    {
        var stDate=new Date(startDate.getTime());
        var enDate=new Date(endDate.getTime());
        while(true)
        {
            if(stDate.isAfter(enDate))
            {
                break;
            }

            if((stDate.getDay()+1)==daysOfTravelArray[i])//+1 as getDay returns 0-6 days;flight runs on the current date
            {
                if(stDate.getDate()==startDate.getDate())//current date is start date
                {
                    if(startTime<OriginDepartureTime)//flight is departing after start time
                    {
                        if(stDate.getDate()==enDate.getDate())//current date is also end date
                        {
                            if(OriginDepartureTime<endTime)//flight is departing before end time
                            {
                                validDates.push(stDate.clone());
                            }
                        }
                        else
                        {
                            validDates.push(stDate.clone());
                        }

                    }
                }
                else if(stDate.getDate()==enDate.getDate())//if current date is end date
                {
                    if(OriginDepartureTime<endTime)//flight is departing before end time
                    {
                        validDates.push(stDate.clone());
                    }
                }
                else//current date is between start date and end date
                {
                    validDates.push(stDate.clone());
                }

            }
            //flight doesn't run on the current date
            stDate.addDays(1);
        }
    }
    return validDates;
}

module.exports.getValidDateLimits = getValidDateLimits;
