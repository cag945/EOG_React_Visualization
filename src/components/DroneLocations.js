//obsolete - for reference purposes only
import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import LinearProgress from "@material-ui/core/LinearProgress";

class DroneLocations extends Component {
  componentDidMount() {
    this.props.onLoad();
  }
  render() {
    const {
      loading,
      data
    } = this.props;
    if (loading) return <LinearProgress />;
    return (
        <React.Fragment>
        {data.map(item => {
            return <div key="timestamp">{item.latitude}, {item.longitude}</div>
        })}
        </React.Fragment>
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
