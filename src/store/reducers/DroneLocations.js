import * as actions from "../actions";

const initialState = {
  loading: false,
  data: {}
};

const startLoading = (state, action) => {
  // console.log("I am loading");
  return { ...state, loading: true };
};

const droneLocationsReceived = (state, action) => {
  // console.log("drone locations received");
  const { data } = action.data;
  const { error } = "";
  if (!data) return state;
  // console.log(data.data);

  return {
    ...state,
    loading: false,
    data,
    error
  };
};

const droneLocationsFailed = (state, action) => {
  const { data } = action.data;
  const { error } = action.error;
  return {
    ...state,
    loading: false,
    data,
    error
  }
}

const handlers = {
  [actions.FETCH_DRONE_LOCATIONS]: startLoading,
  [actions.DRONE_LOCATIONS_RECEIVED]: droneLocationsReceived,
  [actions.DRONE_LOCATIONS_FAILED]: droneLocationsFailed
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  // console.log("Action Type is in DroneLocations: " + action.type);
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
