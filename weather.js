const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".wearher-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantBtn]");
const notFoundImage  = document.querySelector("[data-notFound]"); 

 
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();


userTab.addEventListener("click" , ()=>
{
    switchTab(userTab);
});

searchTab.addEventListener("click" , ()=>
{
    switchTab(searchTab);
});


function switchTab(clickTab)
{
    if(currentTab!=clickTab)
    {

        currentTab.classList.remove("current-tab");
        currentTab=clickTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {   
            userInfoContainer.classList.remove("active");
            notFoundImage.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");   
            notFoundImage.classList.remove("active");
            getfromSessionStorage();
        }
    }     
}
function getfromSessionStorage()
{
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates)
        {
            grantAccessContainer.classList.add("active");
        }
        else{
            coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");

    try
    {
        const  response = await  fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            let data = await response.json();
            grantAccessContainer.classList.remove("active");
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
    }
    catch(err)
    {
                console.log("Error in api fetching");
                loadingScreen.classList.add("active");
    }
}
function  renderWeatherInfo(weatherInfo)
{
    const city = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    
    if(weatherInfo?.name)
    {
        city.innerText  = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    }
    else
    {
        userInfoContainer.classList.remove("active");
        notFoundImage.classList.add("active");
        console.log("error is found ");
    }
    
}
function   getlocation()
{   
    if(navigator.geolocation)
    {
     navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        alert("no geo location support in your device");
    }

}
grantAccessButton.addEventListener('click',getlocation);
function showPosition (position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}



const searchInput = document.querySelector("[data-searchInput]");

    searchForm.addEventListener("submit", (e) =>
    {   e.preventDefault();
        const cityName = searchInput.value;

        if(cityName==="")
        {
            return;
        }
        else
        {
            // console.log(cityName);
            fetchSearchWeatherInfo(cityName);
        }


    });
    async function fetchSearchWeatherInfo(city) {
        userInfoContainer.classList.remove("active");
        notFoundImage.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        loadingScreen.classList.add("active");
    
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
                );
            const datainfo = await res.json();
            // console.log(datainfo);  
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(datainfo);
        }
        catch(err) {
            //hW
            console.log(err);
            console.log("erro in api");
        }


    }
