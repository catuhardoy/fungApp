const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

//Update user
router.put("/:id", async(req, res) => {
    if(req.body.userId ===  req.params.id || req.body.isAdmin){
        
        if(req.body.password){   // aca updateamos la password
            try {
                 const salt = await bcrypt.genSalt(10);
                 req.body.password = await bcrypt.hash(req.body.password, salt)
            }catch(err){
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("you can update only your account")
    }
})


//delete user

router.delete("/:id", async(req, res) => {
    if(req.body.userId ===  req.params.id || req.body.isAdmin){
            
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("you can delete only your account")
    }
});

//get user

router.get("/:id", async( req, res) => {

        try {
            const user = await User.findById(req.params.id);

            const { password, updatedAt, ...other } = user._doc

            res.status(200).json(other);
        }catch(err){
            return res.status(500).json(err)
        }
});

//follow user

router.put("/:id/follow", async (req, res) => {

    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId); // si el current user no sigue a quien quiere seguir

            if(!user.followers.includes(req.body.userId )){
                await user.updateOne({$push:{followers: req.body.userId}}); // le agregamos el id de su nuevo follower
                await currentUser.updateOne({$push:{followings: req.params.id}})  // le agregamos el id de la nueva persona a la que sigue

                res.status(200).json("user has been followed")

            }else{
                response.status(403).json("you already follow this person")
            }

        }catch(err){
            response.status(500).json(err)
        }
    }else{
        res.status(403).json("you can't follow yourself")
    }
});

//un follow user

router.put("/:id/unfollow", async (req, res) => {

    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId); // si el current user no sigue a quien quiere seguir

            if(user.followers.includes(req.body.userId )){
                await user.updateOne({$pull:{followers: req.body.userId}}); // le agregamos el id de su nuevo follower
                await currentUser.updateOne({$pull:{followings: req.params.id}})  // le agregamos el id de la nueva persona a la que sigue

                res.status(200).json("user has been unfollowed")

            }else{
                response.status(403).json("you don't follow this person")
            }

        }catch(err){
            response.status(500).json(err)
        }
    }else{
        res.status(403).json("you can't follow yourself")
    }
});


module.exports = router