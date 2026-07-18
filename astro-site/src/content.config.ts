import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    tags: z.string(),
    category: z.string(),
    yield: z.union([z.string(), z.number()]).optional(),
    preptime: z.string().optional(),
    cooktime: z.string().optional(),
    ingredients: z.array(z.string()).optional(),
    directions: z.array(z.string()).optional(),
    notes: z.array(z.string()).optional(),
    components: z.array(z.string()).optional(),
  }),
});

const components = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/components' }),
  schema: z.object({
    title: z.string(),
    ingredients: z.array(z.string()),
    directions: z.array(z.string()),
  }),
});

export const collections = { recipes, components };
