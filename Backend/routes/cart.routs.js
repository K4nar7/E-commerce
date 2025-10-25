import express from 'express';
import {addToCart,deleteAllFromCart,updateQuantity,getCartProducts} from '../controllers/cart.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/',protectRoute,getCartProducts);
router.post('/',protectRoute,addToCart);
router.put('/:id',protectRoute,updateQuantity);
router.delete('/:id',protectRoute,deleteAllFromCart);
export default router;