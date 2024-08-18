// function calculatePriceAtBatch(targetBatch) {
//     let initialAmount = 175616;  // Starting price
//     let increment = 17561.6  // Initial increment is 10 cents
//     let batchPrice = initialAmount;  // Current price after increments

//     for (let batchIndex = 1; batchIndex <= targetBatch; batchIndex++) {
//         let decade = Math.floor((batchIndex - 1) / 10) + 1;
//         let currentIncrement = decade * increment;
//         batchPrice = batchPrice + currentIncrement;
//     }

//     return batchPrice.toFixed(2);
// }

// // Example usage:
// let targetBatch = 100;  // Specify the batch number you want to check
// let priceAtBatch = calculatePriceAtBatch(targetBatch);

// console.log(`Price at Batch ${targetBatch}: $${priceAtBatch}`);


let initialAmount = 1
let incrementAmount = 7
let halfCeturies = 100
for (let i = 0; i < halfCeturies; i++) {
    let amountPercent = (incrementAmount * initialAmount) / 100
    initialAmount = amountPercent + initialAmount
}

console.log(initialAmount);