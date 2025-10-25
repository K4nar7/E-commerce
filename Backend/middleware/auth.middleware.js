import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {

    try {
        const accessToken  = req.cookies.access_token;
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        try {
            const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return res.status(401).json({ message: 'user not found' });
            }
            req.user = user;
            next();
                
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export const adminRoute = (req, res, next) => {
    console.log(req.user); // Add this line
    if (req.user && req.user.rule === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'access denied, admin only' });
    }
}