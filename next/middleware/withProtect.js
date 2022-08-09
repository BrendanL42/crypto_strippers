import jwt from "jsonwebtoken";
import Model from "../models/model";
import Client from "../models/client";


const withProtect = (handler) => {
  return async (req, res) => {
    // Get token and check if it exists
    let token;

    if (req.cookies.token && req.cookies.model) {
      token = req.cookies.token;
    }

    if (req.cookies.token && req.cookies.client) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to get access.",
      });
    }

    try {
      // Verify token
      let decoded = await jwt.verify(
        token,
        process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET
      );

      // Check if user exists with refresh token
      let currentUser = await Client.findById(decoded._id);
     
      if (!currentUser) {
    
         currentUser = await Model.findById(decoded._id)

      }


      if(!currentUser) {
        return res.status(401).json({
          success: false,
          message: "No user found.",
        });
      }

      const user = {
        role: currentUser.role,
        _id: currentUser._id,
        fName: currentUser.fName,
        lName: currentUser.lName,
      };

      // Grant access to protected route
      req.user = user;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Please log in to get access 1.",
      });
    }
  };
};

export default withProtect;
