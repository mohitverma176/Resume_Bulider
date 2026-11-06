import express from "express";
import { getUserprofile, loginuser, registeruser } from "../controller/usercontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const userRouter=express.Router();

userRouter.post('/register',registeruser);
userRouter.post('/login',loginuser);
userRouter.get('/profile',protect,getUserprofile);
export  {userRouter};