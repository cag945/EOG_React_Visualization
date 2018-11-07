import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import LinearProgress from "@material-ui/core/LinearProgress";

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
                }
            });
        },
    }),
    withScriptjs,
    withGoogleMap
)(props => (
    <GoogleMap defaultZoom={6} defaultCenter={{ lat: 29.7604, lng: -95.3698 }}>
        {
            props.data.map(item => {
                return (

                        <Marker
                            key={item.timestamp}
                            position={{ lat: item.latitude, lng: item.longitude }}
                            draggable={false}
                            ref={props.onMarkerMounted}
                            onPositionChanged={props.onPositionChanged}
                            >
                            {
                                <InfoWindow>
                                    <div className="marker-text">{item.the_temp_F}</div>
                                </InfoWindow>
                            }
                        </Marker>
                )
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
    const {
      loading,
      data
    } = this.props;
    if (loading) return <LinearProgress />;
    console.log("Data: " + {data});
    return (
        <React.Fragment>
            <MyMapComponent key={data.timestamp} data={data} />
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