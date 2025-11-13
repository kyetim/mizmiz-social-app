import { Request } from 'express'
import { JwtPayload } from '../interfaces/auth.interface'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

