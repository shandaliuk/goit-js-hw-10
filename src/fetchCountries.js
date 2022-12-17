import Notiflix from 'notiflix';

const fetchCountries = name => {
  const requiredProperties = 'name,capital,population,flags,languages';
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=${requiredProperties}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Oops, there is no country with that name');
      }
      return response.json();
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
};

export { fetchCountries };
