/**
 * Globle variables :
 * * inputsearch => the input of search bar.
 * * buttonsearch => button of serach bar .
 * * recipesgroup => div of group cart to show recipes in .
 */

let inputsearch, buttonsearch, recipesgroup;
inputsearch = document.getElementById("inputserach");
buttonsearch = document.getElementById("buttonsearch");
recipesgroup = document.getElementById("recipes-group");

/**
 * to creat card :
 * * creat a div => to group elements.
 * * creat an image html elemet => to show recipe image.
 * * creat div => to group information of recipe :
 * * * h5, p, button.
 */

function creatcard(obj) {
  // html elements to creat recipe card
  let divcol, divcard, image, divinfo, h5, p, button;
  // creating elements
  divcol = document.createElement("div");
  divcard = document.createElement("div");
  image = document.createElement("img");
  divinfo = document.createElement("div");
  h5 = document.createElement("h5");
  p = document.createElement("p");
  button = document.createElement("button");
  // set the attributs for each element => bootstrap class, and type
  divcol.setAttribute("class", "col");
  divcard.setAttribute("class", "card");
  image.setAttribute("class", "card-img-top");
  image.alt = "recipe image";
  divinfo.setAttribute("class", "card-body");
  h5.setAttribute("class", "card-title");
  p.setAttribute("class", "card-text");
  button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-lg btn-outline-warning");
    button.setAttribute("data-bs-toggle", "modal")
    button.setAttribute('data-bs-target', "#modal" )
  button.setAttribute("onclick", "modale(this)");
  button.innerText = "Details";
  // set the content of each elements
  image.src = obj["strMealThumb"];
  h5.innerHTML = obj["strMeal"];
  p.innerHTML = `${obj["strCategory"]}, ${obj["strArea"]}`;
  // append the child elements
  divinfo.append(h5);
  divinfo.append(p);
  divinfo.append(button);
  divcard.append(image);
  divcard.append(divinfo);
  divcol.append(divcard);
  // append the card in recipes
  recipesgroup.append(divcol);
}

/**
 * to show 6 random recipes in :
 * * loop in
 * * fetch() => the data from API
 * * creat for each object card
 */

window.addEventListener("DOMContentLoaded", function () {
  for (let i = 0; i < 6; i++) {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => creatcard(json.meals[0]))
      .catch((err) => console.error(`Fetch problem: ${err.message}`));
  }
});

/**
 * to show Details modale :
 * * use function to fill the modal with fetsh API => search by name
 */

// function to creat ingre & mesu

function IngMes(json) {
  let result;
  for (let i = 0; i < json.length; i++) {
    if (json[`strIngredient${i}`] == "") {
      return false;
    } else {
      result += `strIngredient${i}`;
    }
  }
  return result;
}

function fillmodal(json) {
  // variables to use => html elements to fill
  let image, title, CatReg, ingre, prepa, video;
  // html elements
  image = document.getElementById("img-modal");
  title = document.getElementById("rec-title");
  CatReg = document.getElementById("rec-cat-reg");
  ingre = document.getElementById("rec-ing");
  prepa = document.getElementById("rec-pre");
  video = document.getElementById("video");
  // inner value
  image.src = json["strMealThumb"];
  title.innerHTML = json["strMeal"];
  CatReg.innerHTML = `${json["strCategory"]}, ${json["strArea"]}`;
    ingre.innerHTML = IngMes(json);
    prepa.innerHTML = json["strInstructions"];
    video.href = json["strYoutube"];
}

function modale(that) {
  let div = that.closest("div");
  let name = div.querySelector("h5");
  let value = name.innerHTML;
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => fillmodal(json.meals[0]));
}
