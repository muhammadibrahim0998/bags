import express from 'express';
import { authenticate, preventSuperAdmin } from '../middleware/auth.js';
import { validateProduct } from '../validators/productValidator.js';
const router = express.Router();
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';

router.route('/')
  .get(authenticate, preventSuperAdmin, getItems)
  .post(authenticate, preventSuperAdmin, validateProduct, createItem);

router.route('/:id')
  .get(authenticate, preventSuperAdmin, getItem)
  .put(authenticate, preventSuperAdmin, validateProduct, updateItem)
  .delete(authenticate, preventSuperAdmin, deleteItem);

export default router;
