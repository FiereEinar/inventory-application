const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 50, minLength: 2 },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Number, required: true },
  cost_price: { type: Number, required: true },
  stocks: { type: Number, required: true },
  date_added: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

ItemSchema.virtual('url').get(function () {
  return `/home/item/${this._id}`;
});

ItemSchema.virtual('date_added_formatted').get(function () {
  return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

ItemSchema.virtual('last_updated_formatted').get(function () {
  return DateTime.fromJSDate(this.last_updated).toLocaleString(DateTime.DATE_MED);
});

ItemSchema.virtual('profit').get(function () {
  return this.price - this.cost_price;
});

module.exports = mongoose.model('Item', ItemSchema);
