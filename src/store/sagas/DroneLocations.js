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
      // console.log("I am past the api");
      if (error){
        console.log({ error })
        yield put({ type: actions.API_ERROR, code: error.code });
        yield cancel();
        return;
      }
      const droneLocations = data.data ? data.data : false;
      if (!droneLocations){
        console.log({ error })
        yield put({ type: actions.API_ERROR });
        yield cancel();
        return;
      }
    //   console.log(droneLocations);
    
      for(let i=0; i<Object.keys(droneLocations).length; i++)
      {
        const { error2, data2 } = yield call(API.findLocationByLatLng, droneLocations[i].latitude, droneLocations[i].longitude);
        if (error2){
            yield put({ type: actions.API_ERROR, code: error2.code });
            yield cancel();
            return;
        }
        // console.log("woeid: " + data2[0].woeid);
    
        const { error3, data3 } = yield call(API.findWeatherbyId, data2[0].woeid);
        if (error3){
            yield put({ type: actions.API_ERROR, code: error3.code });
            yield cancel();
            return;
        }
        // console.log("temperature: " + data3.consolidated_weather[0].the_temp);
    
        data.data[i].the_temp_F = toF(data3.consolidated_weather[0].the_temp).toFixed(3);
    
        // console.log("the_temp_F: " + data.data[i].the_temp_F);
      }
      yield put({ type: actions.DRONE_LOCATIONS_RECEIVED, data });
      yield call(delay, 4000);
    }
    catch (err)
    {
      yield put({ type: actions.DRONE_LOCATIONS_FAILED, err });
    }
  }
  
}

function* watchAppLoad() {
  console.log("Drone Locations is loading");
  yield all([
    takeEvery(actions.FETCH_DRONE_LOCATIONS, watchFetchDroneLocations)
  ]);
}

export default [watchAppLoad];
