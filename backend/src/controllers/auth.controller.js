const userModel=require('../models/auth.model');
const uploadFile=require('../services/image.services');
const deleteFile=require('../services/deleteFile')
const JWT=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

async function signup(req,res){
    
    const {name, email, password}=req.body;

    const ifUserAlreadyExist= await userModel.findOne({
        email
    })

    if(ifUserAlreadyExist){
        return res.status(409).json({
            message:'user already exists'
        })
    }
    const hash=await bcrypt.hash(password,10);
    
    const user= await userModel.create({
        name,
        email,
        password:hash,
    })
    const token=JWT.sign({
        id: user._id,
        email:email,
    },process.env.JWT_SECRET);

    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
});

    res.status(201).json({
        message:'user created sucessfully',
        user:{
            id:user._id,
            name:name,
            email:email,
            
        }
            
    })
}


async function login(req,res){
    const {email,password}=req.body;

    const user=await userModel.findOne({
        email,
    })
    if(!user){
        return res.status(409).json({
            message:'invalid credential'
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message:'invalid password'
        })
    }
    const token=JWT.sign({
        email:email
    },process.env.JWT_SECRET);

    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
});

    res.status(200).json({
        message:'user login successfully',
        user:{
            email:user.email,     
        }
    })
}


async function getMe(req, res) {
    const user = await userModel.findOne({
        email: req.user.email,
        
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture:user.profilePicture,
        },
    });
}


async function logoutUser(req,res){
    res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
});

    res.status(200).json({
        message:'User logout successfully'
    })
}

async function profile(req, res) {
    if (!req.file) {
        return res.status(400).json({
            message: "Please upload a profile picture",
        });
    }

    try {
        const { url, fileId } = await uploadFile(req.file);

        const user = await userModel.findOneAndUpdate(
            { email: req.user.email },
            {
                profilePicture: url,
                profilePictureId: fileId,
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to upload profile picture",
        });
    }
}

async function removeProfile(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!user.profilePictureId) {
            return res.status(400).json({
                message: "No profile picture found",
            });
        }

        await deleteFile(user.profilePictureId);

        user.profilePicture = "";
        user.profilePictureId = "";

        await user.save();

        res.status(200).json({
            message: "Profile picture removed successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to remove profile picture",
        });
    }
}

module.exports = {
    signup,
    login,
    getMe,
    logoutUser,
    profile,
    removeProfile,
};

