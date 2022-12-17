import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputElement: document.querySelector('#search-box'),
  countriesListElement: document.querySelector('.country-list'),
  countryInfoElement: document.querySelector('.country-info'),
};

const onInput = event => {
  const input = event.target.value.trim();

  if (input === '') {
    clearElementsContent(refs.countriesListElement, refs.countryInfoElement);
    return;
  }

  fetchCountries(input)
    .then(result => {
      if (!result) {
        clearElementsContent(
          refs.countriesListElement,
          refs.countryInfoElement
        );
        return;
      }
      if (result.length === 1) {
        clearElementsContent(refs.countriesListElement);
        refs.countryInfoElement.innerHTML = createSingleCountryMarkup(
          result[0]
        );
        return;
      }
      if (result.length > 1 && result.length < 10) {
        clearElementsContent(refs.countryInfoElement);
        refs.countriesListElement.innerHTML =
          createMultipleCountriesMarkup(result);
        return;
      }
      if (result.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => console.log(error));
};

refs.inputElement.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function createMultipleCountriesMarkup(countries) {
  return countries
    .map(country => {
      return `<li class="country-list__item"><img src="${country.flags.svg}" alt="Flag of ${country.name}" class="country-list__flag"><p class="country-list__name">${country.name}</p></li>`;
    })
    .join('');
}

function createSingleCountryMarkup(country) {
  return `<img src="${country.flags.svg}" alt="Flag of ${
    country.name
  }" class="country-info__flag"><h2 class="country-info__heading">${
    country.name
  }</h2><p class="country-info__text">Capital: <span class="country-info__information">${
    country.capital
  }</span></p><p class="country-info__text">Population: <span class="country-info__information">${
    country.population
  }</span> people</p><p class="country-info__text">Languages:<span class="country-info__information">${country.languages.map(
    language => ' ' + language.name
  )}</span></p>`;
}

function clearElementsContent(...args) {
  args.forEach(arg => (arg.innerHTML = ''));
}
