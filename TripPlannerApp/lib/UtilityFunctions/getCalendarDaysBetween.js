/**
 * Created by rkapoor on 30/01/15.
 */
/**
 * Calculates the number of days (irrespective of time) between 2 dates. Eg 2014-01-01 19:00:00 b/w 2014-01-02 5:00:00 = 1
 */
function getCalendarDaysBetween(dateStart, dateEnd) {
    dateStartClone = dateStart.clone();
    dateEndClone = dateEnd.clone();
    dateStartClone.clearTime();
    dateEndClone.clearTime();
    return dateStartClone.getDaysBetween(dateEndClone);
}

module.exports.getCalendarDaysBetween = getCalendarDaysBetween;
