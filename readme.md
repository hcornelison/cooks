# Chowdown

A simple, plaintext recipe database for hackers

The original site:
[http://chowdown.io](http://chowdown.io)

My site from this fork
[https://recipes.pintsizedcrafts.com/](https://recipes.pintsizedcrafts.com/)

# Changes in this fork

- Light and Dark theme switcher (and easy theme replacement in _config.yml)
- Menu bar for navigating the site
- Adjusted dynamic sizing of images and text for better mobile experience
- Components are listed as recipes (personal preference)
- Scale-able recipes (thanks to [PhilipNelson5](https://github.com/PhilipNelson5/chowdown)'s fork), plus components scale with recipe
- Prettier and more compatible printable pages for recipes + components
- Full width component recipes 
- A page with all the recipes/components listed by categories
- A page for cooking tips/tricks
- Extra stylistic changes

# Changing Colors

In _config.yml you can change the following values with your preferred colors:

colors:
primary-text-color:
secondary-text-color:
primary-bg-color:
tile-color:
menu-color:

# Getting Started

This is a Jekyll build. Make sure you have Jekyll [installed](https://jekyllrb.com/). To install, run this command in the terminal (or iTerm, etc):

```gem install bundler jekyll```

or to check if you've got it installed already:

```jekyll -v```

Clone or download this repo. Navigate to the folder in terminal (or iTerm, etc), and then run:

```jekyll serve```

With default settings, you should be able to view the site locally at `http://127.0.0.1:4000/`

# Writing a Recipe

The recipes are stored in the collection "Recipes" (the folder /_recipes).

They are written in Markdown and contain a few special sections:

- The frontmatter, which contains:
 - Title, Image, and Layout (which is "recipe")
 - Ingredients (a list of things in the dish)
 - Directions (a list of steps for the dish)
- Body content (for intros, stories, written detail)

If you need help with Markdown, here's a [handy cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

# Writing a component recipe

A component recipe is a special recipe made up of other recipes. To make a new component recipe:

- place your smaller, single recipes into the /_components folder
- make a new recipe like normal in the /_recipes folders
- in the frontmatter of this new recipe, include your recipes from the /_components folder (instead of the usual Ingredients list)

You can an example on the Red Berry Tart recipe. 

- [example Markdown](https://raw.githubusercontent.com/clarklab/chowdown/gh-pages/_recipes/red-berry-tart.md)
- [example recipe page](http://chowdown.io/recipes/red-berry-tart.html)