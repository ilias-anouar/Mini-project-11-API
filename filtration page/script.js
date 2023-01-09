/**
 * Globle variables :
 * * Category => the select of filtration section.
 * * Area => the select of filtration section.
 * * showresult => section of group cart to show recipes in .
 */

let Category, Area, showresult;

Area = document.getElementById("area");
Category = document.getElementById("category");
showresult = document.getElementById("showresult");

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
  showresult.append(divcol);
}

/**
 * to show lamb and morocco recipes in :
 * * fetch() => the data from API
 * * creat for each object card
 */

window.addEventListener("DOMContentLoaded", async function () {
  let lambid = [];
  let moroccoid = [];
  const lamb = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=Lamb`
  );
  const resultlamb = await lamb.json();
  resultlamb.meals.forEach((element) => {
    lambid.push(element.idMeal);
  });
  const morocco = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=Moroccan`
  );
  const resultmor = await morocco.json();
  resultmor.meals.forEach((element) => {
    moroccoid.push(element.idMeal);
  });
  let match = lambid.filter(function (e) {
    return moroccoid.indexOf(e) > -1;
  });
  let result = [];
  for (let i = 0; i < match.length; i++) {
    const idfitch = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${match[i]}`
    );
    const response = await idfitch.json();
    result.push(response.meals[0]);
  }
  pages(result);
  button(result);
  displayPage(0, result);
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
 * to filter :
 * * selects value => by keyup event
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
  const pageContainer = document.getElementById("showresult");
  pageContainer.innerHTML = "";

  // Display the items for the current page
  const page = pages(items)[pageNum];
  for (const item of page) {
    creatcard(item);
  }
}

let buttonfilter = document.getElementById("filter");

buttonfilter.addEventListener("click", async function () {
  let alert = document.getElementById("alert");
  showresult.innerHTML = "";
  alert.innerHTML = "";
  if (Category.value == "allCategory" && Area.value == "allArea") {
    all();
  } else if (Category.value == "allCategory" && Area.value != "allArea") {
    allcat()
  } else {
    let catid = [];
    let areaid = [];
    const response1 = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${Category.value}`
    );
    const category = await response1.json();
    category.meals.forEach((element) => {
      catid.push(element.idMeal);
    });
    const response2 = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area.value}`
    );
    const area = await response2.json();
    area.meals.forEach((element) => {
      areaid.push(element.idMeal);
    });
    let match = areaid.filter(function (e) {
      return catid.indexOf(e) > -1;
    });
    let result = [];
    for (let i = 0; i < match.length; i++) {
      const idfitch = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${match[i]}`
      );
      const response = await idfitch.json();
      result.push(response.meals[0]);
    }
    if (result.length >= 1) {
      pages(result);
      button(result);
      displayPage(0, result);
    } else {
      alert.innerHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
	  <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
	  <div>
	    NO RESULTS
	  </div>
	</div>`;
    }
  }
});

/**
 * for all category :
 * * function to get and filter category.
 */

async function all() {
  let allcatresult = [];
  const allcat = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
  );
  const allrespons = await allcat.json();
  console.log(allrespons);
  allrespons.meals.forEach((response) =>
    allcatresult.push(response.strCategory)
  );
  console.log(allcatresult);
  let allarearesult = [];
  const allArea = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  const allarearesponse = await allArea.json();
  allarearesponse.meals.forEach((response) =>
    allarearesult.push(response.strArea)
  );
  console.log(allarearesult);
  // fetch in all category
  let allcatid = [];
  for (let i = 0; i < allcatresult.length; i++) {
    let allcategory = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${allcatresult[i]}`
    );
    let result = await allcategory.json();
    result.meals.forEach((meal) => allcatid.push(meal.idMeal));
  }
  let allAreaid = [];
  for (let j = 0; j < allarearesult.length; j++) {
    let allArea = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${allarearesult[j]}`
    );
    let result = await allArea.json();
    result.meals.forEach((meal) => allAreaid.push(meal.idMeal));
  }
  let match = allAreaid.filter(function (e) {
    return allcatid.indexOf(e) > -1;
  });
  let result = [];
  for (let i = 0; i < match.length; i++) {
    const idfitch = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${match[i]}`
    );
    const response = await idfitch.json();
    result.push(response.meals[0]);
  }
  pages(result);
  button(result);
  displayPage(0, result);
}

async function allcat() {
  let allcatresult = [];
  const allcat = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
  );
  const allrespons = await allcat.json();
  console.log(allrespons);
  allrespons.meals.forEach((response) =>
    allcatresult.push(response.strCategory)
  );
  // fetch in all category
  let allcatid = [];
  for (let i = 0; i < allcatresult.length; i++) {
    let allcategory = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${allcatresult[i]}`
    );
    let result = await allcategory.json();
    result.meals.forEach((meal) => allcatid.push(meal.idMeal));
  }
  let areaid = [];
  const areafetch = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area.value}`
  );
  const area = await response2.json();
  area.meals.forEach((element) => {
    areaid.push(element.idMeal);
  });
  let match = areaid.filter(function (e) {
    return allcatid.indexOf(e) > -1;
  });
  let result = [];
  for (let i = 0; i < match.length; i++) {
    const idfitch = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${match[i]}`
    );
    const response = await idfitch.json();
    result.push(response.meals[0]);
  }
  pages(result);
  button(result);
  displayPage(0, result);
}
