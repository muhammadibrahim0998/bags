import express from "express";
import User from "../models/User.js";
import { validateLogin } from "../validators/authValidator.js";

const router = express.Router();

/**
 * @desc    Get Current User (Verify session via cookie)
 * @route   GET /api/auth/me
 */
router.get("/me", async (req, res) => {
  try {
    // nexflow_sess is the name of our HTTP-only cookie
    const userId = req.cookies.nexflow_sess;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated" 
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user || user.status !== 'active') {
      // Clear invalid cookie if user doesn't exist or is inactive
      res.clearCookie('nexflow_sess', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
      });
      return res.status(401).json({ 
        success: false, 
        message: "Session invalid or account inactive" 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        shopId: user.shopId
      }
    });
  } catch (error) {
    console.error("Auth /me Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Login User & Set Cookie
 * @route   POST /api/auth/login
 */
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user and include password for comparison
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid username or password" 
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: "Account is inactive. Please contact admin." 
      });
    }

    // Update last login timestamp
    user.lastLogged = new Date();
    await user.save();

    // Cookie Options for Cross-Domain (Vercel -> Railway)
    const cookieOptions = {
      httpOnly: true,    // Prevents JS from accessing the cookie
      secure: true,      // Required for sameSite: 'none' (Requires HTTPS)
      sameSite: 'none',  // Mandatory for cross-origin domains
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Days
    };

    // Set persistence cookie
    res.cookie('nexflow_sess', user._id.toString(), cookieOptions);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        shopId: user.shopId
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Logout User
 * @route   POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
  res.clearCookie('nexflow_sess', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
  
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;