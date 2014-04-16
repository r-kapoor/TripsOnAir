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


INSERT INTO Places(Type,Name,PlaceID,Address,PinCode,PhoneNo,CityID,Description,Rating,Website,Latitude,Longitude,Ixigo,TripAdvisor)VALUES('Adventure','Rishikesh Tents','3','Near Haridwar','305004','2145698','22','blahblah','4.5','www.yoyo.com,'80.80','78.89','1','0');