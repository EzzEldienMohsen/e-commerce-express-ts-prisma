import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
export const validate =
  (schema: z.ZodSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      schema.parse(req.body);
      // If validation passes, proceed to the next middleware.
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
        return;
      }
      res.status(400).json({ success: false, error: 'Validation failed' });
      return;
    }
  };
