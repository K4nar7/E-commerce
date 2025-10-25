import Product from "../models/products.model.js";
import redis from "../models/products.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getFeaturedProducts = async (req,res) => {
    try {
        let featuredProducts = await redis.getMaxListeners("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: "server error",error:error.message });
    }
}
export const createProduct = async (req, res) => {
    try {
        const {name,description,price,category,image,isFeatured} = req.body;
        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });

        }
        const product = Product.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
            isFeatured
        });
return res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: error.message });
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
              await cloudinary.uploader.destroy(`products/${publicId}`);
              console.log('delete an image from cloudinary');
              
        } catch (error) {
           console.log('Failed to delete image from Cloudinary:', error);
            
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: error.message });
    }
}
export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([{
            $sample:{size:2} },{
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    price:1,
                    image:1
                }
            }
       ])
       res.json(products);
        
    } catch (error) {
        console.log("Error fetching recommended products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const getProductsByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        const products = await Product.find({ category });
        res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching products by category:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}