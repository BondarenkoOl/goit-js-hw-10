import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchInput, DEBOUNCE_DELAY));

function searchInput(e) {
  e.preventDefault();

  const countryName = input.value.trim();

  if (countryName === '') {
    clearHtml();
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      clearHtml();

      if (countries.length > 10) {
        alertTooManyMatches();
      } else if (countries.length <= 10 && countries.length >= 2) {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountryInfo(countries)
        );
      }
    })
    .catch(() => alertWrongName());
}

function renderCountryList(countries) {
  const listMarkup = countries
    .map(({ name, flags }) => {
      return `
        <li class="country-list__item">
            <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 20px>
            <h2 class="country-list__name">${name.official}</h2>
        </li>
        `;
    })
    .join('');
  return listMarkup;
}

function renderCountryInfo(countries) {
  const infoMarkup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><span class="country-info__header">Capital:</span> ${capital}</li>
            <li class="country-info__item"><span class="country-info__header">Population:</span> ${population}</li>
            <li class="country-info__item"><span class="country-info__header">Languages:</span> ${Object.values(
              languages
            )}</li>
        </ul>
        `;
    })
    .join('');
  return infoMarkup;
}

function clearHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
