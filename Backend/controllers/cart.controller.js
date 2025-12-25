import Product from "../models/products.model.js";

export const addToCart = async(req,res) => {
    try {
        const {productId} = req.body;
        const user = req.user;
        const exsistingItem = user.cartItems.find(item => item.id === productId);
        if (exsistingItem) {
            exsistingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log('error in add to cart controller');
        
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteAllFromCart = async(req,res) =>{
    try {
        const { id: productId } = req.params; // Get from URL params
        const user = req.user;
        
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.id !== productId);
        }
        
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log('error in delete all from cart controller', error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateQuantity = async(req,res) =>{
    try {
        const { id: productId } = req.params; // Fixed: removed .id
        const { quantity } = req.body;
        const user = req.user;
        
        // Fixed: typo cartItems not carItems
        const existingItem = user.cartItems.find((item) => item.id === productId);
        
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item.id !== productId);
                await user.save();
                return res.json(user.cartItems); // Added return
            }
            
            existingItem.quantity = quantity;
            await user.save();
            return res.json(user.cartItems); // Added return
        } else {
            res.status(404).json({message:"Item not found in cart"});
        }
    } catch (error) {
        console.log('error in update quantity controller', error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getCartProducts = async(req,res) =>{
    try {
       const products = await Product.find({ _id: { $in: req.user.cartItems } });
       const cartItems = products.map((product) => {
        const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
        return{...product.toJSON(), quantity:item.quantity};
       })
       res.json(cartItems);
    } catch (error) {
        console.log('error in get cart products controller');
        res.status(500).json({ message: "Internal server error" });
    }

}