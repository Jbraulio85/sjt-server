import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
  cloudinary,
  CLOUDINARY_ROOT_FOLDER,
  isCloudinaryConfigured,
} from '../configs/cloudinary.js';

const IMAGE_MIMETYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10_000_000;

export const profilePictureMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (IMAGE_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else {
      cb(
        new Error(`Only ${IMAGE_MIMETYPES.join(' ')} mimetypes are allowed`),
      );
    }
  },
});

export const uploadProfilePictureToCloudinary = async (req, res, next) => {
  if (!req.file) return next();

  if (!isCloudinaryConfigured()) {
    return next(
      new Error(
        'Cloudinary no está configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.',
      ),
    );
  }

  try {
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_ROOT_FOLDER,
      resource_type: 'image',
      public_id: `profiles/${uuidv4()}`,
      overwrite: false,
    });
    req.fileRelativePath = result.secure_url;
    req.cloudinaryPublicId = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
};
