# Xendit
The application provides functionality for organizing rides.

## Setup

1. Ensure `node (>8.6 and <= 10)` and `npm` are installed
2. Run `npm install`
3. Run `npm test`
4. Run `npm start`
5. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## Endpoints

### Test health
`GET /health` - check if the application is working

#### Response:
*Status code:* `200`  
*Content-Type:* `text/html`  
*Body:* `Healthy`  

### Create ride
`POST /rides` - create ride

#### Request body:
```json
{
  "start_lat": "number",
  "start_long": "number",
  "end_lat": "number",
  "end_long":  "number",
  "rider_name": "string",
  "driver_name": "string",
  "driver_vehicle": "string"
}
```
`start_lat` and `end_lat` - start latitude and end latitude must be between -90 - 90 degrees  
`start_long` and `end_long` - start longitude and end longitude must be between -180 - 180 degrees  
`rider_name` - any non-empty string  
`driver_name` - any non-empty string  
`driver_vehicle` - any non-empty string  

#### Success response:
*Status code:* `200`  
*Content-Type:* `application/json`  
*Body schema:*
```json
{
  "rideID": "number",
  "startLat": "number",
  "startLong": "number",
  "endLat": "number",
  "endLong":  "number",
  "riderName": "string",
  "driverName": "string",
  "driverVehicle": "string",
  "created": "Date"
}
```
`rideID` - id of the created ride  
`startLat` and `endLat` - start latitude and end latitude number between -90 - 90 degrees  
`startLong` and `endLong` - start longitude and end longitude number between -180 - 180 degrees  
`riderName` - any non-empty string  
`driverName` - any non-empty string  
`driverVehicle` - any non-empty string  
`created` - ride creation date in the format: "YYYY-MM-DD hh:mm:ss"  

#### Error response:
*Status code:* `200`  
*Content-Type:* `application/json`  
*Body schema:*
```json
{
  "error_code": "string",
  "message": "string"
}
```
`error_code` - error code. This endpoint has two codes: `VALIDATION_ERROR` and `SERVER_ERROR` If you receive an error with the `VALIDATION_ERROR` code, then you need to change the request body. If you receive an error with the `SERVER_ERROR` code, then most likely something is wrong with the database server.  
`message` - detailed error description

### Get a list of rides
`Get /rides` - get a list of rides

#### Success response:
*Status code:* `200`  
*Content-Type:* `application/json`  
*Body schema:*
```json
[
  {
    "rideID": "number",
    "startLat": "number",
    "startLong": "number",
    "endLat": "number",
    "endLong":  "number",
    "riderName": "string",
    "driverName": "string",
    "driverVehicle": "string",
    "created": "Date"
  }
]
```
`rideID` - id of the created ride  
`startLat` and `endLat` - start latitude and end latitude number between -90 - 90 degrees  
`startLong` and `endLong` - start longitude and end longitude number between -180 - 180 degrees  
`riderName` - any non-empty string  
`driverName` - any non-empty string  
`driverVehicle` - any non-empty string  
`created` - ride creation date in the format: "YYYY-MM-DD hh:mm:ss"

#### Error response:
*Status code:* `200`  
*Content-Type:* `application/json`  
*Body schema:*
```json
{
  "error_code": "string",
  "message": "string"
}
```
`error_code` - error code. This endpoint has two codes: `RIDES_NOT_FOUND_ERROR` and `SERVER_ERROR` If you receive an error message with the code `RIDES_NOT_FOUND_ERROR`, then there are no records in the database. If you receive an error with the `SERVER_ERROR` code, then most likely something is wrong with the database server.  
`message` - detailed error description


### Get ride by id
`Get /rides/:id` - get ride by id

#### Params
`id:number` - integer positive ride id

#### Success response:
*Status code:* `200`  
*Content-Type:* `application/json`  
*Body schema:*
```json
[
  {
    "rideID": "number",
    "startLat": "number",
    "startLong": "number",
    "endLat": "number",
    "endLong":  "number",
    "riderName": "string",
    "driverName": "string",
    "driverVehicle": "string",
    "created": "Date"
  }
]
```
`rideID` - id of the created ride  
`startLat` and `endLat` - start latitude and end latitude number between -90 - 90 degrees  
`startLong` and `endLong` - start longitude and end longitude number between -180 - 180 degrees  
`riderName` - any non-empty string  
`driverName` - any non-empty string  
`driverVehicle` - any non-empty string  
`created` - ride creation date in the format: "YYYY-MM-DD hh:mm:ss"

#### Error response:
*Status code:* `200`  
*Content-Type:* `application/json`  
*Body schema:*
```json
{
  "error_code": "string",
  "message": "string"
}
```
`error_code` - error code. This endpoint has two codes: `RIDES_NOT_FOUND_ERROR` and `SERVER_ERROR` If you receive an error message with the `RIDES_NOT_FOUND_ERROR` code, it means that there is no record in the database with the passed identifier. If you receive an error with the `SERVER_ERROR` code, then most likely something is wrong with the database server.    
`message` - detailed error description
