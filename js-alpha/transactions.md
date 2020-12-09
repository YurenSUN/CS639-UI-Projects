# Get Transactions

Used to collect multiple transactions from BadgerBank.

**URL** : `/api/badgerbank/transactions`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

```
/api/badgerbank/transactions?amount={amn ∈ [0, 25]}
```

**Data example**

```
/api/badgerbank/transactions?amount=6
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
    {
        "date": "2020-05-13T21:53:23.108Z",
        "company": "Abshire - Langworth",
        "amount": 464.81
    },
    {
        "date": "2020-03-06T04:13:46.257Z",
        "company": "Ritchie and Sons",
        "amount": 793.31
    },
    {
        "date": "2020-04-24T12:03:38.370Z",
        "company": "Witting, Gleichner and Tromp",
        "amount": 408.37
    },
    {
        "date": "2020-07-20T07:09:59.736Z",
        "company": "Berge Group",
        "amount": 513.31
    },
    {
        "date": "2020-02-23T18:04:26.186Z",
        "company": "Brakus and Sons",
        "amount": 773.18
    },
    {
        "date": "2020-03-26T15:05:34.658Z",
        "company": "Howe LLC",
        "amount": 111.16
    }
]
```

## Error Response

**Condition** : If an unexpected error occurs, or if an incorrect JSON is sent. Note that if a number is given outside the bounds, an empty array is returned.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error-msg": "Oops! Something went wrong. Check to make sure that you are sending a valid request. Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed. If you have verified that your request is valid, please contact a CS639 administrator.",
    "error-req": "{}",
    "date-time": "8/23/2020 9:07:39 PM"
}
```