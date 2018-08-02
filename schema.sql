CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INTEGER(100) AUTO_INCREMENT,
product_name VARCHAR (50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price_cost INTEGER(6),
stock_quantity INTEGER(70) NOT NULL,
PRIMARY KEY (item_id)


);