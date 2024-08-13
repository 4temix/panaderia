const $imgContainer = document.querySelector(".slider_img");
const $text = document.querySelector(".slider_content h2");
const $etiqueta = document.querySelector(".slider_content h3");
const $section = document.querySelector(".slider_container");
const $lements = document.querySelectorAll("section[data-spy]");
const $cardsContainer = document.querySelector(".card_interna_container");
const $linksNav = document.querySelectorAll(".route");
const $documentFragment = document.createDocumentFragment();
const $pag = document.querySelector(".pag");
const $loader = document.querySelector(".ld");
const $navMenu = document.querySelector(".link_container");
const $menuICon = document.querySelector(".img_menu");
const $TextAbout = document.querySelector(".about_us_info");
const $btnUs = document.querySelector(".btn_us");
let $cards = document.querySelectorAll(".card");
let $img_banner = document.querySelector(".slider_img");
let contador = 0;
let validMenu = false;
let $allSliders = "";
let img = [];
let fetchResult = "";
let Rmargin = "-380px";

//funcion experimental para mandar mensajes por whatsap
function send(text) {
  // Codificar el mensaje para la URL
  let urlEncodedMessage = encodeURIComponent(text);
  let phoneNumber;

  // Construir la URL de WhatsApp con el número de teléfono y el mensaje codificado
  var whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Esta disponible el producto: ${urlEncodedMessage}`;
  window.location.href = whatsappUrl;
}

document.addEventListener("DOMContentLoaded", () => {
  if (location.hash == "" || location.hash == "#cards") {
    location.hash = "#cards/0";
  }
});

//loading cards
function loading() {
  $cardsContainer.innerHTML = "";
  for (let index = 0; index < 7; index++) {
    let card_load = document.createElement("a");
    card_load.classList.add("card_load");
    card_load.innerHTML = `
    <div class="figura"></div>
    <div class="card_img_load"></div>
    <div class="card_info_load">
      <div class="h4"></div>
      <div class="li"></div>
      <div class="li"></div>
      <div class="li"></div>
    </div>`;
    $cardsContainer.appendChild(card_load);
  }
}

let options = {
  method: "GET",
  headers: {
    "content-Type": "application/json",
  },
};
fetch("https://panaderiar.somee.com/panaderia/getbanner", options)
  //agregando las imagenes al DOM
  .then((res) => res.json())
  .then((response) => {
    response.value.forEach((el) => {
      let imgElement = document.createElement("img");
      imgElement.classList.add("img_elements");
      imgElement.alt = el.nombre;
      imgElement.src = el.imagen;
      $imgContainer.appendChild(imgElement);
    });

    img = response.value;

    //logica para que cambie la imagen
    $allSliders = document.querySelectorAll(".img_elements");
    //variable contador para el slider

    //al cargar se le agrega el slider de la posicion 0 para que no se quede en blanco
    $allSliders[contador].classList.add("show");
    $text.textContent = img[contador].nombre;
    $etiqueta.textContent = img[contador].etiqueta;

    //agregando la clase despues de cargar para que haga la animacion
    $img_banner = document.querySelector(".slider_img img");
    $img_banner.classList.add("banner_init");

    $loader.classList.add("desaparece");
    $loader.classList.remove("loader");
    $loader.style.setProperty("visibility", "hidden");
  });

//funcion next
function next() {
  $allSliders[contador].classList.remove("show");
  contador++;
  if (contador > img.length - 1) {
    contador = 0;
  }
  $text.textContent = img[contador].nombre;
  $etiqueta.textContent = img[contador].etiqueta;
  $allSliders[contador].classList.add("show");
}

//funcion before
function before() {
  $allSliders[contador].classList.remove("show");
  contador--;
  if (contador < 0) {
    contador = img.length - 1;
  }
  $allSliders[contador].classList.add("show");
  $text.textContent = img[contador].nombre;
  $etiqueta.textContent = img[contador].etiqueta;
}

//delegacion de eventos
document.addEventListener("click", (e) => {
  //funcionalidad para mover el carrusel una imagen despues
  if (e.target.matches(".next")) {
    e.preventDefault();
    next();
  }

  //funcionalidad para movel el carrusel una imagen antes
  if (e.target.matches(".before")) {
    e.preventDefault();
    before();
  }

  //sacar la ventana
  if (e.target.matches(".cardfront")) {
    e.preventDefault();
    let data = e.target.dataset.id;
    let objresult = fetchResult.products.find((el) => el.id == data);
    ventana(objresult);
  }

  //funcionalidad para cerrar  la ventana de eliminar
  if (e.target.matches(".detelete_background")) {
    close();
  }

  //funcionalidad para cerrar el producto abierto
  if (e.target.matches(".background")) {
    //---------logica para esconder la ventana-------------------
    let prueba = document.querySelector(".card_window");
    prueba.classList.toggle("scale_down");
    prueba.addEventListener("animationend", (e) => {
      close();
    });
  }

  //funcionalidad del boton de whats
  if (e.target.matches(".btnWhats")) {
    let data = e.target.dataset.id;
    let product = fetchResult.products.find((el) => el.id == data);
    if (product.disponibilidad == "disponible") {
      send(product.nombre);
    } else {
      alert("poruducto no disponible");
    }
  }

  //paginacion eventos
  if (e.target.matches(".itemPag")) {
    e.preventDefault();
    let url = e.target.dataset.pag;
    location.hash = url;
    let $products = document.querySelector("#products");
    products.scrollIntoView({ behavior: "smooth" });
  }

  //logica del menu desplegable
  if (e.target.matches(".img_menu")) {
    if (validMenu == true) {
      closeMenu();
    } else {
      $navMenu.style.setProperty("transform", "translateX(0)");
      $menuICon.setAttribute("src", "imagen/close.png");
      validMenu = true;
    }
  }

  if (
    !e.target.matches(".img_menu") &&
    !e.target.matches(".nav_ul_container") &&
    validMenu == true
  ) {
    closeMenu();
  }

  //boton para mas informacion
  if (e.target.matches(".btn_us")) {
    e.preventDefault();
    $TextAbout.classList.toggle("auto");
    if ($TextAbout.classList.contains("auto")) {
      $btnUs.innerText = "Ver menos";
    } else {
      $btnUs.innerText = "Saber mas";
    }
  }

  //obtener todos los productos
  if (e.target.matches(".allProducts")) {
    location.href = "#cards/0";
  }

  //logica del filtro
  if (e.target.matches(".filter")) {
    e.preventDefault();
    let element = e.target.id;
    let elements = document.querySelectorAll(".filter");
    //para traer todos los elementos
    if (element == "cards") {
      location.href = "#cards/0";
      styles(elements, element);
      return;
    }

    let dataElement = e.target.dataset.filter;
    location.hash = `filter/${dataElement}/0`;
    styles(elements, element);
  }
});

//funcion para darle estilo al elemento seleccionado en el filtro
function styles(elements, element) {
  elements.forEach((el) => {
    el.classList.remove("links_filter_select");
  });
  document.querySelector(`#${element}`).classList.add("links_filter_select");
}

