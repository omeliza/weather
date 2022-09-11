import './style.css';
console.log(process.env.KEY);

interface IForcastday {
  date: string;
  day: {
    condition: { icon: string; text: string };
    maxtemp_c: string;
    mintemp_c: string;
    avghumidity: string;
  };
  hour: { temp_c: string }[];
}

class Weather {
  city: string;
  days: string;

  constructor(city: string, days: string) {
    this.city = city;
    this.days = days;
  }

  checkForcast() {
    const city = document.querySelector<HTMLElement>('.city');
    const date = document.querySelector<HTMLElement>('.forecast .date');
    const temperature = document.querySelector<HTMLElement>(
      '.forecast .temperature',
    );
    const feelslike = document.querySelector<HTMLElement>(
      '.forecast .feelslike',
    );
    const humidity = document.querySelector<HTMLElement>('.forecast .humidity');
    const showMoreBlock = document.querySelector<HTMLElement>('.show-more');

    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.KEY}&q=${this.city}&aqi=no`,
    )
      .then((response) => response.json())
      .then((data) => {
        const curr = data.current;
        if (city)
          city.innerHTML = `
            <h2>${data.location.name}</h2>
            <img src='${curr.condition.icon}'>
            <h5>${curr.condition.text}</h5>
          `;
        if (date) {
          date.innerHTML = curr.last_updated;
        }
        if (temperature) {
          temperature.innerHTML = curr.temp_c;
        }
        if (feelslike) {
          feelslike.innerHTML = curr.feelslike_c;
        }
        if (humidity) {
          humidity.innerHTML = curr.humidity;
        }
      });
    if (showMoreBlock) {
      showMoreBlock.style.display === 'flex';
    }
  }
  showMore() {
    const showMoreBlock = document.querySelector<HTMLElement>('.show-more');
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.KEY}&q=${this.city}&days=${this.days}&aqi=no`,
    )
      .then((response) => response.json())
      .then((data) => {
        const forecast = data.forecast.forecastday;
        if (showMoreBlock) {
          showMoreBlock.textContent = '';
          showMoreBlock.insertAdjacentHTML(
            'beforeend',
            `<div class='close'>&#10008;</div>`,
          );
        }

        const close = document.querySelector('.close');
        close?.addEventListener('click', () => {
          const showMoreBlock =
            document.querySelector<HTMLElement>('.show-more');
          if (showMoreBlock) showMoreBlock.style.display = 'none';
        });

        forecast.reverse().map((el: IForcastday) => {
          if (showMoreBlock !== null) {
            showMoreBlock.insertAdjacentHTML(
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
            showMoreBlock.style.display = 'flex';
          }
        });
      })
      .catch((e) => console.log(e.message));
  }
}

let city = new Weather('Lviv', '3');
city.checkForcast();

(function () {
  const btn = document.querySelector<HTMLButtonElement>('.show-more-btn');
  if (btn) btn.addEventListener('click', () => city.showMore());

  const search = document.querySelector<HTMLInputElement>('#city-search');
  const showMoreBlock = document.querySelector<HTMLElement>('.show-more');

  search?.addEventListener('blur', () => {
    if (search.value.length) {
      let capitalize =
        search.value.charAt(0).toUpperCase() + search.value.slice(1);
      city = new Weather(capitalize, '3');
      city.checkForcast();
      if (showMoreBlock?.style.display === 'flex') {
        city.showMore();
      }
      search.value = '';
    }
  });
})();
