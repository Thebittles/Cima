

/* User */
User = {
    "id": Number, 
    "name": String,
    "email": String,
    "dob": Date,
    "password": String,
    "passwordV": String
}


/* User Schema */
User = {
    "id": Number, 
    "name": String,
    "email": String,
    "dob": Date,
    "password": String,
    "passwordV": String
}

let symptomArray = [
    
]





Symptom = {
    
    "date": Date,
    "id":  Number,
    "bodyLoc": [  //recieving an array of body loc names 
            {
                "id": Number, ///name rather than number to 
                "name": "right ovary", //instead of name maybe bodypart key
                "selected": Boolean,
                "level": 9,  
            },
            {
                "id": Number,
                "name": "left ovary",
                "selected": Boolean,
                "level": Number
                
            }]
}


Treatments = {
    "id": 1,
    "start_date": Date,//moment.js
    "end_date": Date,
    "doctor": String,
    "review": {
        "effective": Number,
        "note": "string"
    }
}

//contact could be its own collection
Doctors = {
    "id": Number,
    "name": String,
    "start_date": '03/05/2021',
    "end_date": '03/05/2021',
    "contact": {
        "country": String,
        "state": String,
        "city": 'Dallas',
        "number": '512-xxx-xxxx',
        "address": "xxx elmo st.",
        "zip": 78748,
        "email": 'drdulemba@MediaDeviceInfo.cm'
    },

}



// 1 a month //multiple a month
// organize by year

Cycle = {
    start_date: '03/05/2021',
    end_date: '03/05/2021',
    solution:[ {
        id: 1,
        item: Tampons,
        selected: true

    },
    {
        id: 2,
        item: Liners,
        selected: false

    },
    {
        id: 3,
        item: Towels,
        selected: true

    },
    {
        id: 4,
        item: Cups,
        selected: false

    }],
    avg_bleeding: [
        {
            id: 1,
            name: 'Light',
            selected: true
        },
        {
            id: 2,
            name: 'Medium',
            selected: true
        },
        {
            id: 3,
            name: 'Heavy',
            selected: false
        }
    ]
}




Cycle = [
        {
        "month": 'Feb',
        "year": '2020',
        "Start_Date": "Date",
        "End_Date": "Date",
        "solution":[{
            "id": 1,
            "item": "Tampons",
            "selected": true
    
        },
        {
            "id": 2,
            "item": "Liners",
            "selected": false
    
        },
        {
            "id": 3,
            "item": "Towels",
            "selected": true
    
        },
        {
            "id": 4,
            "item": "Cups",
            "selected": false
        }],
        "OOC_days": 4,
        "avg_bleeding": [
                {
                    'id': 1,
                    'name': 'Light',
                    'selected': true
                },
                {
                    id: 2,
                    name: 'Medium',
                    selected: true
                },
                {
                    id: 3,
                    name: 'Heavy',
                    selected: false
                }]
            },
            
        ]
    





///Add out of commission time








    "triggers": [
        {
            "id": Number,
            "name": String,
            "selected": Boolean
        },
        {
            "id":Number,
            "name": String,
            "selected": Boolean
        },
        {
            "id": Number,
            "name": String,
            "selected": Boolean
        }
    ]