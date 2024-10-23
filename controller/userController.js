
const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//@desc Register a new user
//@route GET /api/users/register
//@access public

const registerUser = asyncHandler(async(req,res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable)
    {
        res.status(400);
        throw new Error("User already registered");
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("The hashed password is", hashedPassword);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
    console.log("User created ${user}");
    if(user)
    {
        res.status(201).json({
            _id: user._id,
            email: user.email
        })
    }
    else
    {
        res.status(400);
        throw new Error("User data not valid");
    }
    res.json(
        {
            message: "Register user"
        }
    )
});

//@desc login new user
//@route GET /api/users/login
//@access public


const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password)))
    {
        const accessToken = jwt.sign({
            user:
            {
                name: user.name,
                email: user.email,
                id: user._id
            },
        },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: "15m"
    })
    res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

//@desc current info a user
//@route GET /api/users/current
//@access private

const currentUser = asyncHandler(async(req,res) => {
    res.json(req.user);
});

module.exports = {registerUser, loginUser, currentUser};