import Coupon from "../models/coupon.model.js";

export const getCoupons = async (req,res) => {
    try {
        const coupon = await Coupon.findOne({userId:req.user._id,isActive:true});
        res.json(coupon || null);
    } catch (error) {
        console.log('Error in getCoupons:', error);
        
        res.status(500).json({message:"Internal server error"});
    }
}

export const validateCoupons = async (req,res) => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code,userId:req.user._id,isActive:true});
        if (!coupon) {
            return res.status(404).json({message:"Coupon not found or inactive"});
        }
        if (coupon.expirationDate < new Date()) {
            coupon.expirationDate = false;
            await coupon.save();
            return res.status(400).json({message:"Coupon has expired"});
        }
        res.json({message:"Coupon is valid",discountPercentage:coupon.discountPercentage,code:coupon.code});
    } catch (error) {
        console.log('Error in validateCoupons:', error);
        res.status(500).json({message:"Internal server error"});
    }
}