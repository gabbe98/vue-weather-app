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
      selectedDropdown: "",
      dropdownOptions: ["Stockholm", "Beijing", "New York", "Los Angeles"],
      isSidebarOpen: false,
      sidebarDimmer: true,
      sidebarRight: false,
      dayDates: [],
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
    fetchWeather(event, savedQuery) {
      if (event.key == "Enter" && !savedQuery) {
        fetch(
          `${this.url_base}forecast?q=${this.query}&APPID=${this.api_key}&units=metric`
        )
          .then((response) => {
            return response.json();
          })
          .then(this.weatherResult)
          .then(() => {
            if (!this.isSidebarOpen) {
              return;
            }
            this.toggleSidebar();
            this.selectedDropdown = this.query;
          });
      } else if (savedQuery) {
        fetch(
          `${this.url_base}forecast?q=${savedQuery}&APPID=${this.api_key}&units=metric`
        )
          .then((response) => {
            return response.json();
          })
          .then(this.weatherResult)
          .then(() => {
            if (!this.isSidebarOpen) {
              return;
            }
            this.toggleSidebar();
            this.selectedDropdown = savedQuery;
          });
      }
    },
    locationResult(result) {
      this.currentLocation = result[0].name;
      this.query = this.selectedDropdown = this.currentLocation;
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
    parseDayString(date) {
      let unixDate = Date.parse(date);
      return new Date(unixDate).toString().slice(0, 16);
    },
    checkIfNewDay(date) {
      let unixDate = Date.parse(date);
      let newDate = new Date(unixDate).toString();

      if (newDate.slice(16, 24) === "00:00:00") {
        return true;
      } else {
        return false;
      }
    },
    adjustForTimezone(date, timezone) {
      let unixDate = Date.parse(date);
      let newDate = new Date(unixDate).toString();
      let timezoneHours = Number(timezone / 3600);

      let formatDate = "";
      if (timezoneHours >= 0) {
        return (formatDate = newDate.slice(16, 25) + "UTC+" + timezoneHours);
      } else if (timezoneHours < 0) {
        return (formatDate = newDate.slice(16, 25) + "UTC" + timezoneHours);
      }
    },
    setDropdownOption(option) {
      this.selectedDropdown = option;
      this.isDropdownExpanded = false;
    },
    addDropdownOption() {
      if (!this.dropdownOptions.includes(this.query)) {
        return this.dropdownOptions.push(this.query);
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<template>
  <header class="flex justify-between items-center mb-4 sm:mb-16">
    <button
      @click.prevent="toggleSidebar()"
      class="h-6 w-6 rounded-full shadow appearance-none p-5 flex items-center justify-center border dark:border-white dark:text-white hover:bg-slate-200 dark:hover:bg-slate-900 dark:hover:bg-slate-900"
    >
      <fa icon="fa-solid fa-bars" class="h-5 w-5" />
    </button>
    <div class="relative text-lg">
      <button
        class="w-40 flex items-center justify-between px-3 py-2 shadow appearance-none border dark:border-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-900 dark:hover:bg-slate-900"
        @click="isDropdownExpanded = !isDropdownExpanded"
        @blur="isDropdownExpanded = false"
      >
        <fa icon="fa-solid fa-map-marker-alt" class="h-4 w-4 mr-2" />
        <span class="w-4/5 truncate capitalize">{{ selectedDropdown }}</span>
        <fa icon="fa-solid fa-chevron-down" class="h-4 w-4 ml-2" />
      </button>
      <transition
        enter-active-class="transform transition duration-500"
        enter-class="-translate-y-1/2 scale-y-0 opacity-0"
        enter-to-class="translate-y-0 scale-y-100 opacity-100"
        leave-active-class="transform transition duration-300"
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
            class="truncate cursor-pointer px-3 py-2 transition-colors duration-300 hover:bg-slate-200 dark:hover:bg-slate-900 dark:hover:bg-slate-900 dark:hover:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-900 dark:hover:bg-slate-900"
            @mousedown.prevent="
              setDropdownOption(option);
              fetchWeather($event, option);
            "
          >
            {{ option }}
          </li>
        </ul>
      </transition>
    </div>
    <button
      class="modebtn rounded-full shadow appearance-none p-5 flex items-center justify-center border h-6 w-6 dark:text-white dark:border-white hover:bg-slate-200 dark:hover:bg-slate-900 dark:hover:bg-slate-900"
      @click="toggleDark()"
    >
      <fa v-if="isDark" icon="fa-solid fa-sun" class="h-5 w-5" />
      <fa v-if="!isDark" icon="fa-solid fa-moon" class="h-5 w-5" />
    </button>
  </header>

  <div
    class="fixed inset-0 flex z-40"
    :class="[isSidebarOpen ? 'w-full' : 'w-0']"
  >
    <div
      class="absolute flex top-0 h-screen z-20"
      :class="[sidebarRight ? 'right-0 flex-row' : 'left-0 flex-row-reverse']"
    >
      <button
        @click.prevent="toggleSidebar()"
        class="w-6 h-40 p-1 my-auto rounded shadow appearance-none text-center focus:outline-none duration-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-white"
      >
        <span
          :class="[isSidebarOpen ? 'rotate-180' : '']"
          class="block transform origin-center flex items-center justify-center"
        >
          <fa icon="fa-solid fa-chevron-right" class="h-4 w-4" />
        </span>
      </button>

      <div
        ref="content"
        class="transition-all duration-700 overflow-hidden flex items-center text-left text-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-slate-50"
        :class="[isSidebarOpen ? 'max-w-lg' : 'max-w-0']"
      >
        <div class="w-80 text-xl p-6">
          <button
            @click="toggleSidebar()"
            class="h-6 w-6 absolute top-5 right-12 rounded-full shadow appearance-none p-5 flex items-center justify-center border dark:border-white hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            <fa icon="fa-solid fa-xmark" class="h-5 w-5" />
          </button>
          <label for="query">Search for a new city</label>
          <input
            v-model="query"
            @keypress="fetchWeather($event)"
            placeholder="City name"
            id="query"
            type="text"
            autocomplete="off"
            class="w-64 border rounded p-3 mb-3 leading-tight focus:outline-none focus:shadow-outline shadow appearance-none text-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-900"
          />
          <button
            class="p-3 my-auto w-64 rounded shadow appearance-none flex items-center justify-center focus:outline-none duration-300 text-slate-800 dark:text-slate-50 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-900 border dark:border-white"
            @click.prevent="addDropdownOption"
          >
            Add to favorites
            <fa icon="fa-solid fa-plus" class="h-4 w-4 ml-2" />
          </button>
          <slot></slot>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="sidebarDimmer && isSidebarOpen"
        @click="toggleSidebar()"
        class="flex-1 bg-gray-400 bg-opacity-75 active:outline-none z-10"
      />
    </transition>
  </div>

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
      <h1 class="mb-6 text-xl text-left sm:mb-10">Current Report</h1>
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
  <h2 v-if="weather.list !== undefined" class="text-left text-2xl py-6 mt-2">
    {{ parseDayString(weather.list[0].dt_txt) }}
  </h2>
  <template
    v-for="weatherItem in weather.list"
    v-if="weather.list !== undefined"
  >
    <h2
      v-if="checkIfNewDay(weatherItem.dt_txt)"
      class="text-left text-2xl py-6 mt-2"
    >
      {{ parseDayString(weatherItem.dt_txt) }}
    </h2>
    <Accordion
      :title="adjustForTimezone(weatherItem.dt_txt, weather.city.timezone)"
    >
      <div>
        <img
          class="w-32 mb-4 m-auto"
          :src="
            setWeatherIcon(
              weatherItem.weather[0].main,
              weatherItem.weather[0].icon
            )
          "
          alt="Current weather icon."
        />
        <p class="mb-3">
          Its {{ setWeatherName(weatherItem.weather[0].main) }}
        </p>
        <h3 class="text-5xl mb-10">
          {{ Math.round(weatherItem.main.temp) }}
          <span class="text-4xl text-blue-700 absolute">°</span>
        </h3>
      </div>
      <div class="flex justify-center">
        <div class="w-1/3 sm:w-32 sm:mx-3">
          <img
            class="w-10 m-auto mb-2 sm:w-16"
            src="src/assets/weather-icons/wind.png"
            alt="Current weather icon."
          />
          <p>{{ weatherItem.wind.speed }} m/s</p>
          <p class="text-xs sm:text-base">Wind Speed</p>
        </div>
        <div class="w-1/3 sm:w-32 sm:mx-3">
          <img
            class="w-10 m-auto mb-2 sm:w-16"
            src="src/assets/weather-icons/humidity.png"
            alt="Current weather icon."
          />
          <p>{{ weatherItem.main.humidity }}%</p>
          <p class="text-xs sm:text-base">Humidity</p>
        </div>
        <div class="w-1/3 sm:w-32 sm:mx-3">
          <img
            class="w-10 m-auto mb-2 sm:w-16"
            src="src/assets/weather-icons/raindrops.png"
            alt="Current weather icon."
          />
          <p>{{ Math.floor(weatherItem.pop * 100) }}%</p>
          <p class="text-xs sm:text-base">Chance of Rain</p>
        </div>
      </div>
    </Accordion>
  </template>
</template>

<style>
.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>

<!-- TODO: -->
<!-- Make some form validation -->
<!-- Use local- & sessionstorage for favorited cities -->
<!-- Refactor more things down into components instead of using app.vue only, probably needs some state management ex. Vuex or Pinia  -->
<!-- Change everything from the options API to Composition API  -->
<!-- Make the code more DRY! -->
