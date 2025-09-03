import { z } from 'zod';

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatar: z.string().url().optional()
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  avatar: z.string().url().optional(),
  language: z.enum(['en', 'hi']).optional(),
  tts_enabled: z.boolean().optional()
});

export const badgeSchema = z.object({
  badge_id: z.string().min(1, 'Badge ID is required'),
  badge_name: z.string().min(1, 'Badge name is required'),
  badge_description: z.string().optional(),
  badge_icon: z.string().optional(),
  badge_rarity: z.enum(['common', 'rare', 'epic', 'legendary']).default('common')
});

export const activitySchema = z.object({
  activity_id: z.string().min(1, 'Activity ID is required'),
  tokens_earned: z.number().int().min(0, 'Tokens earned must be non-negative'),
  xp_earned: z.number().int().min(0, 'XP earned must be non-negative')
});

export const perkSchema = z.object({
  perk_id: z.string().min(1, 'Perk ID is required'),
  perk_name: z.string().min(1, 'Perk name is required'),
  cost: z.number().int().min(1, 'Cost must be positive')
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          error: 'Validation failed',
          details: errors
        });
      }
      return res.status(500).json({ error: 'Validation error' });
    }
  };
};
