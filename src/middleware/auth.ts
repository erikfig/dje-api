import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'default_secret';

export const authenticateJWT = expressjwt({
  secret,
  algorithms: ['HS256'],
});

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};
