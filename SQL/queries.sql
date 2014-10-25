ALTER TABLE Places
ADD CONSTRAINT fk_cityID_place
FOREIGN KEY (CityID)
REFERENCES CIty(CityID);

select *
from information_schema.referential_constraints
where constraint_schema = 'YOUR_DB'

select *
from information_schema.table_constraints
where constraint_schema = 'YOUR_DB'

SHOW INDEX FROM Place_Image

DROP INDEX Name ON Place_Image

ALTER TABLE Persons
DROP PRIMARY KEY

TRUNCATE TABLE Places;
TRUNCATE TABLE Place_Image;
TRUNCATE TABLE Place_Charges;
TRUNCATE TABLE Timing;
TRUNCATE TABLE City;
TRUNCATE TABLE BestPlaces;


--INSERT INTO Places(Type,Name,PlaceID,Address,PinCode,PhoneNo,CityID,Description,Rating,Website,Latitude,Longitude,Ixigo,TripAdvisor)VALUES('Adventure','Rishikesh Tents','3','Near Haridwar','305004','2145698','22','blahblah','4.5','www.yoyo.com,'80.80','78.89','1','0');

SELECT c.CityIDOrigin, c.CityIDDestination, IF(AirConnectivity IS NULL,0,AirConnectivity) as AirConnectivity, IF(BusConnectivity IS NULL,0,BusConnectivity) as BusConnectivity, IF(RailwayConnectivity IS NULL,0,RailwayConnectivity) as RailwayConnectivity FROM
(SELECT CityIDOrigin, CityIDDestination FROM
(SELECT CityID as CityIDOrigin FROM City WHERE CityName IN ('COORG', 'OOTY', 'BANGALORE', 'NEW DELHI', 'HYDERABAD')) a
JOIN
(SELECT CityID as CityIDDestination FROM City WHERE CityName IN ('COORG', 'OOTY', 'BANGALORE', 'NEW DELHI', 'HYDERABAD')) b) c
LEFT OUTER JOIN
(SELECT CityIDOrigin, CityIDDestination, NormalizedConnectivity AS AirConnectivity FROM City_Connectivity_Between_Air) d ON (c.CityIDOrigin = d.CityIDOrigin) AND (c.CityIDDestination = d.CityIDDestination)
LEFT OUTER JOIN 
(SELECT CityIDOrigin, CityIDDestination, NormalizedConnectivity AS BusConnectivity FROM City_Connectivity_Between_Bus) e ON (c.CityIDOrigin = e.CityIDOrigin) AND (c.CityIDDestination = e.CityIDDestination)
LEFT OUTER JOIN 
(SELECT CityIDOrigin, CityIDDestination, NormalizedConnectivity AS RailwayConnectivity FROM City_Connectivity_Between_Railway) f ON (c.CityIDOrigin = f.CityIDOrigin) AND (c.CityIDDestination = f.CityIDDestination)
