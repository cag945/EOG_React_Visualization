import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";

class DroneLocations extends Component {
  componentDidMount() {
    this.props.onLoad();
  }
  render() {
    // console.log("I'm getting to the render method");
    const {
      loading,
      data
    } = this.props;
    if (loading) return <LinearProgress />;
    return (
        <div>
        {Object.keys(data).map(item => {
            // console.log(item);
            return <div key="timestamp">{data[item].latitude}, {data[item].longitude}</div>
        })}
        </div>
        // <h1>{locationData.data[0].timestamp}</h1>
    );
  }
}

const mapState = (state, ownProps) => {
  const {
    loading,
    data
  } = state.droneLocations;
  return {
    loading,
    data
  };
};

const mapDispatch = dispatch => ({
  onLoad: () =>
    dispatch({
      type: actions.FETCH_DRONE_LOCATIONS
    })
});

export default connect(
  mapState,
  mapDispatch
)(DroneLocations);
