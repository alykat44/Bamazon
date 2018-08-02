var mysql = require("mysql");
var inquirer = require("inquirer");



var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Memphis40",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
   
    console.log(res);
    // connection.end();


    customerSelection(res);
  });
}
 

 /* function Start() {
  inquirer
    .prompt({
      name: "item",
      type: "input",
      message: "What would you like to buy?",

    })

  } */
 



  function customerSelection(inventory) {
    inquirer
      .prompt([
        {
          name: "choice",
          type: "input",
          message: "Type in the id number of item desired",
          validate: function (val) {
            return !isNaN(val);
          }
        }

      ])
      // inquirer function will return an object with a key name: choice = userinput

      .then(function (val) {
        console.log(val);
        var itemId = parseInt(val.choice);
        var product = checkInventory(itemId, inventory);
        if (product) {

          customerQuant(product);

        }
        else {
          console.log(" ");
          console.log(" ");
          console.log("--------------------------------");
          console.log("That item is not in the inventory, choose another product.");
          console.log("--------------------------------");
          console.log(" ");
          console.log(" ");
          afterConnection();


        }
      });

  }

  function customerQuant(product) {
    inquirer
      .prompt([
        {
          name: "quantity",
          type: "input",
          message: "How many items would you like to purchase?",
          validate: function (val) {
            return val > 0;
          }

        }

      ])

      .then(function (val) {
        var quantity = parseInt(val.quantity);

        if (quantity > product.stock_quantity) {

          console.log(" ");
          console.log(" ");
          console.log("--------------------------------");
          console.log("Zero in stock, please make another selection.");
          console.log("--------------------------------");
          console.log(" ");
          console.log(" ");
          afterConnection();
        }
        else {
          makePurchase(product, quantity);

        }


      });

    }
    // finalize the purchase
    
    function makePurchase (product, quantity) {
      connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],

        function(err, res) {
          console.log(" ");
          console.log(" ");
          console.log("--------------------------------");
          console.log("Thank you for your purchase of " + quantity + " " + product.product_name + "'s!");
          console.log("--------------------------------");
          console.log(" ");
          console.log(" ");
          process.exit();

        }
      );
    }
    
    // Checking inventory

    function checkInventory(choiceId, inventory) {
      for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
          return inventory[i];
        }
      }
    
      return null;
    }

  