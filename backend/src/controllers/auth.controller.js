import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne({
      email: email,
    });

    if (isAlreadyRegistered) {
      logger.info("Email already exists");
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const session = await sessionModel.create({
      user: user._id,
      refreshTokenHash: crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex"),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = jwt.sign(
      {
        id: user._id,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    logger.info("User created successfully");
    res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      token: {
        accessToken,
      },
    });
  } catch (err) {
    logger.error(err.message, "Invalid request");
    return res.status(401).json({
      message: "Invalid request",
      error: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      logger.error("Unauthorized");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      logger.error("User not found");
      return res.status(404).json({
        message: "User not found",
      });
    }

    logger.info("User fetched successfully");
    res.status(200).json({
      message: "user fetched successfully",
      user: {
        id: decoded.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error(err.message, "Invalid request");
    res.status(401).json({
      message: "Invalid request",
      error: err.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      logger.error("Unauthorized");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      logger.error("Invalid refresh token");
      return res.status("401").json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    logger.info("Access token refreshed successfully");
    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (err) {
    logger.error(err.message, "Invalid request");
    res.status(401).json({
      message: "Invalid request",
      error: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      logger.error("Unauthorized");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    
    const session = await sessionModel.findOne({
      refreshTokenHash: crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex"),
      revoked: false,
    });

    if (!session) {
      logger.error("Invalid refresh token");
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");
    logger.info("Logged out successfully");
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    logger.error(err.message, "Invalid request");
    res.status(401).json({
      message: "Invalid request",
      error: err.message,
    });
  }
};

// export const logoutAll = async (req, res) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//       logger.error("Unauthorized");
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }
//     const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

//     const session = await sessionModel.updateMany(
//       {
//         user: decoded.id,
//         revoked: false,
//       },
//       {
//         revoked: true,
//       },
//     );

//     if (session.matchedCount == 0) {
//       logger.info("No active sessions found");
//       return res.status(400).json({
//         message: "No active sessions found",
//       });
//     }

//     res.clearCookie("refreshToken");

//     logger.info("Logged out of all devices successfully");
//     res.status(200).json({
//       message: "Logged out of all devices successfully",
//     });
//   } catch (err) {
//     logger.error(err.message, "Invalid request");
//     res.status(401).json({
//       message: "Invalid request",
//       error: err.message,
//     });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email: email,
    });

    if (!user) {
      logger.error("Invalid credentials");
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.error("Invalid credentials");
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const session = await sessionModel.create({
      user: user._id,
      refreshTokenHash: crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex"),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = jwt.sign(
      {
        id: user._id,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    logger.info("Logged in successfully");
    res.status(200).json({
      message: "Logged in successfully",
      username: user.username,
      accessToken,
    });
  } catch (err) {
    logger.error(err.message, "Invalid request");
    res.status(401).json({
      message: "Invalid request",
      error: err.message,
    });
  }
};
