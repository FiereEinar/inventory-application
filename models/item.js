const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 50, minLength: 2 },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Number, required: true },
  cost_price: { type: Number, required: true },
  stocks: { type: Number, required: true },
  date_added: { type: Date },
  last_updated: { type: Date },
});

ItemSchema.virtual('url').get(function () {
  return `/home/item/${this._id}`;
});

ItemSchema.virtual('profit').get(function () {
  return this.price - this.cost_price;
});

module.exports = mongoose.model('Item', ItemSchema);
