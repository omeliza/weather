class Weather {
  constructor(city, days) {
    this.city = city;
    this.days = days;

    document.querySelector('.city').innerText = this.city;
  }

  checkForcast() {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=4840c1644aa04a3694f140934220609&q=${this.city}&aqi=no`,
    )
      .then((response) => response.json())
      .then((data) => {
        const curr = data.current;
        document.querySelector('.city').insertAdjacentHTML(
          'afterend',
          `
        <img src='${curr.condition.icon}'>
        <h5>${curr.condition.text}</h5>`,
        );
        document.querySelector('.forecast .date').innerHTML = curr.last_updated;
        document.querySelector('.forecast .temperature').innerHTML =
          curr.temp_c;
        document.querySelector('.forecast .feelslike').innerHTML =
          curr.feelslike_c;
        document.querySelector('.forecast .humidity').innerHTML = curr.humidity;
      });
  }
  showMore() {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=4840c1644aa04a3694f140934220609&q=${this.city}&days=${this.days}&aqi=no`,
    )
      .then((response) => response.json())
      .then((data) => {
        const forecast = data.forecast.forecastday;
        // forecast.map(el => )
        document.querySelector('.day .date').insertAdjacentHTML(
          'beforebegin',
          `<h3>${forecast[0].date}</h3>
          <img src='${forecast[0].day.condition.icon}'>
          <h5>${forecast[0].day.condition.text}</h5>`,
        );
        document.querySelector('.day .max-temp').innerHTML =
          forecast[0].day.maxtemp_c;
        document.querySelector('.day .min-temp').innerHTML =
          forecast[0].day.mintemp_c;
        document.querySelector('.day .avg-humid').innerHTML =
          forecast[0].day.avghumidity;
        console.log(data.forecast.forecastday);
      });
  }
}

const lviv = new Weather('Lviv', '3');
lviv.checkForcast();
document
  .querySelector('.show-more-btn')
  .addEventListener('click', lviv.showMore());
