import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const recipes = await getCollection('recipes');
  const components = await getCollection('components');

  const data = recipes.map((recipe) => {
    const ownIngredients = recipe.data.ingredients ?? [];
    const componentIngredients = (recipe.data.components ?? []).flatMap(
      (name) => components.find((c) => c.data.title === name)?.data.ingredients ?? [],
    );
    return {
      title: recipe.data.title,
      ingredients: [...ownIngredients, ...componentIngredients].join(', '),
      tags: recipe.data.tags,
      image: `/images/${recipe.data.image}`,
      url: `/recipes/${recipe.id}`,
    };
  });
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
