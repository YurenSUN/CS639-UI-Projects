# Get Transaction

Used to collect a transaction from BadgerBank.

**URL** : `/api/badgerbank/transaction`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

```json
{ }
```

**Data example**

```json
{ }
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "date": "2020-05-29T15:02:20.763Z",
    "company": "Walsh - O'Hara",
    "amount": 975.39
}
```

## Error Response

**Condition** : If an unexpected error occurs.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error-msg": "Oops! Something went wrong. Check to make sure that you are sending a valid request. Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed. If you have verified that your request is valid, please contact a CS639 administrator.",
    "error-req": "{}",
    "date-time": "8/23/2020 9:02:48 PM"
}
```