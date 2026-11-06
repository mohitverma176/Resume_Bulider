import express from 'express'
import { protect } from '../middleware/authmiddleware.js'
import { createResume, deleteResume, getResumeById, getuserResume, updateResume } from '../controller/resumecontroller.js'
import { uploadResumeImages } from '../controller/uploadiamge.js';
const resumeRouter=express.Router()
resumeRouter.post('/',protect,createResume);
resumeRouter.get('/',protect,getuserResume)
resumeRouter.get('/:id',protect,getResumeById);
resumeRouter.put('/:id',protect,updateResume);
resumeRouter.put('/:id/upload-images',protect,uploadResumeImages);
resumeRouter.delete('/:id',protect,deleteResume);
export default resumeRouter;