import WeatherSagas from "./Weather";
import DroneLocationSagas from "./DroneLocations";
import ApiErrors from "./ApiErrors";

export default [...ApiErrors, ...WeatherSagas, ...DroneLocationSagas];
