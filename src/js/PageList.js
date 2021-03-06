import moment from "moment"
import { lightButton, gameCard } from "./components";
const PageList = (argument = "") => {

  const searchBar = document.getElementById("searchbar");
  const searchButton = document.querySelector("#searchbtn");
  const dateToday = moment(Date.now()).format("YYYY-MM-DD");
  const date365 = moment(Date.now() + 3.154e+10).format("YYYY-MM-DD");
  let showMoreCount = 1
  let totalResults = 0;
  let articles = "";

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
    pageContent.innerHTML = `
      <section class="page-list mt-5">
        <h1 class="display-3 font-weight-bold message mb-5 text-info"></h1>
        <div class="articles card-columns text-center">...loading</div>
      </section>
    `;
    preparePage();
  };

  const gameTitleValue = () => {
    return searchBar.value;
  };

  const injectSearch = (e) => {
    articles = "";
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

  const getPlatforms = () => {
    let platformsContainer = document.querySelector('.platforms-checkboxes')
    fetch(`https://api.rawg.io/api/platforms`)
      .then((response) => response.json())
      .then((response) => {
        response.results.forEach(platform => {
          platformsContainer.innerHTML += `
          <li><a href="#" id="check${platform.id}" class="small btn" data-value="${platform.id}" tabIndex="-1"><input type="checkbox"/>&nbsp;${platform.name}</a></li>`
        })    
    });
  };

  searchButton.addEventListener('click', injectSearch)
  searchBar.addEventListener('input', resetView)

  render();
  // getPlatforms();
};

export {PageList};