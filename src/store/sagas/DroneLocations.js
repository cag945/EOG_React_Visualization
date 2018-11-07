import { takeEvery, call, put, cancel, all } from "redux-saga/effects";
import { delay } from "redux-saga";
import API from "../api";
import * as actions from "../actions";

/*
  1. The weather service requires us to make a search by lat/lng to find its
  weather ID.
  2. We then use that weather ID to get the weather.

  This process is pretty well defined here with a saga.

  call invokes a method
  put dispatches an action
  takeEvery watches actions and executes a function

  Also -- the `*` in function is important; turns it into a "generator"

*/

const toF = c => (c * 9) / 5 + 32;

function* watchFetchDroneLocations() {
  while(true)
  {
    try
    {
      const { error, data } = yield call(API.listAllDroneLocations);
      if (error){
        console.log({ error })
        yield put({ type: actions.API_ERROR, code: error.code });
        yield cancel();
        return;
      }
      const droneLocations = data ? data : false;
      if (!droneLocations){
        console.log({ error })
        yield put({ type: actions.API_ERROR });
        yield cancel();
        return;
      }
      var droneLocationsWithTemp = yield all(droneLocations.data.map(item => call(getWeatherData, item)));
      yield put({ type: actions.DRONE_LOCATIONS_RECEIVED, data: droneLocationsWithTemp });
      yield call(delay, 4000);
    }
    catch (err)
    {
      console.log(err);
      yield put({ type: actions.DRONE_LOCATIONS_FAILED, err });
    }
  }
  
}

function* getWeatherData(item) {
  const { latLngError, latLngData } = yield call(API.findLocationByLatLng, item.latitude, item.longitude);
  if (latLngError){
      yield put({ type: actions.API_ERROR, code: latLngError.code });
      yield cancel();
      return item;
  }
  const { weatherError, weatherData } = yield call(API.findWeatherbyId, latLngData[0].woeid);
  if (weatherError){
      yield put({ type: actions.API_ERROR, code: weatherError.code });
      yield cancel();
      return item;
  }
  item.the_temp_F = toF(weatherData.consolidated_weather[0].the_temp).toFixed(3);
  return item;
}


function* watchAppLoad() {
  yield all([
    takeEvery(actions.FETCH_DRONE_LOCATIONS, watchFetchDroneLocations)
  ]);
}

export default [watchAppLoad];
