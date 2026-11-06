import Resume from "../models/resumemodel.js";
import fs from "fs"
import path from "path"

export const createResume=async(req,res)=>{
    try {
        const {title}=req.body;
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };
        const newResume=await Resume.create({
            userId:req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        })
        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({message:"failed to create resume",error:error.message})
    }
}

export const getuserResume=async(req,res)=>{
    try {
        const resumes=await Resume.find({userId:req.user._id}).sort({updatedAt:-1});
        res.json(resumes)
    } catch (error) {
        res.status(500).json({message:"failed to get resumes",error:error.message})
    }
}
export const getResumeById=async(req,res)=>{
    try {
        const resume=await Resume.findOne({_id:req.params.id,userId:req.user._id})
        if(!resume){
            return res.status(404).json({message:"resume not found"})
        }
        res.json(resume);
    } catch (error) {
          res.status(500).json({message:"failed to get resumes",error:error.message})        
    }
}
export const updateResume=async(req,res)=>{
    try {
        const resume =await Resume.findOne({
            _id:req.params.id,
            userId:req.user._id
        })
        if(!resume){
            return res.status(404).json({message:"Resume not found or not authorized"})
        }
        Object.assign(resume,req.body)//merger the upadte resume
        const savedResume=await resume.save();//save the update resume 
        res.json(savedResume);
    } catch (error) {
          res.status(500).json({message:"failed to upadte resumes",error:error.message})
    }
}
export const deleteResume=async(req,res)=>{
    try {
        const resume=await Resume.findOne({
            _id:req.params.id,
            userId:req.user._id
        })
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const uploadfolder = path.join(process.cwd(), "uploads");
        if (resume.thumbnailLink) {
            const oldThumbnailLink = path.join(uploadfolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnailLink)) {
                fs.unlinkSync(oldThumbnailLink);
            }
        }
        if (resume.profileInfo?.profilePreviewurl) {
            const oldProfile = path.join(
                uploadfolder,
                path.basename(resume.profileInfo.profilePreviewurl)
            );
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }
        await Resume.findByIdAndDelete(resume._id);
        res.json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete resume", error: error.message });
    }
};