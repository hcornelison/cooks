import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { getRecipeImage } from '../utils/images';

export const prerender = true;

export const GET: APIRoute = async () => {
  const recipes = await getCollection('recipes');
  const components = await getCollection('components');

  const data = await Promise.all(
    recipes.map(async (recipe) => {
      const ownIngredients = recipe.data.ingredients ?? [];
      const componentIngredients = (recipe.data.components ?? []).flatMap(
        (name) => components.find((c) => c.data.title === name)?.data.ingredients ?? [],
      );
      const optimizedImage = await getImage({
        src: getRecipeImage(recipe.data.image),
        width: 500,
        format: 'webp',
        quality: 75,
      });
      return {
        title: recipe.data.title,
        ingredients: [...ownIngredients, ...componentIngredients].join(', '),
        tags: recipe.data.tags,
        image: optimizedImage.src,
        url: `/recipes/${recipe.id}`,
      };
    }),
  );

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
