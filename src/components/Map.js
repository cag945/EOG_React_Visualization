import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";

const MyMapComponent = compose(
    withProps({
        googleMapURL:
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyCbEkAz94AIPAffvPGA-u72EvGgsH7MXWc&libraries=geometry,drawing,places',
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `800px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {};

            this.setState({
                position: null,
                onMarkerMounted: ref => {
                    refs.marker = ref;
                },

                onPositionChanged: () => {
                    const position = refs.marker.getPosition();
                    // console.log(position.toString());
                },
            });
        },
    }),
    withScriptjs,
    withGoogleMap
)(props => (
    <GoogleMap defaultZoom={6} defaultCenter={{ lat: 29.7604, lng: -95.3698 }}>
        {
            Object.keys(props.data).map(item => {
            if (props.data[item].accuracy > 50)
            {
                return (

                        <Marker
                            position={{ lat: props.data[item].latitude, lng: props.data[item].longitude }}
                            draggable={false}
                            ref={props.onMarkerMounted}
                            onPositionChanged={props.onPositionChanged}
                            >
                            {
                                <InfoWindow>
                                <div className="marker-text">{props.data[item].the_temp_F}</div>
                                </InfoWindow>
                            }
                        </Marker>
                )
            }
        })}
    </GoogleMap>
));


class DroneLocations extends Component {
    state = {
    };
    
  componentDidMount() {
    this.props.onLoad();
  }
  render() {
    // console.log("I'm getting to the render method");
    const {
      loading,
      data,
      error
    } = this.props;
    if (loading) return <LinearProgress />;
    if (error != null) return (<h4>An error has occurred</h4>)
    return (
        <div>
            <div>
                <MyMapComponent data={data} />
            </div>
        </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const {
    loading,
    data,
    error
  } = state.droneLocations;
  return {
    loading,
    data,
    error
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