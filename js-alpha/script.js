// TODO Complete this file as described by the README.md
// Do NOT modify any files outside of this.

let hasLoadedFriendsAndFamilyData = false;

function askQuestion() {
    document.getElementById("questionArea").style.visibility = "visible";
}

function submitQuestion() {
    console.log(document.getElementById("questionField").value);
}

function addPizzazz() {
    // only 1 elt in the class, no need to loop 
    let styleToChange = document.getElementsByName("sayingOfTheDay")[0].style;
    styleToChange.color = "#ee3f4d";
    styleToChange.font = 50;
    styleToChange.fontFamily = "Charcoal,sans-serif";
    styleToChange.fontWeight = "900";
}

function saveBalance() {
    // accept positive or negative numbers, with or without decimal points
    // An empty or whitespace-only string is not considered valid.
    let input = document.getElementById("balanceInput").value;
    if (isNaN(input) || input.trim() == "") {
        console.log("Cannot update balance, syntax error!");
    } else {
        // to handle cases like 0123, saved as 123
        document.getElementById("balance").innerHTML = parseFloat(input);
    }
}

function printBalance() {
    console.log("You have " + document.getElementById("balance").innerHTML + " in your account!");
}

function alertBalance() {
    let curBalance = parseFloat(document.getElementById("balance").innerHTML);
    if (curBalance > 100) {
        // over 100, perform a popup alert saying ":D"
        alert(":D");
    } else if (curBalance >= 0) {
        // between 0 and 100 (inclusive), perform a popup alert saying ":)"
        alert(":)");
    } else {
        // less than 0, perform a popup alert saying ":(".
        alert(":(");
    }

}

function loadFriendsAndFamilyData() {

    if (hasLoadedFriendsAndFamilyData) {
        return;
    } else {
        hasLoadedFriendsAndFamilyData = true;
    }

    let friendsAndFamilyAccounts = [{
            name: "Jane McCain",
            balance: 7262.71
        },
        {
            name: "Bill Phil",
            balance: 9830.02
        },
        {
            name: "Tod Cod",
            balance: 0.03
        },
        {
            name: "Karen Marin",
            balance: 72681.01
        }
    ];

    // added codes
    let table = document.getElementById("friendsAndFamilyBalances");
    for (let i = 0; i < friendsAndFamilyAccounts.length; i++) {
        let pair = friendsAndFamilyAccounts[i];
        // insert row at the bottom
        var row = table.insertRow(i + 1);

        // insert two cells
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        // cell1 for name, cell2 for balance
        cell1.innerHTML = pair.name;
        cell2.innerHTML = pair.balance;

        // if a family member or friend has a balance of less than one dollar, highlight that row in red.
        if (parseFloat(pair.balance) < 1) {
            row.style.color = ("red");
        }
    }
}

function addPersonalTransactionRows() {
    let request = new XMLHttpRequest();
    request.open("GET", "http://mysqlcs639.cs.wisc.edu:53706/api/badgerbank/transactions?amount=4", true);
    request.responseText = 'json';
    request.send();

    request.onload = function() {
        if (request.status == 200) {
            // request successfully
            let response = JSON.parse(request.response);
            let table = document.getElementById("personalTransactions").getElementsByTagName('tbody')[0];
            for (let i = 0; i < response.length; i++) {
                let cur_response = response[i];
                // insert row at the bottom
                var row = table.insertRow(-1);

                // insert two cells
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);

                // cell1 for name, cell2 for balance
                cell1.innerHTML = cur_response.date;
                cell2.innerHTML = cur_response.company;
                cell3.innerHTML = cur_response.amount;
            }
        } else {
            // fail, do nothing so far
        }
    }
}

function clearPersonalTransactionRows() {
    document.getElementById("personalTransactions").getElementsByTagName('tbody')[0].innerHTML = "";
}