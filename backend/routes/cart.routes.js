import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../controller/cartController.js";

const router = express.Router();

router.get('/', isAuthenticated, getCart)
router.post('/add', isAuthenticated, addToCart)
router.delete("/remove", isAuthenticated, removeFromCart)
router.put("/update", isAuthenticated, updateQuantity)



export default router;