// mysql db to update products

var mysql = require("mysql");

// inquirer used to ask questions
var inquirer = require("inquirer");

// the module used for table format for data
require("console.table");


// connection to sql db
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

// View all products
function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
   
    console.log(res);
    console.log(" ");
    console.log("                The River Kayaking Store");
    console.log("                   Current Inventory      ");
    console.log("**************************************************************************");
    console.table(res);
    console.log("**************************************************************************");
    console.log(" ");

   
    customerSelection(res);
  });
}
//  Function for customer product selection
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

          // runs function for quantity selection afte the product is selected
          customerQuant(product);

        }
        else {
          // make another selection if # isn't in selection list
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
  // Function for quantity selection

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
          // if quantity zero, prompts user to pick another item
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
          console.log("Your Total is $" + product.price_cost * quantity);
          console.log("Thank you for Shopping with us!");
          console.log(" ");
          process.exit();

        }
      );
    }
    
    // Checking/Updating inventory

    function checkInventory(choiceId, inventory) {
      for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
          return inventory[i];
        }
      }
    
      return null;
    }

  