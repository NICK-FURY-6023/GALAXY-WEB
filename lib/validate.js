/**
 * Validation utilities for VEYNOVA Music Player
 */

import { z } from 'zod';
import { ValidationError } from './errors.js';

// Common validation schemas
export const schemas = {
  // Source validation
  source: z.enum(['youtube', 'ytmusic', 'soundcloud', 'spotify', 'deezer', 'radio']),
  
  // Track validation
  track: z.object({
    source: z.string().min(1),
    sid: z.string().min(1),
    title: z.string().min(1).max(200),
    artist: z.string().min(1).max(200),
    album: z.string().max(200).optional(),
    thumbnailUrl: z.string().url().optional(),
    duration: z.number().positive().optional(),
    url: z.string().url().optional(),
    streamUrl: z.string().url().optional(),
    explicit: z.boolean().optional(),
  }),

  // User validation
  userProfile: z.object({
    username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_-]+$/),
    displayName: z.string().min(1).max(100),
    bio: z.string().max(500).optional(),
  }),

  // Playlist validation
  playlist: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    isPublic: z.boolean().default(false),
  }),

  // Queue actions
  queueAction: z.object({
    action: z.enum(['add', 'remove', 'clear', 'setIndex', 'reorder']),
    track: z.object({
      source: z.string(),
      sid: z.string(),
    }).optional(),
    trackId: z.string().optional(),
    index: z.number().optional(),
    fromIndex: z.number().optional(),
    toIndex: z.number().optional(),
  }),

  // Settings validation
  userSettings: z.object({
    volume: z.number().min(0).max(1).optional(),
    autoplay: z.boolean().optional(),
    theme: z.enum(['dark', 'light']).optional(),
    keepHistory: z.boolean().optional(),
    showGlobalPlayerOutsideMusic: z.boolean().optional(),
  }),
};

/**
 * Validate request body against schema
 * @param {any} data - Data to validate
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @throws {ValidationError} If validation fails
 * @returns {any} Validated data
 */
export function validateBody(data, schema) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ValidationError(
        `${firstError.path.join('.')}: ${firstError.message}`,
        firstError.path.join('.')
      );
    }
    throw error;
  }
}

/**
 * Validate query parameters
 * @param {Object} query - Query parameters object
 * @param {Object} rules - Validation rules
 * @returns {Object} Validated query parameters
 */
export function validateQuery(query, rules) {
  const validated = {};
  
  for (const [key, rule] of Object.entries(rules)) {
    const value = query[key];
    
    if (rule.required && !value) {
      throw new ValidationError(`${key} is required`, key);
    }
    
    if (value) {
      if (rule.type === 'number') {
        const num = parseInt(value, 10);
        if (isNaN(num)) {
          throw new ValidationError(`${key} must be a number`, key);
        }
        if (rule.min && num < rule.min) {
          throw new ValidationError(`${key} must be at least ${rule.min}`, key);
        }
        if (rule.max && num > rule.max) {
          throw new ValidationError(`${key} must be at most ${rule.max}`, key);
        }
        validated[key] = num;
      } else if (rule.type === 'boolean') {
        validated[key] = value === 'true';
      } else if (rule.type === 'enum') {
        if (!rule.values.includes(value)) {
          throw new ValidationError(`${key} must be one of: ${rule.values.join(', ')}`, key);
        }
        validated[key] = value;
      } else {
        validated[key] = value;
      }
    }
  }
  
  return validated;
}