ALTER TABLE Places
ADD CONSTRAINT fk_cityID_place
FOREIGN KEY (CityID)
REFERENCES CIty(CityID);

select *
from information_schema.referential_constraints
where constraint_schema = 'YOUR_DB'

INSERT INTO Places(Type,Name,PlaceID,Address,PinCode,PhoneNo,CityID,Description,Rating,Website,Latitude,Longitude,Ixigo,TripAdvisor)VALUES('Adventure','Rishikesh Tents','3','Near Haridwar','305004','2145698','22','blahblah','4.5','www.yoyo.com,'80.80','78.89','1','0');