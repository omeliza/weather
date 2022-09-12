import axios from 'axios';
import { Weather } from '.';
import { IDayForcast, IThreeDaysForcast } from './interfaces';

const key = process.env.KEY;

const getDayForcast = async (city: string) => {
  const response = await axios.get<IDayForcast>(
    `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&aqi=no`,
  );
  return response;
};

const getThreeDayForcast = async (city: string, days: string) => {
  const response = await axios.get<IThreeDaysForcast>(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.KEY}&q=${city}&days=${days}&aqi=no`,
  );
  return response;
};

export const enableSearch = () => {
  const search = document.querySelector<HTMLInputElement>('#city-search');
  const showMoreBlock = document.querySelector<HTMLElement>('.show-more');

  if (search?.value.length) {
    const capitalize =
      search.value.charAt(0).toUpperCase() + search.value.slice(1);
    const city = new Weather(capitalize, '3');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    city.checkForcast();
    if (showMoreBlock?.style.display === 'flex') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      city.showMore();
    }
    search.value = '';
  }
};

export const ForcastServices = {
  getDayForcast,
  getThreeDayForcast,
};
