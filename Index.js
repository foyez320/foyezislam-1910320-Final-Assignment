async function initializePage() {
  try {
    
    const defaultCountryName = 'Bangladesh';
    const defaultCountryData = await getCountryData(defaultCountryName);
    displayCountryData(defaultCountryData);
  } catch (error) {
    console.error('Error initializing page:', error);
  }
}

async function getCountryData(countryName) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await response.json();
    return countryData;
  } catch (error) {
    console.error('Error fetching country data:', error);
    throw error; 
  }
}


function displayCountryData(countryData) {
  const countryDataContainer = document.getElementById('countryData');
  countryDataContainer.innerHTML = '';

  countryData.forEach(country => {
    const countryCard = createCountryCard(country);
    countryDataContainer.appendChild(countryCard);
  });
}


function createCountryCard(country) {
  const countryCard = document.createElement('div');
  countryCard.className = 'col-md-4 mb-4';

  const flagUrl = getFlagUrl(country.flags);
  countryCard.innerHTML = `
    <div class="card" data-country="${country.name?.common}">
      <img src="${flagUrl}" class="card-img-top" alt="${country.name?.common}">
      <div class="card-body">
        <h5 class="card-title">
          ${country.name?.common ? country.name?.common : 'Country Name Not Available'}
        </h5>
        ${country.capital ? `<p class="card-text">Capital: ${country.capital}</p>` : ''}
        ${country.population ? `<p class="card-text">Population: ${country.population}</p>` : ''}
        <button class="btn btn-primary" onclick="showMoreDetails('${country.name?.common}')">More Details</button>
      </div>
      <div class="weather-info"></div>
    </div>
  `;

  return countryCard;
}


function getFlagUrl(flags) {
  if (flags && flags.svg) {
    return flags.svg;
  } else if (flags && flags.png) {
    return flags.png;
  } else if (flags && flags.emoji) {
    return `https://restcountries.com/v3/emoji/${flags.emoji}.png`;
  }
  return ''; 
}


async function searchCountry() {
  const countryInput = document.getElementById('countryInput').value;

  try {
  
    const countryData = await getCountryData(countryInput);

   
    displayCountryData(countryData);
  } catch (error) {
    console.error('Error searching for country:', error);
  }
}

// show more details and weather information
async function showMoreDetails(countryName) {
  try {
    const apiKey = "9b04d704c4243cb03cc20b8650801502";
    const countryCard = document.querySelector(`[data-country="${countryName}"]`);

    if (countryCard) {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${countryName}&units=metric&appid=${apiKey}`);
      const weatherData = await response.json();
      const weatherInfo = document.createElement('div');
      weatherInfo.className = 'weather-info';

      if (weatherData.weather && weatherData.weather.length > 0) {
        const weatherDescription = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;
        const weatherIcon = weatherData.weather[0].icon;

        weatherInfo.innerHTML = `
          <p class="weather-description">${weatherDescription}</p>
          <p class="temperature">${temperature}°C</p>
          <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
        `;
      } else {
        weatherInfo.innerHTML = `<p>Weather data not available for ${countryName}</p>`;
      }

      countryCard.appendChild(weatherInfo);
    } else {
      console.error(`Country card not found for ${countryName}`);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

initializePage();


