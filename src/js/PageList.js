import moment from "moment"
import { lightButton, gameCard } from "./components";
const PageList = (argument = "") => {

  const searchBar = document.getElementById("searchbar");
  const searchButton = document.querySelector("#searchbtn");
  const dateToday = moment(Date.now()).format("YYYY-MM-DD");
  const date365 = moment(Date.now() + 3.154e+10).format("YYYY-MM-DD");
  let userGames = []
  let showMoreCount = 1
  let totalResults = 0;
  let articles = "";
  let currentSearchGames = [];

  const preparePage = () => {
    let cleanedArgument = argument.replace(/\s+/g, "-");
    const fetchList = (url, argument) => {
      let finalURL = url;
      let message = document.querySelector("h1.message")
      message.innerHTML = "New and trending"
      if (argument) {
        finalURL = `${url}?search=${argument}&page_size=9&page=${showMoreCount}`;
      }
      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          totalResults = response.count
          let searchModulo = totalResults / 9
          let results = response.results
          results.forEach((article) => {
            fetch(`https://api.rawg.io/api/games/${article.id}`)
              .then((response2) => response2.json())
              .then((response2) => {
                articles += `${gameCard(
                                article.id,
                                article.background_image,
                                article.name,
                                article.released,
                                response2.developers[0].name,
                                article.genres.map(genre => genre.name).join(" • "),
                                response2.rating,
                                response2.ratings_count,
                                article.platforms.map(platform => platform.platform.name).join(" • ")
                )}`;
                if (argument) {
                  message.innerHTML = `Search: ${gameTitleValue()}`
                }
                document.querySelector(".page-list .articles").innerHTML = articles;
                if (searchModulo > 0 && showMoreCount < 3) {
                  document.querySelector(".page-list .articles").innerHTML += lightButton("showMoreBtn", "Show more");
                  showMoreBtn.addEventListener('click', showMore);
                }
                currentSearchGames.push(article)
              });
          });  
        });
    };

    if (!argument) {
      fetchList(`https://api.rawg.io/api/games?dates=${dateToday},${date365}&ordering=-added&page_size=9&page=${showMoreCount}`, cleanedArgument);
    } else {
      fetchList("https://api.rawg.io/api/games", cleanedArgument);
    }
  };

  const showMore = () => {
    showMoreCount += 1
    preparePage()
  }

  const render = () => {
    currentSearchGames = [];
    pageContent.innerHTML = `
      <section class="page-list mt-5">
        <h1 class="display-3 font-weight-bold message mb-5"></h1>
        <div class="articles card-columns">...loading</div>
      </section>
    `;
    preparePage();
  };

  
  const gameTitleValue = () => {
    return searchBar.value;
  };

  const injectSearch = (e) => {
    articles = ""
    e.preventDefault();
    let cleanGame = gameTitleValue().replace(/\s+/g, "-");
    let newURL = `#pagelist/${cleanGame}`;
    window.location = newURL;
  };

  const resetView = (e) => {
    if (searchBar.value.length < 1) {
      window.location = `#pagelist`;
    }
  }

  
  pageContent.addEventListener('change',function(e){
    let checkedGame = currentSearchGames.filter(game => e.target.id.includes(game.id))[0]
    if (e.target.checked == false) {
      const index = userGames.indexOf(checkedGame);
      index > -1 ? userGames.splice(index, 1) : false;
    } else if (e.target.checked == true) {
      userGames.push(checkedGame)
    }
    console.log(userGames, "userGames")
  });


  searchButton.addEventListener('click', injectSearch)
  searchBar.addEventListener('input', resetView)

  render();
};

export {PageList};