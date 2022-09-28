<script setup>
import Accordion from "./components/Accordion.vue";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<script>
export default {
  mounted() {
    document.title = "Vue Weather app using Open Weather Map API.";
  },
  components: {
    Accordion,
  },
  data() {
    return {
      api_key: "375b5b72defecfdfccfa090d50f49db4",
      url_base: "http://api.openweathermap.org/data/2.5/",
      weather: {},
      query: "",
      weatherIcon: "",
      currentLocation: null,
      gettingLocation: false,
      errorLocationStr: null,
      isDropdownExpanded: false,
      selectedDropdown: "London",
      dropdownOptions: ["London", "Paris", "Berlin", "Madrid"],
    };
  },
  created() {
    if (!("geolocation" in navigator)) {
      this.errorLocationStr = "Geolocation is not available.";
      return;
    }

    this.gettingLocation = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.gettingLocation = false;
        this.currentLocation = pos;
        fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${this.currentLocation.coords.latitude}&lon=${this.currentLocation.coords.longitude}&limit=1&APPID=${this.api_key}`
        )
          .then((response) => {
            return response.json();
          })
          .then(this.locationResult)
          .then(() => {
            return fetch(
              `${this.url_base}forecast?q=${this.query}&APPID=${this.api_key}&units=metric`
            );
          })
          .then((response) => {
            return response.json();
          })
          .then(this.weatherResult);
      },
      (err) => {
        this.gettingLocation = false;
        this.errorLocationStr = err.message;
      }
    );
  },
  methods: {
    fetchLocationName(lat, lon) {
      fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&APPID=${this.api_key}`
      )
        .then((response) => {
          return response.json();
        })
        .then(this.locationResult);
    },
    fetchWeather(e) {
      if (e.key == "Enter") {
        fetch(
          `${this.url_base}forecast?q=${this.query}&APPID=${this.api_key}&units=metric`
        )
          .then((response) => {
            return response.json();
          })
          .then(this.weatherResult);
      }
    },
    locationResult(result) {
      this.currentLocation = result[0].name;
      this.query = this.currentLocation;
    },
    weatherResult(result) {
      this.weather = result;
    },
    setWeatherName(weather) {
      if (weather == "Clear") return "Clear";
      else if (weather == "Clouds") return "Cloudy";
      else if (weather == "Drizzle") return "Drizzly";
      else if (weather == "Rain") return "Rainy";
      else if (weather == "Thunderstorm") return "a Thunderstorm";
      else if (weather == "Snow") return "Snowy";
      else if (weather == "Mist") return "Misty";
      else if (weather == "Smoke") return "Smoky";
      else if (weather == "Haze") return "Hazy";
      else if (weather == "Fog") return "Foggy";
      else if (weather == "Sand") return "Sandy";
      else if (weather == "Dust") return "Dusty";
      else if (weather == "Ash") return "Ashy";
      else if (weather == "Squall") return "Windy";
      else if (weather == "Tornado") return "a Tornado";
      else return weather;
    },
    setWeatherIcon(weather, timeCheck) {
      if (weather == "Clear" && timeCheck.includes("d"))
        return (this.weatherIcon = "/src/assets/weather-icons/clearDay.png");
      else if (weather == "Clear" && timeCheck.includes("n"))
        return (this.weatherIcon = "/src/assets/weather-icons/clearNight.png");
      else if (weather == "Clouds" && timeCheck.includes("d"))
        return (this.weatherIcon = "/src/assets/weather-icons/cloudsDay.png");
      else if (weather == "Clouds" && timeCheck.includes("n"))
        return (this.weatherIcon = "/src/assets/weather-icons/cloudsNight.png");
      else if (weather == "Drizzle")
        return (this.weatherIcon = "/src/assets/weather-icons/drizzle.png");
      else if (weather == "Rain" && timeCheck.includes("d"))
        return (this.weatherIcon = "/src/assets/weather-icons/rainDay.png");
      else if (weather == "Rain" && timeCheck.includes("n"))
        return (this.weatherIcon = "/src/assets/weather-icons/rainNight.png");
      else if (weather == "Thunderstorm")
        return (this.weatherIcon = "/src/assets/weather-icons/tunderstorm.png");
      else if (weather == "Snow")
        return (this.weatherIcon = "/src/assets/weather-icons/snow.png");
      else if (
        weather == "Mist" ||
        weather == "Smoke" ||
        weather == "Haze" ||
        weather == "Dust" ||
        weather == "Fog" ||
        weather == "Sand" ||
        weather == "Dust" ||
        weather == "Ash" ||
        weather == "Squall" ||
        weather == "Tornado"
      )
        return (this.weatherIcon = "/src/assets/weather-icons/mist.png");
      else return weather;
    },
    setOption(option) {
      this.selectedDropdown = option;
      this.isDropdownExpanded = false;
    },
  },
};
</script>

