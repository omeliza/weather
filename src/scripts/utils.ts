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

export const enableSearch = async () => {
  const search = document.querySelector<HTMLInputElement>('#city-search');
  const showMoreBlock = document.querySelector<HTMLElement>('.show-more');
  try {
    if (search?.value.length) {
      const capitalize =
        search.value.charAt(0).toUpperCase() + search.value.slice(1);
      const city = new Weather(capitalize, '3');
      await city.checkForcast();
      if (showMoreBlock?.style.display === 'flex') await city.showMore();
    }
    if (search) {
      search.value = '';
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorBlock = document.querySelector<HTMLElement>('.error');
      if (errorBlock) {
        errorBlock.innerText =
          'Ooops... Something went wrong! Please try again';
        errorBlock.style.display = 'block';
        setTimeout(() => {
          errorBlock.style.display = 'none';
        }, 2000);
      }
    }
  }
};

export const ForcastServices = {
  getDayForcast,
  getThreeDayForcast,
};

export const errorHandler = () => {
  const errorBlock = document.querySelector<HTMLElement>('.error');
  if (errorBlock) {
    errorBlock.innerText = 'Ooops... Something went wrong! Please try again';
    errorBlock.style.display = 'block';
    setTimeout(() => {
      errorBlock.style.display = 'none';
    }, 3000);
  }
};
