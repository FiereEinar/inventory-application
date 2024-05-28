const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');

exports.category_list = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render('category_views/category_list', {
    title: 'Category List',
    categories: categories
  });
});

exports.category_detail = asyncHandler(async (req, res) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).populate('category').sort({ name: 1 }).exec()
  ]);

  const num_of_items = categoryItems.length;

  res.render('category_views/category_detail', {
    title: 'Category Detail',
    category: category,
    num_of_items: num_of_items,
    categoryItems: categoryItems
  });
});

exports.category_add_get = (req, res) => {
  res.render('category_views/category_add_form', {
    title: 'Add Category'
  });
};

exports.category_add_post = [
  body('name', 'Name must be 2 characters above and 50 characters below')
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name
    });

    if (!errors.isEmpty()) {
      res.render('category_views/category_add_form', {
        title: 'Add Category',
        category: category,
        errors: errors.array()
      });
    } else {
      await category.save();
      res.redirect('/home/categories');
    }
  })
];

exports.category_edit_get = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).exec();

  res.render('category_views/category_add_form', {
    title: 'Edit Category',
    category: category
  });
});

exports.category_edit_post = [
  body('name', 'Name must be 2 characters above and 50 characters below')
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render('category_views/category_add_form', {
        title: 'Edit Category',
        category: category,
        errors: errors.array()
      });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.url);
    }
  })
];

exports.category_delete_get = asyncHandler(async (req, res) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).populate('category').sort({ name: 1 }).exec()
  ]);

  const num_of_items = categoryItems.length;

  if (category === null) {
    const error = new Error('Category not found');
    error.status = 404;
    return next(error);
  }

  res.render('category_views/delete_category', {
    title: 'Delete Category',
    category: category,
    categoryItems: categoryItems,
    num_of_items: num_of_items
  });
});

exports.category_delete_post = asyncHandler(async (req, res) => {
  const categoryItems = await Item.find({ category: req.params.id }).populate('category').sort({ name: 1 }).exec();

  if (categoryItems.length) {
    const category = await Category.findById(req.params.id).exec();

    const num_of_items = categoryItems.length;

    res.render('category_views/delete_category', {
      title: 'Delete Category',
      category: category,
      categoryItems: categoryItems,
      num_of_items: num_of_items
    });
  } else {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/home/categories');
  }
});
