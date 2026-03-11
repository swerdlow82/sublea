from datetime import datetime
from pydantic import ValidationError
from schemas import ListingCreate
try:
    obj = ListingCreate.parse_raw('{"user_id":0,"title":"test","description":"test test test test test test test test test test test test","rent":100,"address":"test","zip_code":"97401","city":"Eugene","state":"OR","country":"USA","bedrooms":1,"bathrooms":1,"roommate_count":0,"available_from":"2020-10-20T00:00:00","available_to":null,"images":"","anonymous_lister":false}')
    print("Success")
except ValidationError as e:
    print(e.json())
