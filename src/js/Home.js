const Home = () => {
  const preparePage = () => {
    let articles = "";
    let newDate = new Date().toISOString().substring(0, 10);
    const fetchList = (url) => {
      fetch(`${url}`)
        .then((response) => response.json())
        .then((response) => {
          let results = response.results.filter(result => result.released !== null)
          results.forEach((article) => {
            fetch(`https://api.rawg.io/api/games/${article.id}`)
              .then((response2) => response2.json())
              .then((response2) => {
                console.log(response2)
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
        })
    };

    fetchList(`https://api.rawg.io/api/games?ordering=-released&dates=2020-01-01,${newDate}&page_size=10`);
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-list mt-5 pt-5">
        <div class="articles card-columns">...loading</div>
      </section>
    `;

    preparePage();
  };

  render();
}

export {Home}