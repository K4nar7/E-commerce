import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import {redis} from '../Lib/redis.js';


const generateToken = (userId) => {
    const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15m'});
    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
    return { accessToken, refreshToken };
}
const storeRefreshToken = async (userId,refreshToken) => {
    await redis.set(`refresh_token:${userId}`,refreshToken,'Ex',7*24*60*60);
}
const setCookies = (res,accessToken,refreshToken) => {
    res.cookie('access_token',accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'Strict',
        maxAge: 15 * 60 * 1000
    });
      res.cookie('refresh_token',refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'Strict',
        maxAge: 7*24*60*60* 1000
    });
}
export const signup = async (req,res)=>{
    const {name,email,password} = req.body;
    try {
         const userExists = await User.findOne({email});
    if (userExists) {
        return res.status(400).json({message: "User already exists"});
    }
    const user = await User.create({name,email,password});
    const {accessToken, refreshToken} = generateToken(user._id);
    await storeRefreshToken(user._id,refreshToken);
    setCookies(res,accessToken,refreshToken);
    res.status(201).json({message: "User created successfully", 
        user:{
            _id: user._id,
            name: user.name,
            email: user.email,
            rule: user.rule
        }
    });
  }  catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if (user && (await user.comparePassword(password))) {
            const {accessToken,refreshToken} = generateToken(user._id);
            await storeRefreshToken(user._id,refreshToken);
            setCookies(res,accessToken,refreshToken);
            res.status(200).json({message: "Login successful",
                user:{
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    rule: user.rule
                }
            });
        } else {
            res.status(401).json({message: "Invalid email or password"});
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const logout = async (req,res)=>{
    try {
        const refreshToken  = req.cookies.refresh_token;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const refreshToken = async (req,res)=>{
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
          res.status(401).json({message: "No refresh token provided"});
           
        }
        console.log("refresh token:", refreshToken);

        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)
        
        if (storedToken !== refreshToken) {
            res.status(401).json({message: "Invalid refresh token"});
            
            
        }
        const accessToken = jwt.sign({userId: decoded.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15m'});
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'Strict',
            maxAge: 15*60*1000
        });
        res.status(200).json({message: "Token refreshed successfully"});

    } catch (error) {
        console.error("Error during token refresh:", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const getProfile = async (req ,res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({message: "Internal server error"});
    }
}