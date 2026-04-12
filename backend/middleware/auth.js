import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const userId = req.cookies.nexflow_sess;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user || user.status !== 'active') {
      res.clearCookie('nexflow_sess');
      return res.status(401).json({ message: "Session invalid or account inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Access Denied. Super Admin only." });
  }
  next();
};

export const requireShopAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'shop_admin') {
    return res.status(403).json({ message: "Access Denied. Shop Admin only." });
  }
  next();
};

export const preventSuperAdmin = (req, res, next) => {
  if (req.user.role === 'super_admin') {
    return res.status(403).json({ message: "Privacy Shield: Super Admins cannot access shop operational data." });
  }
  next();
};
