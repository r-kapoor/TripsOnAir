ALTER TABLE Places
ADD CONSTRAINT fk_cityID_place
FOREIGN KEY (CityID)
REFERENCES CIty(CityID);

select *
from information_schema.referential_constraints
where constraint_schema = 'YOUR_DB'