//cerrar menu
function closeMenu() {
  $navMenu.style.setProperty("transform", "translateX(130%)");
  $menuICon.setAttribute("src", "imagen/menu abierto.png");
  validMenu = false;
}

//cambiar banner
setInterval(() => {
  next();
}, 7000);

//contador para hacer que el nav sea fixed y evitar un bug visual
let contadorNav = 0;
let clientWind = window.innerWidth;
window.addEventListener("resize", () => {
  clientWind = window.innerWidth;

  //si el tamaño de la pantalla es mayor o igual a esa resolucion significa que el nav de escritorio vabe en pantalla, por lo tanto se va a su origen
  if (clientWind >= 1075) {
    $navMenu.style.setProperty("transform", "translateX(0)");
    validMenu = false;
  } else {
    //aqui es cuando la pantalla es menor, por lo tanto el nav se esconde para sacarlo dinamicamente con el boton del menu
    $navMenu.style.setProperty("transform", "translateX(130%)");
  }

  navScroll();
});

navScroll();

//funcion para hacer el menu diamico a hacer scroll
function navScroll() {
  if (
    navigator.userAgent.includes("Android") ||
    navigator.userAgent.includes("iPhone")
  ) {
    const $nav = document.querySelector(".nav_container");
    $nav.classList.remove("nav_default");
    Rmargin = "-300px";
  } else if (clientWind >= 1075) {
    //logica para cambiar el estilo del nav al hacer scroll
    window.addEventListener("scroll", (e) => {
      const $nav = document.querySelector(".nav_container");
      if (
        !navigator.userAgent.includes("Android") ||
        !navigator.userAgent.includes("iPhone")
      ) {
        $nav.classList.toggle("nav_style_color", window.scrollY > 0);
      }

      //aplicando colores a los links del nav
      $linksNav.forEach((el) => {
        el.classList.toggle("nav_links_color", window.scrollY > 0);
      });
      //primero se valida que el contador sea mayor a 20, esto se logra bajando un poco en la pagina
      //luego se valida lo importante, que el scroll este en el tope
      //esto evita un bug al iniciar la pagina
      //esto funciona gracias a que el scroll realizado se va suamando de alguna manera y se queda guardado
      //cuando ese scroll supera el 20, entonces si puede hacer la animacion de stock

      //pd: validar que el tamaño de la pantalla sea el requerido, si no esto se seguira cumpiendo al reducir el tamaño de la pantalla
      if (contadorNav > 20 && clientWind >= 1075) {
        $nav.classList.toggle("nav_default", window.scrollY == 0);
      }
      contadorNav++;
    });
  }
}

