import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//token genration 
const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECERT,{expiresIn:'7d'});
}





export const registeruser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        //check user is exit is not 
        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"user is already exists"});
        }
        if(password.length<8){
            return res.status(400).json({sucess:false,message:"password must atleast of 8 character"});
        }
        //HAshing
        const salt=await bcrypt.genSalt(10);
        const hashpassword=await bcrypt.hash(password,salt);
        const user=await User.create({
            name,
            email,
            password:hashpassword,
        })
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            token:generateToken(user._id)
            })
    } catch (error) {
        res.status(500).json({message:'server error',
            error:error.message,
        })
    }
}


export const loginuser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(500).json({message:'Invalid user email'});

        }
        //compare
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(500).json({message:'Inavlid'})
        }
         res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            token:generateToken(user._id)
            })
    } catch (error) {
         res.status(500).json({message:'server error',
            error:error.message,
        })
    }
}

//get user
export const getUserprofile=async (req,res) => {
    try {
            const user=await User.findById(req.user._id).select("-password");
            if(!user){
                return res.status(404).json({message:"user not found"});
            }
            res.json(user);
    } catch (error) {
         res.status(500).json({message:'server error',
            error:error.message,
        })
    }

}