<template>
  <header class="flex justify-between items-center mb-4 sm:mb-16">
    <button
      class="rounded-full shadow appearance-none p-5 flex items-center justify-center border h-6 w-6 dark:text-white dark:border-white"
    >
      <fa icon="fa-solid fa-bars" class="h-5 w-5" />
    </button>
    <div class="relative text-lg">
      <button
        class="flex items-center justify-between px-3 py-2 w-full shadow appearance-none border rounded-lg"
        @click="isDropdownExpanded = !isDropdownExpanded"
        @blur="isDropdownExpanded = false"
      >
        <fa icon="fa-solid fa-map-marker-alt" class="h-4 w-4 mr-2" />
        <span>{{ selectedDropdown }}</span>
        <fa icon="fa-solid fa-chevron-down" class="h-4 w-4 ml-2" />
      </button>
      <transition
        enter-active-class="transform transition duration-500 ease-custom"
        enter-class="-translate-y-1/2 scale-y-0 opacity-0"
        enter-to-class="translate-y-0 scale-y-100 opacity-100"
        leave-active-class="transform transition duration-300 ease-custom"
        leave-class="translate-y-0 scale-y-100 opacity-100"
        leave-to-class="-translate-y-1/2 scale-y-0 opacity-0"
      >
        <ul
          v-show="isDropdownExpanded"
          class="absolute left-0 right-0 mb-4 divide-y rounded-lg shadow-lg overflow-hidden bg-slate-50 dark:bg-slate-800"
        >
          <li
            v-for="(option, index) in dropdownOptions"
            :key="index"
            class="cursor-pointer px-3 py-2 transition-colors duration-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            @mousedown.prevent="setOption(option)"
          >
            {{ option }}
          </li>
        </ul>
      </transition>
    </div>
    <button
      class="modebtn rounded-full shadow appearance-none p-5 flex items-center justify-center border h-6 w-6 dark:text-white dark:border-white"
      @click="toggleDark()"
    >
      <fa v-if="isDark" icon="fa-solid fa-sun" class="h-5 w-5" />
      <fa v-if="!isDark" icon="fa-solid fa-moon" class="h-5 w-5" />
    </button>
  </header>

  <div
    class="mb-6"
    v-if="this.errorLocationStr !== null && weather.list === undefined"
  >
    Error fetching user location reason: {{ this.errorLocationStr }}
  </div>
  <div
    class="mb-6 sm:text-left sm:flex sm:justify-between"
    v-if="weather.list !== undefined"
  >
    <div class="sm:w-1/3">
      <h1 class="mb-6 text-xl text-left sm:mb-10">Today's Report</h1>
      <img
        class="w-32 sm:mx-0 m-auto mb-4"
        :src="
          setWeatherIcon(
            weather.list[0].weather[0].main,
            weather.list[0].weather[0].icon
          )
        "
        alt="Current weather icon."
      />
      <p class="mb-3">
        Its {{ setWeatherName(weather.list[0].weather[0].main) }}
      </p>
      <h3 class="mb-10 text-5xl">
        {{ Math.round(weather.list[0].main.temp) }}
        <span class="text-4xl text-blue-700 absolute">°</span>
      </h3>
    </div>
    <div class="flex items-center w-full text-center">
      <div class="w-1/3 sm:w-32 sm:mx-3">
        <img
          class="w-10 m-auto mb-2 sm:w-16"
          src="src/assets/weather-icons/wind.png"
          alt="Current weather icon."
        />
        <p>{{ weather.list[0].wind.speed }} m/s</p>
        <p class="text-xs sm:text-base">Wind Speed</p>
      </div>
      <div class="w-1/3 sm:w-32 sm:mx-3">
        <img
          class="w-10 m-auto mb-2 sm:w-16"
          src="src/assets/weather-icons/humidity.png"
          alt="Current weather icon."
        />
        <p>{{ weather.list[0].main.humidity }}%</p>
        <p class="text-xs sm:text-base">Humidity</p>
      </div>
      <div class="w-1/3 sm:w-32 sm:mx-3">
        <img
          class="w-10 m-auto mb-2 sm:w-16"
          src="src/assets/weather-icons/raindrops.png"
          alt="Current weather icon."
        />
        <p>{{ Math.floor(weather.list[0].pop * 100) }}%</p>
        <p class="text-xs sm:text-base">Chance of Rain</p>
      </div>
    </div>
  </div>
  <input
    v-model="query"
    @keypress="fetchWeather"
    placeholder="Search city..."
    id="query"
    type="text"
    autocomplete="off"
    class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
  />
  <Accordion
    v-if="weather.list !== undefined"
    v-for="weatherItem in weather.list"
    :title="weatherItem.dt_txt"
  >
    <img
      class="w-32 m-auto mb-4"
      :src="
        setWeatherIcon(weatherItem.weather[0].main, weatherItem.weather[0].icon)
      "
      alt="Current weather icon."
    />
    <p class="mb-3">Its {{ setWeatherName(weatherItem.weather[0].main) }}</p>
    <h3 class="text-5xl">
      {{ Math.round(weatherItem.main.temp) }}
      <span class="text-4xl text-blue-700 absolute">°</span>
    </h3>
  </Accordion>
</template>

<style>
.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
