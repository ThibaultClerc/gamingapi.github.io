import moment from "moment"
const PageList = (argument = "") => {

  const preparePage = () => {
    let cleanedArgument = argument.replace(/\s+/g, "-");
    let articles = "";

    const fetchList = (url, argument) => {
      let finalURL = url;
      if (argument !== "") {
        finalURL = url + "?search=" + argument;
      }
      document.querySelector(".articles").innerHTML = '';
      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          articles = ""
          response.results.forEach((article) => {
            fetch(`https://api.rawg.io/api/games/${article.id}`)
              .then((response2) => response2.json())
              .then((response2) => {
                articles += `
                  <div class="card bg-dark the-cards" style="width: 18rem" id="card-${article.id}">
                    <img class="card-img-top card-image" src="${article.background_image}" alt="Card image cap">
                    <div class="card-body">
                      <h4 class="card-title">${article.name}</h1>
                      <p class="card-text">${article.released}</p>
                      <a href = "#pagedetail/${article.id}">${article.id}</a>
                    </div>
                    <div class="cards-overlay text-left" id="overlay-${article.id}" style="word-break: break-word;">
                      <div class="mt-3 mr-3 ml-3">
                        <h4>${article.name}</h4>
                        <h5>${article.released}</h5>
                        <h6>${response2.developers[0].name}</h6>
                        <p>${article.genres.map(genre => genre.name).join(" • ")}</p>
                        <p>Note: ${response2.rating}</p>
                        <p>Nombre de votes: ${response2.ratings.length}</p>
                        <button id="detailsBtn" type="button" class="btn btn-light btn-sm" onclick="location.href='#pagedetail/${article.id}'">En savoir plus</button>
                      </div>
                    </div>
                  </div>
                `;
                document.querySelector(".page-list .articles").innerHTML = articles;
              })
              
          });
        });
    }

    function removeDefaultLink(e){
      e.preventDefault();
      let argument = gameTitleValue();
      let cleanedArgument = argument.replace(/\s+/g, "-");
      let newURL = `#pagelist/${cleanedArgument}`;
      window.location = newURL;
      fetchList(`https://api.rawg.io/api/games`,argument);
    };
    
    if (argument == ""){    
      fetchList(`https://api.rawg.io/api/games?dates=${dateToday},${date365}&ordering=-added`, cleanedArgument);
    }

    searchButton.addEventListener('click', removeDefaultLink);

  };

  const showMore = () => {
    
  }

  const render = () => {

    pageContent.innerHTML = `
    <section class="page-list mt-5 pt-5">
      <div class="articles card-columns">...loading</div>
    </section>
    `;

    preparePage();
  };

  const searchBar = document.getElementById("searchbar");
  const searchButton = document.querySelector("#searchbtn");
  const dateToday = moment(Date.now()).format("YYYY-MM-DD");
  const date365 = moment(Date.now() + 3.154e+10).format("YYYY-MM-DD");

  const gameTitleValue = () =>{
    let gameTitleValue = searchBar.value;
    console.log(gameTitleValue)
    return gameTitleValue;
  };

  render();
};

export {PageList};