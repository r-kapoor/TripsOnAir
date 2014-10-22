SELECT CityID, SUM(NumberOfTrains) as Connectivity FROM (
	SELECT c.StationCode, d.CityID, c.NumberOfTrains FROM (
		SELECT StationCode, SUM(NumberOfTimesInDay) AS NumberOfTrains FROM (
			SELECT TrainNo, IF(DaysOfTravel = '0', 7, CHAR_LENGTH(DaysOfTravel))/7.0 as NumberOfTimesInDay from Trains
		) a JOIN (
			SELECT StationCode, TrainNo FROM Railway_Timetable
		) b WHERE (a.TrainNo = b.TrainNo) GROUP BY StationCode
	) c 
	JOIN (
		SELECT CityID, StationCode FROM RailwayStations_In_City
	) d 
	WHERE (c.StationCode = d.StationCode)
) e GROUP BY CityID

--Railway City Connectivity

TRUNCATE City_Connectivity_Railway;
INSERT INTO City_Connectivity_Railway
SELECT CityID, SUM(NumberOfTimesInDay) AS NumberOfTrains FROM (
	SELECT TrainNo, IF(DaysOfTravel = '0' OR DaysOfTravel = '8', 7, CHAR_LENGTH(DaysOfTravel))/7.0 as NumberOfTimesInDay from Trains
) a JOIN (
	SELECT DISTINCT CityID, TrainNo FROM (
		SELECT StationCode, TrainNo FROM Railway_Timetable
	) a 
	JOIN (
		SELECT CityID, StationCode FROM RailwayStations_In_City
	) b WHERE (a.StationCode = b.StationCode)
) b WHERE (a.TrainNo = b.TrainNo) GROUP BY CityID

--Railway Between City Connectivity

TRUNCATE City_Connectivity_Between_Railway;
INSERT INTO City_Connectivity_Between_Railway
SELECT CityIDOrigin, CityIDDestination, SUM(NumberOfTimesInDay) AS Connectivity FROM (
	SELECT TrainNo, IF(DaysOfTravel = '0' OR DaysOfTravel = '8', 7, CHAR_LENGTH(DaysOfTravel))/7.0 as NumberOfTimesInDay from Trains
	) e JOIN (
		SELECT DISTINCT c.CityID as CityIDOrigin, d.CityID as CityIDDestination, c.TrainNo FROM (
			SELECT DISTINCT CityID, TrainNo, DistanceCovered FROM (
					SELECT StationCode, TrainNo, DistanceCovered FROM Railway_Timetable
				) a 
				JOIN (
					SELECT CityID, StationCode FROM RailwayStations_In_City
				) b WHERE (a.StationCode = b.StationCode)
		) c JOIN (
			SELECT DISTINCT CityID, TrainNo, DistanceCovered FROM (
					SELECT StationCode, TrainNo, DistanceCovered FROM Railway_Timetable
				) a 
				JOIN (
					SELECT CityID, StationCode FROM RailwayStations_In_City
				) b WHERE (a.StationCode = b.StationCode)
		) d
		WHERE (c.TrainNo = d.TrainNo) AND (c.CityID != d.CityID) AND (c.DistanceCovered < d.DistanceCovered)
	) f
	WHERE (e.TrainNo = f.TrainNo)
GROUP BY CityIDOrigin, CityIDDestination

--Flight Between City Connectivity

TRUNCATE City_Connectivity_Between_Air;
SET @dateoftravel = '2014-06-01';
INSERT INTO City_Connectivity_Between_Air
SELECT OriginCityID, DestinationID, Count(*) AS Connectivity FROM 
(SELECT DISTINCT OriginCityID, DestinationID, DepartureTime, ArrivalTime FROM Flight WHERE (DepartureDate = @dateoftravel) AND (Stops = 0)) a
GROUP BY OriginCityID, DestinationID;

--Flight City Connectivity

TRUNCATE City_Connectivity_Air;
SET @dateoftravel = '2014-06-01';
INSERT INTO City_Connectivity_Air
SELECT OriginCityID, COUNT(*) AS Connectivity FROM
(SELECT DISTINCT OriginCityID, DestinationID, DepartureTime, ArrivalTime FROM Flight WHERE (DepartureDate = @dateoftravel) AND (Stops = 0)) a
GROUP BY OriginCityID

--Bus Between City Connectivity
TRUNCATE City_Connectivity_Between_Bus;
SET @dateoftravel = '2014-02-24';
INSERT INTO City_Connectivity_Between_Bus
SELECT OriginCityID, DestinationID, Count(*) AS Connectivity FROM 
(SELECT distinct OriginCityID, DestinationID, DepartureDate, DepartureTime, Operator from Bus WHERE DepartureDate = @dateoftravel) a
GROUP BY OriginCityID, DestinationID;

--Bus City Connectivity
TRUNCATE City_Connectivity_Bus;
SET @dateoftravel = '2014-02-24';
INSERT INTO City_Connectivity_Bus
SELECT OriginCityID, Count(*) AS Connectivity FROM 
(SELECT distinct OriginCityID, DestinationID, DepartureDate, DepartureTime, Operator from Bus WHERE DepartureDate = @dateoftravel) a
GROUP BY OriginCityID;

--Update Tables
UPDATE City_Connectivity_Air
SET NormalizedConnectivity = Connectivity/(SELECT MaxConnectivity FROM (SELECT MAX(Connectivity) as MaxConnectivity FROM City_Connectivity_Air) a);

UPDATE City_Connectivity_Bus
SET NormalizedConnectivity = Connectivity/(SELECT MaxConnectivity FROM (SELECT MAX(Connectivity) as MaxConnectivity FROM City_Connectivity_Bus) a);

UPDATE City_Connectivity_Railway
SET NormalizedConnectivity = Connectivity/(SELECT MaxConnectivity FROM (SELECT MAX(Connectivity) as MaxConnectivity FROM City_Connectivity_Railway) a);

UPDATE City_Connectivity_Between_Air
SET NormalizedConnectivity = Connectivity/(SELECT MaxConnectivity FROM (SELECT MAX(Connectivity) as MaxConnectivity FROM City_Connectivity_Air) a);

UPDATE City_Connectivity_Between_Bus
SET NormalizedConnectivity = Connectivity/(SELECT MaxConnectivity FROM (SELECT MAX(Connectivity) as MaxConnectivity FROM City_Connectivity_Between_Bus) a);

UPDATE City_Connectivity_Between_Railway
SET NormalizedConnectivity = Connectivity/(SELECT MaxConnectivity FROM (SELECT MAX(Connectivity) as MaxConnectivity FROM City_Connectivity_Between_Railway) a);

