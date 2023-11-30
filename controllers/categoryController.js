const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;

        const category = new Category({
            name,
            parentId,
        });

        const savedCategory = await category.save();

        res.status(201).json({ status: 'Success', data: savedCategory });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
};

exports.getCategoriesTree = async (req, res) => {
    try {
        const categories = await Category.find().populate('parentId', 'name').exec();

        const transformCategory = (category) => {
            const transformedCategory = {
                _id: category._id,
                name: category.name,
                parentId: category.parentId,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            };

            const subcategories = categories
                .filter((subcat) => subcat.parentId && subcat.parentId.equals(category._id))
                .map(transformCategory);

            if (subcategories.length > 0) {
                transformedCategory.subcategories = subcategories;
            }

            return transformedCategory;
        };

        const rootCategories = categories.filter((category) => !category.parentId);
        const transformedCategories = rootCategories.map(transformCategory);

        return transformedCategories;
    } catch (error) {
        throw new Error(`Error fetching categories tree: ${error.message}`);
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categoriesTree = await this.getCategoriesTree();
        res.json({ status: 'Success', data: categoriesTree });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
};