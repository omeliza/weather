class Weather {
  constructor(city, days) {
    this.city = city;
    this.days = days;
  }

  checkForcast() {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=4840c1644aa04a3694f140934220609&q=${this.city}&aqi=no`,
    )
      .then((response) => response.json())
      .then((data) => {
        const curr = data.current;
        document.querySelector('.city').innerHTML = `
        <h2>${data.location.name}</h2>
        <img src='${curr.condition.icon}'>
        <h5>${curr.condition.text}</h5>`;

        document.querySelector('.forecast .date').innerHTML = curr.last_updated;
        document.querySelector('.forecast .temperature').innerHTML =
          curr.temp_c;
        document.querySelector('.forecast .feelslike').innerHTML =
          curr.feelslike_c;
        document.querySelector('.forecast .humidity').innerHTML = curr.humidity;
      });
    document.querySelector('.show-more').style.display === 'flex' &&
      this.showMore();
  }
  showMore() {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=4840c1644aa04a3694f140934220609&q=${this.city}&days=${this.days}&aqi=no`,
    )
      .then((response) => response.json())
      .then((data) => {
        const forecast = data.forecast.forecastday;
        let showMoreBlock = document.querySelector('.show-more');
        showMoreBlock.textContent = '';
        forecast.reverse().map((el) => {
          document.querySelector('.show-more').insertAdjacentHTML(
            'afterbegin',
            `
              <div>
                <div class="day">
                  <div class='date'>
                    <h3>${el.date}</h3>
                    <img src='${el.day.condition.icon}'>
                    <h5>${el.day.condition.text}</h5>
                  </div>
                  <div class="max-temp">${el.day.maxtemp_c}</div>
                  <div class="min-temp">${el.day.mintemp_c}</div>
                  <div class="avg-humid">${el.day.avghumidity}</div>
                </div>
                <details>
                  <summary><i>Show hourly temperature</i></summary>
                  <ul>
                    <li>00:00:&ensp; ${el.hour[0].temp_c}</li>
                    <li>02:00:&ensp; ${el.hour[2].temp_c}</li>
                    <li>04:00:&ensp; ${el.hour[4].temp_c}</li>
                    <li>06:00:&ensp; ${el.hour[6].temp_c}</li>
                    <li>08:00:&ensp; ${el.hour[8].temp_c}</li>
                    <li>10:00:&ensp; ${el.hour[10].temp_c}</li>
                    <li>12:00:&ensp; ${el.hour[12].temp_c}</li>
                    <li>14:00:&ensp; ${el.hour[14].temp_c}</li>
                    <li>16:00:&ensp; ${el.hour[16].temp_c}</li>
                    <li>18:00:&ensp; ${el.hour[18].temp_c}</li>
                    <li>20:00:&ensp; ${el.hour[20].temp_c}</li>
                    <li>22:00:&ensp; ${el.hour[22].temp_c}</li>
                  </ul>
                </details>
              </div>
            `,
          );
        });
      })
      .catch((e) => console.log(e.message));
    document.querySelector('.show-more').style.display = 'flex';
  }
  activateEvent() {
    document
      .querySelector('.show-more-btn')
      .addEventListener('click', () => this.showMore(), { once: true });
  }
}

let city = new Weather('Lviv', '3');
city.checkForcast();
city.activateEvent();

const search = document.querySelector('#city-search');
search.addEventListener('blur', () => {
  if (search.value.length) {
    let capitalize =
      search.value.charAt(0).toUpperCase() + search.value.slice(1);
    city = new Weather(capitalize, '3');
    city.checkForcast();
    city.activateEvent();
  }
});
