import * as actions from "../actions";

const initialState = {
  loading: false,
  data: []
};

const startLoading = (state, action) => {
  return { ...state, loading: true };
};

const droneLocationsReceived = (state, action) => {
  const { data } = action;
  if (!data) return state;
  return {
    ...state,
    loading: false,
    data
  };
};

const handlers = {
  [actions.FETCH_DRONE_LOCATIONS]: startLoading,
  [actions.DRONE_LOCATIONS_RECEIVED]: droneLocationsReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
