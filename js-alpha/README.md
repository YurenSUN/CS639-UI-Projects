# Homework: JavaScript α (2 Points)

This homework will introduce you to the syntax and semantics of the JavaScript language. We will be covering multiple topics, including element identification, manipulation, and styling, as well as logging, alerting, branching, looping, and even fetching from an API. By the end of this homework, you will have implemented the functionality supporting Badger Bank, and you will be able to improve the UI in JavaScript β.

Do ***not*** modify any files except for `script.js`. All questions are capable of being solved with [jQuery](https://api.jquery.com) or standard JavaScript syntax within `script.js`. Modifying any file outside of `script.js` will reduce your score by 1 point.

**Objective:** Complete each function inside of the `script.js` file with its desired functionality as described below. Do NOT modify `index.html`, `styles.css`, or add any additional files.

## Submission Details
Exact submission details are still being worked out. Check back here later!

## Problems

### askQuestion (0.1 Points)

Complete this function by making the question field and submit button beneath the welcome message visible.

### submitQuestion (0.1 Points)

Complete this function by printing the user-inputted text from the question field (revealed by the function above) to the console.

### addPizzazz (0.2 Points)

Complete this function by adding some [pizzazz](https://www.merriam-webster.com/dictionary/pizzazz) to the saying of the day; change at least ***three*** style attributes (e.g. color, font, font-weight, etc.) of the quote.

### saveBalance (0.3 Points)

Complete this function by replacing the existing balance with the user-inputted balance. Accept only rational numbers (that is, positive or negative numbers, with or without decimal points). Do not accept balances with a dollar sign, or any other illegal character.  If the user enters an improper balance, print "Cannot update balance, syntax error!" to the console. Otherwise, update the balance accordingly.

An empty or whitespace-only string is ***not*** considered valid.

### printBalance (0.1 Points)

Complete this function by printing the saved balance to the console in the format "You have {AMOUNT} in your account!"

### alertBalance (0.3 Points)

  Complete this function by performing the following conditional logic...

- If the saved balance is less than 0, perform a popup alert saying ":(".

- If the saved balance is between 0 and 100 (inclusive), perform a popup alert saying ":)"

- If the saved balance is over 100, perform a popup alert saying ":D"

### loadFriendsAndFamilyData (0.3 Points)

At Badger Bank, we allow you to see your family and friends' accounts too! Complete this function by displaying the data from the array of objects provided within the function to the table. You ***must*** use a form of looping construct over the array of data!

Additionally, if a family member or friend has a balance of less than one dollar, highlight that row in red.

Code has already been added to ensure that the data is only displayed once, see `hasLoadedFriendsAndFamilyData`.

### addPersonalTransactionRows (0.4 Points)

**Important:** You must be signed into the Computer Sciences VPN in order to connect to the API below. See [this Wisc Help Article](https://kb.wisc.edu/page.php?id=90370) on how to setup GlobalProtect and connect to the VPN. The portal address for Computer Sciences is [compsci.vpn.wisc.edu](http://compsci.vpn.wisc.edu).

Complete this function by fetching ***four*** transactions from an API described below and appending them to the personal transactions table. You may either make four calls to `http://mysqlcs639.cs.wisc.edu:53706/api/badgerbank/transaction`, which does not require a parameter, or a single call to `http://mysqlcs639.cs.wisc.edu:53706/api/badgerbank/transactions?amount=<amn>`, which requires a parameter specifying the number of transactions to return. These APIs are described in more detail in `transaction_api.md` and `transactions_api.md` respectively.

Ordering of the rows is not a concern.

### clearPersonalTransactionRows (0.2 Points)

Complete this function by clearing all of the personal transaction rows. Make sure that you are still able to add additional rows after the table has been cleared!
