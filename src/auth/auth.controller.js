import User from "../users/user.model.js"
import { hash, verify } from "argon2"
import { generarJWT } from "../../helpers/JWT-generate.js"
import { cloudinary } from "../../configs/cloudinary.js"

const defaultProfilePicture = () =>
  process.env.DEFAULT_PROFILE_PICTURE_URL || "profiles/default-avatar.png";

export const register = async (req, res) => {
  try {
    const data = req.body;
    let profilePicture = req.fileRelativePath || defaultProfilePicture();
    const encryptedPassword = await hash(data.password);

    const user = await User.create({
      username: data.username,
      email: data.email,
      name: data.name,
      surname: data.surname,
      password: encryptedPassword,
      profilePicture
    });

    return res.status(200).json({
      message: "User has been added to database",
      userDetails: {
        user: user.username,
        email: user.email,
      },
    });
  } catch (e) {
    if (req.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(req.cloudinaryPublicId);
      } catch (destroyErr) {
        console.error("Cloudinary destroy tras error de registro:", destroyErr);
      }
    }
    console.error(e);
    return res.status(500).json({
      message: "User registration failed",
      error: e.message
    });
  }
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const login = async (req, res) => {
  let { email, password, username } = req.body;

  try {
    const identifier = (username || email || "").trim();
    const isEmail = identifier.includes("@");

    if (!email && isEmail) {
      email = identifier;
      username = null;
    } else if (!username && email) {
      username = null;
    } else if (username) {
      username = identifier;
    }

    const lowerEmail = email ? email.toLowerCase() : null;
    const trimmedUsername = username?.trim() || null;

    const query = [];
    if (lowerEmail) {
      query.push({ email: lowerEmail });
    }
    if (trimmedUsername) {
      query.push({
        username: {
          $regex: new RegExp(`^${escapeRegex(trimmedUsername)}$`, "i"),
        },
      });
    }

    if (!query.length || !password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = await User.findOne({ $or: query });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = await generarJWT(user.id, user.email);

    return res.status(200).json({
      message: "Login successful",
      userDetails: {
        username: user.username,
        token: token,
        profilePicture: user.profilePicture,
        uid: user.id
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server error",
      error: "Please contact the administrator",
    });
  }
};
