# Object Specifications for our MongoDB Database

## Overview

The DB stores Room objects, which are created and/or joined. Each Room corresponds to the splitting of one receipt. That is to say, if you're at a restaurant and are splitting a receipt with friends, someone will upload a receipt, preprocessing etc is done, and a Room is created. Friends then join this Room.

The Room contains a list of Users and a list of ReceiptItems , among other fields.

The documentation below clarifies the objects.

## Objects

### Room object - example

```json
{
  "id": 1, // int, key
  "name": "SomeCode", // string. the code is uniquely generated from combinations of words from a dictionary
  "establishment": "ROKA", // string
  "users": [User1, User2], // list of User objects
  "receipItems": [ReceiptItem1, ReceiptItem2], // list of Item objects
  "currency": "GBP", // string, uses country code
  "taxPercentage": 0.10, // float, tax on the entire 
  "totalPrice": 15.74, // float
  "receiptImg": blob // an image blob for the receipt
}
```

#### User object - example

```json
{
  "id": 1, // int, key
  "name": "Bill Gates", // string
  "isPayer": true, // boolean
  "selectedItems": [itemID1, itemID2] // list of ints, foreign key into item.id
}
```

#### ReceiptItem object - example

```json
{
  "id": 1, // int, key
  "name": "Apfelstrudel", // string, will be descClean from TabScanner
  "qty": 2, // int
  "price": 6.99, // float
  "discount": 0.00, // float, discount for this specific item
  "totalPrice": 13.98 // float, is equal to price*qty*(1-discount)
}
```
