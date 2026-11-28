
import { z } from "zod";

// Create Post
export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Post content is required"),
  allowsComments: z.boolean().optional(),
});

// Update Post
export const updatePostSchema = z.object({
  content: z.string().trim().min(1).optional(),
  allowsComments: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  }
);

// Pagination Query
export const postQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

// Post ID Params
export const postIdSchema = z.object({
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID"),
});
