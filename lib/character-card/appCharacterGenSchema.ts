import { z } from "zod";

export const CharacterGenPovSchema = z.enum(["first", "second", "third"]);

export const CharacterGenSchema = z.object({
  creator_notes: z.string().default(""),
  description: z.string().trim().min(1),
  first_mes: z.string().trim().min(1),
  image_prompt: z.string().trim().min(1),
  mes_example: z.string().trim().min(1),
  name: z.string().trim().min(1),
  negative_prompt: z.string().optional().default(""),
  personality: z.string().trim().min(1),
  pov: CharacterGenPovSchema.default("third"),
  scenario: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type CharacterGen = z.infer<typeof CharacterGenSchema>;
