import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const recipes = (await getCollection('recipes')).sort((a, b) => a.data.title.localeCompare(b.data.title));

  return rss({
    title: 'Recipes',
    description: 'A personal collection of recipes.',
    site: context.site!,
    items: recipes.map((recipe) => ({
      title: recipe.data.title,
      link: `/recipes/${recipe.id}`,
      categories: recipe.data.tags.split(',').map((t) => t.trim()),
    })),
  });
};
