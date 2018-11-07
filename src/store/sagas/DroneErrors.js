import { takeEvery, call } from "redux-saga/effects";
import * as actions from "../actions";
import { toast } from "react-toastify";

function* droneErrorReceived(action) {
  yield call(toast.error, `Maps Error Received: ${action.code}`);
}

function* watchDroneError() {
  yield takeEvery(actions.DRONE_LOCATIONS_FAILED, droneErrorReceived);
}

export default [watchDroneError];
