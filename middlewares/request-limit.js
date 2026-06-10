import rateLimit from "express-rate-limit";

const windowMs = 15 * 60 * 1000;
const max = 60;

export const publicLimiter = rateLimit({
  windowMs,
  max,
  message: `Demasiados intentos. Intenta más tarde.`,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authtenticatedLimiter = rateLimit({
  windowMs,
  max,
  message: `Demasiados intentos. Intenta más tarde.`,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `uid:${req.uid}`
})