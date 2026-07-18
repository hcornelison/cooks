// Thank you to https://github.com/PhilipNelson5 for the awesome script!
'use strict';

export function toNumber(inString) {
  let result;
  if (inString.includes('/')) {
    let z = inString.split('/');
    result = z[0] / z[1];
  } else {
    result = +inString;
  }
  return result;
}

export function quantityToNumber(inString) {
  let valueArray = inString.split(/\s/g);
  valueArray = valueArray.map((item) => toNumber(item));
  let theTotal = valueArray.reduce((a, b) => a + b);
  return theTotal;
}

export function numberToPretty(inNum) {
  let wholeNumber;
  if (inNum < 1) {
    wholeNumber = '';
  } else {
    wholeNumber = Math.trunc(inNum).toString();
  }
  let fraction = inNum % 1;
  let fracRep;
  if (Math.abs(fraction) < 0.00001) {
    fracRep = '';
  } else if (Math.abs(fraction - 1 / 2) < 0.00001) {
    fracRep = ' &frac12;';
  } else if (Math.abs(fraction - 1 / 4) < 0.00001) {
    fracRep = ' &frac14;';
  } else if (Math.abs(fraction - 3 / 4) < 0.00001) {
    fracRep = ' &frac34;';
  } else if (Math.abs(fraction - 1 / 3) < 0.00001) {
    fracRep = ' &frac13;';
  } else if (Math.abs(fraction - 2 / 3) < 0.00001) {
    fracRep = ' &frac23;';
  } else if (Math.abs(fraction - 1 / 8) < 0.00001) {
    fracRep = ' &frac18;';
  } else if (Math.abs(fraction - 3 / 8) < 0.00001) {
    fracRep = ' &frac38;';
  } else if (Math.abs(fraction - 5 / 8) < 0.00001) {
    fracRep = ' &frac58;';
  } else if (Math.abs(fraction - 7 / 8) < 0.00001) {
    fracRep = ' &frac78;';
  } else if (Math.abs(fraction - 1 / 6) < 0.00001) {
    fracRep = ' &frac16;';
  } else if (Math.abs(fraction - 5 / 6) < 0.00001) {
    fracRep = ' &frac56;';
  } else {
    fracRep = fraction.toString();
  }
  return wholeNumber + fracRep;
}

export function extractQuantity(ingredient) {
  let reMatch = ingredient.match(/^\d[/\d\s.]*\s/i);
  return reMatch === null ? '' : reMatch[0];
}

export function scaleIngredient(bareIngredient, quantity, scale = 1) {
  if (quantity === '') {
    return bareIngredient;
  }
  let newQuantity = numberToPretty(scale * quantityToNumber(quantity));
  return newQuantity + ' ' + bareIngredient;
}

function preprocessIngredients() {
  let ingredients = document.querySelectorAll('li[data-ingredient-text]');
  let quantityArray = [];
  let ingredientBaseArray = [];
  for (let i = 0; i < ingredients.length; i++) {
    let text = ingredients[i].dataset.ingredientText;
    let quantity = extractQuantity(text);
    quantityArray.push(quantity);
    ingredientBaseArray.push(text.substring(quantity.length));
  }
  ingredients.forEach((el, i) => {
    el.dataset.quantity = quantityArray[i];
    el.dataset.base = ingredientBaseArray[i];
  });
}

function scaleRecipe(scale = 1) {
  let ingredients = document.querySelectorAll('li[data-ingredient-text]');
  ingredients.forEach((el) => {
    let span = el.querySelector('.ingredient-label');
    span.innerHTML = scaleIngredient(el.dataset.base, el.dataset.quantity, scale);
  });
}

// Guarded so the pure functions above can be imported and unit tested
// outside a browser (e.g. Node/Vitest), where `document` doesn't exist.
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('li[data-ingredient-text]')) {
      preprocessIngredients();
      scaleRecipe(1);
    }
    const select = document.querySelector('.select-scale select');
    if (select) {
      select.addEventListener('change', (event) => {
        scaleRecipe(event.target.value);
      });
    }
  });
}
