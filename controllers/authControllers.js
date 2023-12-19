import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helper/authHelper.js";
import JWT  from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // validations
    if (!name) {
      return res.send({ message: "Name is required !" });
    }
    if (!email) {
      return res.send({ message: "Email is Required !" });
    }
    if (!password) {
      return res.send({ message: "Password is required !" });
    }
    if (!phone) {
      return res.send({ message: "Phone is Required !" });
    }
    if (!address) {
      return res.send({ message: "Address is Required !" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required !" });
    }
    // Existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists, please login",
      });
    }

    // regsiter user
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer
    }).save();
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// Login Api

export const loginController = async(req, res) => {
  try {

    const {email, password} = req.body
    // validation 
    if(!email || !password) {
      return res.status(404).send({
        success : false,
        message : "Invalid email or password"

      })
    }
    
    // check user
    const user = await userModel.findOne({email});
    if(!user) {
      return res.status(404).send({
        success:false,
        message : "User is not regsitered",
      })
    }

    const match = await comparePassword(password, user.password)
    if(!match) {
      return res.status(200).send({
        success:false,
        message : "Invalid password"
      })
    }

    // Token
    const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.status(200).send({
      success:true,
      message : "Login successfull",
      user : {
        name : user.name,
        email : user.email
      },
      token
    });
    
  } catch (error) {
     console.log(error)
     res.status(500).send({
      success : false,
      message : "There is an error at login, please try again",
      error
     })
  }
}

// forgetPasswordController
export const forgotPasswordController = async(req,res) => {
  try {
    const {email, newPassword, answer} = req.body;
    if(!email) {
      res.status(400).send({
        message : "Email is required"
      })
    }
    if(!answer) {
      res.status(400).send({
        message: "Answer is required"
      })
    }
    if(!newPassword) {
      res.status(400).send({
        message : "New Password is required"
      })
    }
    // 
    const user = await userModel.findOne({email, answer})
    // validation
    if(!user) {
      res.status(404).send({
        success: false,
        message : "Wrong Email or Password",
        error
      })
    }

    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id, {password : hashed});
    res.status(200).send({
      success:true,
      message : "Password reset Successfully",
    })
  } catch (error) {
     console.log(error);
    res.status(500).send({
      success: false,
      message : "Something went wrong ",
      error,
    })
  }
}

// test api 
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};