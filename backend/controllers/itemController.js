import Item from '../models/Item.js';
import { logSystemUpdate } from '../utils/updateHelper.js';

// @desc    Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ shopId: req.user.shopId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item
const getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new item
const createItem = async (req, res) => {
  try {
    // Inject shopId automatically
    const newItemData = { ...req.body, shopId: req.user.shopId };
    const newItem = await Item.create(newItemData);
    
    // Log system update for new product
    await logSystemUpdate(
      "New Features", 
      "zap", 
      `New Product deployed: ${newItem.name} (${newItem.category})`
    );

    // Check if this is a new category for the shop (optional but requested)
    const categoryCount = await Item.countDocuments({ 
      shopId: req.user.shopId, 
      category: newItem.category 
    });
    
    if (categoryCount === 1) {
      await logSystemUpdate(
        "UI Improvements", 
        "sparkles", 
        `New Category established: ${newItem.category}`
      );
    }

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update item
const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found or unauthorized' });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, shopId: req.user.shopId });
    if (!item) return res.status(404).json({ message: 'Item not found or unauthorized' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
};
