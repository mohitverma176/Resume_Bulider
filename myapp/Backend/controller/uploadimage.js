import fs from "fs";
import path from "path";
import Resume from "../models/resumemodel.js";
import upload from "../middleware/uploadmiddleware.js";

export const uploadResumeImages = async (req, res) => {
    try {
        upload.fields([
            { name: "thumbnail", maxCount: 1 },
            { name: "profileImage", maxCount: 1 },
        ])(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: "File upload failed",
                    error: err.message,
                });
            }

            try {
                const resumeId = req.params.id;
                const resume = await Resume.findOne({
                    _id: resumeId,
                    userId: req.user._id,
                });

                if (!resume) {
                    // Clean up newly uploaded files if resume is not found
                    if (req.files?.thumbnail?.[0]) {
                        fs.unlinkSync(req.files.thumbnail[0].path);
                    }
                    if (req.files?.profileImage?.[0]) {
                        fs.unlinkSync(req.files.profileImage[0].path);
                    }
                    return res.status(404).json({ message: "Resume not found" });
                }

                const uploadFolder = path.join(process.cwd(), "uploads");
                const baseUrl = `${req.protocol}://${req.get("host")}`;

                const newThumbnail = req.files?.thumbnail?.[0];
                const newProfileImage = req.files?.profileImage?.[0];

                // If a new thumbnail was uploaded
                if (newThumbnail) {
                    if (resume.thumbnailLink) {
                        const oldThumbnailPath = path.join(
                            uploadFolder,
                            path.basename(resume.thumbnailLink)
                        );
                        if (fs.existsSync(oldThumbnailPath)) {
                            fs.unlinkSync(oldThumbnailPath);
                        }
                    }
                    resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
                }

                // If a new profile image was uploaded
                if (newProfileImage) {
                    if (resume.profileInfo?.profilePreviewurl) {
                        const oldProfilePath = path.join(
                            uploadFolder,
                            path.basename(resume.profileInfo.profilePreviewurl)
                        );
                        if (fs.existsSync(oldProfilePath)) {
                            fs.unlinkSync(oldProfilePath);
                        }
                    }
                    if (!resume.profileInfo) {
                        resume.profileInfo = {};
                    }
                    resume.profileInfo.profilePreviewurl = `${baseUrl}/uploads/${newProfileImage.filename}`;
                }

                await resume.save();

                return res.status(200).json({
                    message: "Images uploaded successfully",
                    thumbnailLink: resume.thumbnailLink,
                    profilePreviewurl: resume.profileInfo?.profilePreviewurl,
                    resume,
                });
            } catch (innerError) {
                return res.status(500).json({
                    message: "Server error while processing uploaded images",
                    error: innerError.message,
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
