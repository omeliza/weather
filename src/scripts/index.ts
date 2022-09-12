import '../style.css';

import { enableSearch, ForcastServices } from './utils';

export class Weather {
  city: string;

  days: string;

  constructor(city: string, days: string) {
    this.city = city;
    this.days = days;
  }

  async checkForcast() {
    const city = document.querySelector<HTMLElement>('.city');
    const date = document.querySelector<HTMLElement>('.forecast .date');
    const temperature = document.querySelector<HTMLElement>(
      '.forecast .temperature',
    );
    const feelslike = document.querySelector<HTMLElement>(
      '.forecast .feelslike',
    );
    const humidity = document.querySelector<HTMLElement>('.forecast .humidity');

    try {
      const res = await ForcastServices.getDayForcast(this.city);
      if (res.status === 200) {
        const current = res.data.current;
        const location = res.data.location;

        if (city)
          city.innerHTML = `
            <h2>${location.name}</h2>
            <img src='${current.condition.icon}'>
            <h5>${current.condition.text}</h5>
          `;
        if (date) {
          date.innerHTML = current.last_updated;
        }
        if (temperature) {
          temperature.innerHTML = String(current.temp_c);
        }
        if (feelslike) {
          feelslike.innerHTML = String(current.feelslike_c);
        }
        if (humidity) {
          humidity.innerHTML = String(current.humidity);
        }
      } else {
        console.log('Oops...Something went wrong!');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log({ error: error.message });
      }
    }
  }

  async showMore() {
    const showMoreBlock = document.querySelector<HTMLElement>('.show-more');
    try {
      const res = await ForcastServices.getThreeDayForcast(
        this.city,
        this.days,
      );
      if (res.status === 200) {
        const forecast = res.data.forecast.forecastday;

        if (showMoreBlock) {
          showMoreBlock.textContent = '';
          showMoreBlock.insertAdjacentHTML(
            'beforeend',
            "<div class='close'>&#10008;</div>",
          );
        }

        const close = document.querySelector('.close');
        close?.addEventListener('click', () => {
          if (showMoreBlock) showMoreBlock.style.display = 'none';
        });

        forecast.reverse().map((el) => {
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
      } else {
        console.log('Oops...Something went wrong!');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log({ error: error.message });
      }
    }
  }
}

const city = new Weather('Lviv', '3');
// eslint-disable-next-line @typescript-eslint/no-floating-promises
city.checkForcast();

(function () {
  const btn = document.querySelector<HTMLButtonElement>('.show-more-btn');
  if (btn) btn.addEventListener('click', () => city.showMore());

  const search = document.querySelector<HTMLInputElement>('#city-search');

  search?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      enableSearch();
    }
  });
  search?.addEventListener('blur', enableSearch);
})();
