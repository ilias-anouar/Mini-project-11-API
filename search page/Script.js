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
  button.setAttribute("data-bs-toggle", "modal");
  button.setAttribute("data-bs-target", "#modal");
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
  let ul, li;
  let mesur = [];
  let ingre = [];
  for (let i = 1; i <= 20; i++) {
    if (json[`strMeasure${i}`] != "") {
      mesur.push(json[`strMeasure${i}`]);
    } else {
      break;
    }
  }

  for (let i = 1; i <= 20; i++) {
    if (json[`strIngredient${i}`] != "") {
      ingre.push(json[`strIngredient${i}`]);
    } else {
      break;
    }
  }
  ul = document.createElement("ul");
  ul.setAttribute("class", "d-flex flex-wrap gap-3 list-group-numbered");
  for (let i = 0; i < ingre.length; i++) {
    li = document.createElement("li");
    li.setAttribute("class", "list-group-item");
    li.innerHTML = `${ingre[i]} : ${mesur[i]}`;
    ul.appendChild(li);
  }
  return ul;
}

// to add content to modal elements

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
  ingre.innerHTML = "";
  ingre.appendChild(IngMes(json));
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

/**
 * to search :
 * * input value => by click event
 * * add function to slice array of values => after API fetch()
 * * creat cards for each page
 */

// Number of items to display per page
const itemsPerPage = 6;

// Get the total number of pages
function pagenum(items) {
  const numPages = Math.ceil(items.length / itemsPerPage);
  return numPages;
}

// Split the items into pages
function pages(items) {
  const pages = [];
  for (let i = 0; i < pagenum(items); i++) {
    pages.push(items.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
  }
  return pages;
}

// Create the buttons or links for each page
function button(items) {
  let nav = document.getElementById("pagin-num");
  nav.innerHTML = "";
  for (let i = 0; i < pagenum(items); i++) {
    const li = document.createElement("li");
    li.setAttribute("class", "page-item");
    const a = document.createElement("a");
    a.setAttribute("class", "page-link");
    a.innerHTML = i + 1;
    li.appendChild(a);
    a.addEventListener("click", () => {
      let activremov = document.querySelectorAll("li");
      activremov.forEach((e) => {
        e.classList.remove("active");
      });
      li.setAttribute("class", "active");
      // Display the appropriate page when the button is clicked
      displayPage(i, items);
    });
    nav.appendChild(li);
  }
}

function displayPage(pageNum, items) {
  // Clear the current page
  const pageContainer = document.getElementById("recipes-group");
  pageContainer.innerHTML = "";

  // Display the items for the current page
  const page = pages(items)[pageNum];
  for (const item of page) {
    creatcard(item);
  }
}

let alertholder = document.getElementById("alert");

buttonsearch.addEventListener("click", function () {
  recipesgroup.innerHTML = "";

  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputsearch.value}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => search(json.meals));
});

function search(json) {
  alertholder.innerHTML = ""
  if (json == null) {
    alertholder.innerHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
	  <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
	  <div>
	    NO RESULTS
	  </div>
	</div>`;
  } else {
    pages(json);
    button(json);
    displayPage(0, json);
  }
}
