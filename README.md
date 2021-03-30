# metropolia-sssf-week2

Assignment for week 2 of Server-side Scripting Frameworks TX00CR77-3005 course at Metropolia UAS

## Available APIs:

-   Get all stations within a location and limit the number of results, `topRight`, `bottomLeft` and `limit` params are optional:

    (GET) `http://nguyentran-chargemap.jelastic.metropolia.fi/station?topRight={"lat":60.2821946,"lng":25.036108}&bottomLeft={"lat":60.1552076,"lng":24.7816538}&limit=2`

-   Get a station by ID:

    (GET) `http://nguyentran-chargemap.jelastic.metropolia.fi/station/<station_id>`

-   Create a new station:

    (POST) `http://nguyentran-chargemap.jelastic.metropolia.fi/station`

    Payload:

```
{
    "Station": {
        "Title": "My Station",
        "Town": "Espoo",
        "AddressLine1": "Piispansilta 14",
        "StateOrProvince": "Southern Finland",
        "Postcode": "02230",
        "Location": {
            "coordinates": [24.77772323548868, 60.203353130088146]
        }
    },
    "Connections":[
        {
        "ConnectionTypeID": "5e39eecac5598269fdad81a0",
        "CurrentTypeID": "5e39ef4a6921476aaf62404a",
        "LevelID": "5e39edf7bb7ae768f05cf2bc",
        "quantity": 2
        }
    ]
}
```

-   Update a station by ID:

    (PUT) `http://nguyentran-chargemap.jelastic.metropolia.fi/station/<station_id>`

    Payload:

```
{
    "Station": {
        "_id": "5e8df9a81f87eb168e4c6757",
        "Title": "Testi",
        "Town": "Espoo",
        "AddressLine1": "Sinimäentie 8b",
        "StateOrProvince": "Southern Finland",
        "Postcode": "02630",
        "Location": {
            "coordinates": [24.77772323548868, 60.203353130088146]
        }
    },
    "Connections":[
        {
            "_id": "5e8df9a81f87eb168e4c6756",
            "ConnectionTypeID": "5e39eecac5598269fdad81a0",
            "CurrentTypeID": "5e39ef4a6921476aaf62404a",
            "LevelID": "5e39edf7bb7ae768f05cf2bc",
            "Quantity": 7
        }
    ]
}
```

-   Delete a station by ID:

    (DELETE) `http://nguyentran-chargemap.jelastic.metropolia.fi/station/<station_id>`