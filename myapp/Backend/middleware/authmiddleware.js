import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";

export const protect=async(req,res,next)=>{
    try {
        let token=req.headers.authorization;
        if(token&&token.startsWith('Bearer')){
            token=token.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECERT);
            req.user=await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "User not found, unauthorized" });
            }
            next();
        } else {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed or expired", error: error.message });
    }
};