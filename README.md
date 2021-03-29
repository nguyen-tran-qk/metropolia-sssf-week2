# metropolia-sssf-week2
Assignment for week 2 of Server-side Scripting Frameworks TX00CR77-3005 course at Metropolia UAS

Example requests:

* GET http://nguyentran-chargemap.jelastic.metropolia.fi/station?topRight={"lat":60.2821946,"lng":25.036108}&bottomLeft={"lat":60.1552076,"lng":24.7816538}&limit=2
* GET http://nguyentran-chargemap.jelastic.metropolia.fi/station/60623614935b913b189dd969
* POST http://nguyentran-chargemap.jelastic.metropolia.fi/station
```
{
    "Station": {
        "Title": "My Station",
        "Town": "VungTau",
        "AddressLine1": "49/16 Pho Duc Chinh",
        "StateOrProvince": "Southern Vietnam",
        "Postcode": "12345",
        "Location": {
        "coordinates": [24.77772323548868, 60.203353130088146]
        }
    },
    "Connections":[
        {
        "ConnectionTypeID": "5e39eecac5598269fdad81a0",
        "CurrentTypeID": "5e39ef4a6921476aaf62404a",
        "LevelID": "5e39edf7bb7ae768f05cf2bc",
        "Quantity": 2
        }
    ]
}
```