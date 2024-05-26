#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");

  await createCategories();
  await createItems();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function itemCreate(index, name, category, price, cost_price, stocks) {
  const itemDetail = {
    name: name,
    category: category,
    price: price,
    cost_price: cost_price,
    stocks: stocks
  };

  const item = new Item(itemDetail);
  await item.save();

  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function categoryCreate(index, name) {
  const categoryDetail = { name: name };

  const category = new Category(categoryDetail);
  category.save();

  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');

  await Promise.all([
    categoryCreate(0, 'school supplies'),
    categoryCreate(1, 'clothing'),
    categoryCreate(2, 'tools'),
    categoryCreate(3, 'electronics'),
  ]);
}

async function createItems() {
  console.log('Adding items');

  await Promise.all([
    itemCreate(0, 'pencil', categories[0], 12, 8, 50),
    itemCreate(1, 'paper', categories[0], 55, 45, 20),

    itemCreate(2, 'yellow shirt', categories[1], 85, 50, 5),
    itemCreate(3, 'black shirt', categories[1], 95, 50, 8),

    itemCreate(4, 'iphone 20 pro max limited edition', categories[3], 150000, 1300000, 10),
    itemCreate(5, 'type c charger', categories[3], 150, 120, 15),
  ]);
}
