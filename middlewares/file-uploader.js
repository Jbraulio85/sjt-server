import multer from "multer";
import { dirname, extname, join, basename } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const IMAGE_MIMETYPES = ["image/jpeg", "image/png"];
const VIDEO_MIMETYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_FILE_SIZE = 10000000;

const createMulterConfig = (destinationPath, allowedMimetypes) => {
  return multer({
    storage: multer.diskStorage({
      destination: join(CURRENT_DIR, destinationPath),
      filename: (req, file, cb) => {
        const fileExtension = extname(file.originalname);
        const fileName = file.originalname.split(fileExtension)[0];
        // Generar UUID corto (primeros 8 caracteres)
        const shortUuid = uuidv4().substring(0, 8);
        const generatedName = `${fileName}-${shortUuid}${fileExtension}`;

        cb(null, generatedName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (allowedMimetypes.includes(file.mimetype)) cb(null, true);
      else
        cb(
          new Error(`Only ${allowedMimetypes.join(" ")} mimetypes are allowed`),
        );
    },
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });
};

const uploadWithTimeout = (uploader) => {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      const err = new Error("Request timeout: Upload took too long (>30s)");
      err.statusCode = 408;
      next(err);
    }, 30000);

    uploader(req, res, (err) => {
      clearTimeout(timeout);
      next(err);
    });
  };
};

export const uploadProfileImage = createMulterConfig(
  "../assets/img/profiles",
  IMAGE_MIMETYPES,
);
export const uploadPostVideo = uploadWithTimeout(
  createMulterConfig("../assets/video/posts", VIDEO_MIMETYPES),
);
