const fs = require('fs');

// uncleaned data, input it however you want
const data = fs.readFileSync('rechnung_receipt.json');
// const data = fs.readFileSync('roka_receipt.json');


var jsonData = JSON.parse(data)

console.log(jsonData)

for (i = 0; i < jsonData.result.lineItems.length; i++) { 
    var lineItem = jsonData.result.lineItems[i];
    var splitLine = lineItem.desc.split(" ");
    var qty = parseInt(splitLine[0].match(/\d+/g));
    var price = (parseFloat(lineItem.lineTotal)/ parseFloat(qty)).toString();
    var descClean = (splitLine[splitLine.length-1].match(/\d+/g) != null) ? splitLine.slice(1,-1).join(" ") : descClean = splitLine.slice(1).join(" ");
    lineItem.qty = qty;
    lineItem.price = price;
    lineItem.descClean = descClean;
} 

// do whatever you want with jsonData
  


// then write it into a new file