// ----------------logica para hacer la peticion fetch---------
const peticion = async (url, textPag) => {
  //cards de carga

  let options = {
    method: "GET",
    headers: {
      "content-Type": "application/json",
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((result) => {
      fetchResult = result.value;
      loadDOMconatent(textPag);
    });
};

//--------------funcion para cargar contenido------

function loadDOMconatent(textPag) {
  $cardsContainer.innerHTML = "";

  //logica para calcular la cantidad de paginas
  let numPag;
  //saco el numero entero
  //se le suma el numero total de elementos a la cantidad de elementos a mostrar por pagina y se divide entre estos mismos
  let entero = Math.floor((fetchResult.count + 8) / 8);
  //saco el desimal
  let decimals = (fetchResult.count + 8) / 8;
  let decimal = decimals - entero;

  //si el desimal es mayor que 0.5 es porque hay uno o mas elementos en una pagina
  if (decimal > 0.1) {
    numPag = Math.ceil((fetchResult.count + 8) / 8);
  } else if (decimal == 0) {
    //si es menor es porque aun no hay elementos en la pagina siguiente
    numPag = entero;
  }

  //agregando los elementos al dom
  fetchResult.products.forEach((el) => {
    let div = document.createElement("a");
    div.classList.add("card");
    div.setAttribute("href", "");

    if (el.disponibilidad == "disponible") {
      div.innerHTML = `<div class="cardfront" data-id="${el.id}"></div>
      <div class="figura">
      </div>
      <div class="card_img">
      <img src="${el.imagen}" alt="${el.nombre}" />
      </div>
      <div class="card_info">
      <h4>${el.nombre.toUpperCase()}</h4>
      <ul>
        <li>${el.precio} $RD</li>
        <li>${el.tipo}</li>
        <li style="color:blue">${el.disponibilidad}</li>
      </ul>
    
      </div>
      `;
    } else {
      div.classList.add("back_dis");
      div.innerHTML = `<div class="cardfront" data-id="${el.id}"></div>
      <div class="figura_out">
      Agotado
      </div>
      <div class="card_img">
      <img src="${el.imagen}" alt="${el.nombre}" />
      </div>
      <div class="card_info">
      <h4>${el.nombre.toUpperCase()}</h4>
      <ul>
        <li>${el.precio} $RD</li>
        <li>${el.tipo}</li>
        <li style="color:red">${el.disponibilidad}</li>
      </ul>
  
      </div>
      `;
    }

    $documentFragment.appendChild(div);
  });

  $pag.innerHTML = "";
  //para hacer la paginacion dinamica tuve que hacer que la funcion acepte un parametro, ahi viene el texto que van
  //a obtener los items del paginado para hacer el paginado correctamente
  for (let index = 1; index < numPag; index++) {
    let a = document.createElement("a");
    a.classList.add("itemPag");
    a.textContent = index;
    // se le resta uno porque todo esta configurado para empezar desde 0,
    //de este modo el "1" va a tener el "data-0"
    a.setAttribute("data-pag", `${textPag}/${index - 1}`);
    a.setAttribute("href", index);
    $pag.appendChild(a);
  }

  $cardsContainer.appendChild($documentFragment);
  //seleccion de las cards actuales para no hacer peticiones innecesarias
  $cards = document.querySelectorAll(".card");
}

// --------------ventanas de contenido----------
function ventana(producto) {
  let body = document.querySelector("body");
  let div = document.createElement("div");
  div.classList.add("background");
  div.innerHTML = `<article class="card_window">
  <div class="img_window">
    <img src="${producto.imagen}" alt="${producto.nombre}" />
  </div>
  <div class="window_info">
    <h3>${producto.nombre}</h3>
    <p>${producto.precio} $RD</p>
    <p>${producto.tipo}</p>
    <p>${producto.disponibilidad}</p>
  </div>
  <div class="window_info2">
    <h3>Ingredientes</h3>
    <p>${producto.ingredientes}
    </p>
    <h3>Descripcion</h3>
    <p>${producto.descripcion}
    </p>
  </div>
  <button class="btnWhats" data-id="${producto.id}"><svg fill="#000000" height="900px" width="900px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  viewBox="0 0 308 308" xml:space="preserve">
<g id="XMLID_468_">
 <path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156
   c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687
   c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887
   c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153
   c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348
   c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802
   c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922
   c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0
   c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458
   C233.168,179.508,230.845,178.393,227.904,176.981z"/>
 <path id="XMLID_470_" d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716
   c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396
   c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z
    M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188
   l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677
   c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867
   C276.546,215.678,222.799,268.994,156.734,268.994z"/>
</g>
</svg>preguntar</button>
</article>`;
  $section.appendChild(div);
  body.classList.add("block");
}

//-----------------funcion para cerrar las ventanas de contenido------
function close() {
  let body = document.querySelector("body");
  const ventanaVI = document.querySelector(".background");
  ventanaVI.remove();
  body.classList.remove("block");
}

//logica para que los elementos carguen cuando esten a la vista
function cargar(entrys) {
  let url = location.hash.includes("cards") ? location.hash : "#cards/0";
  //dividirla
  let destruc = url.split("/");
  entrys.forEach(async (el) => {
    let id = el.target.id;
    const clas = el.target.classList[0];
    //obtengo el elemento a animar a partir de la clase padre
    const elements = document.querySelector(`.${clas} article`);

    if (el.isIntersecting) {
      document.querySelector(`a[href="#${id}"]`).classList.add("links_select");
      elements.classList.add("load_content");
      elements.addEventListener("animationend", (e) => {
        elements.classList.remove("hidden");
      });

      //comprobando la url actual para que al recargar la pagina se quede el contenido que estaba en pantalla
      if (id == "products" && $cards.length == 0) {
        loading();
        fetchResult = peticion(
          `https://panaderiar.somee.com/panaderia/products/${destruc[1]}`,
          "#cards"
        );
      }
    } else {
      document
        .querySelector(`a[href="#${id}"]`)
        .classList.remove("links_select");
    }
  });
}

// interseccion observer
const observador = new IntersectionObserver(cargar, {
  rootMargin: Rmargin,
});

$lements.forEach((el) => {
  observador.observe(el);
});

//route
window.addEventListener("hashchange", async (e) => {
  //obtener la url actual
  let url = location.hash;
  //dividirla
  let destruc = url.split("/");

  //usar la url dividida para hacer la logica del paginado
  if (location.hash == `#cards/${destruc[1]}`) {
    loading();
    fetchResult = peticion(
      `https://panaderiar.somee.com/panaderia/products/${destruc[1]}`,
      "#cards"
    );
    //comparar si la url que estroy buscando para hacer la carga es la misma que esta esta actualzamente en el navegador
  } else if (location.hash == `#filter/${destruc[1]}/${destruc[2]}`) {
    loading();
    fetchResult = peticion(
      `https://panaderiar.somee.com/panaderia/filter/${destruc[1]}/${destruc[2]}`,
      `#filter/${destruc[1]}`
    );
  }
});
