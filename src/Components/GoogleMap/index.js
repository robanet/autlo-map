import React from "react";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow, Polyline } from "@react-google-maps/api";

const ReactGoogleMap = ({ coordinatesState, selectedLocationsState }) => {
  const [coordinates, setCoordinates] = coordinatesState;
  const [selectedLocations, setSelectedLocations] = selectedLocationsState;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_KEY_GOOGLE,
  });

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    coordinates.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  }, []);

  const handleSelectedLocations = (marker) => {
    if (selectedLocations.length >= 2) {
      alert("You select only two coordinates at a time!");
      return;
    }
    if (selectedLocations.some((selectedLocations) => selectedLocations.id === marker.id)) {
      alert("You already selected the coordinates.");
      return;
    }
    setSelectedLocations([...selectedLocations, marker]);
  };

  const polylinePaths = selectedLocations.length === 2 ? selectedLocations.map(({ lat, lng }) => ({ lat, lng })) : [];

  const polylinePathsStyle = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: polylinePaths,
    zIndex: 1,
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        maxHeight: "800px",
        height: "100vh",
      }}
      zoom={16}
      onLoad={onLoad}>
      {/* Child components, such as markers, info windows, etc. */}
      {coordinates.map(({ id, date_created, date_disabled, lat, lng }) => (
        <Marker
          key={id}
          position={{ lat, lng }}
          onClick={(e) => {
            handleSelectedLocations({ id, date_created, date_disabled, lat, lng });
          }}>
          {selectedLocations.length
            ? selectedLocations.map((selectedLocationsIdObj) =>
                selectedLocationsIdObj?.id === id ? (
                  <InfoWindow
                    onCloseClick={() => {
                      const filteredMarker = selectedLocations.filter((markerFilter) => markerFilter?.id !== selectedLocationsIdObj?.id);
                      setSelectedLocations(filteredMarker);
                    }}>
                    <div>{`Location ${selectedLocationsIdObj?.id}`}</div>
                  </InfoWindow>
                ) : null
              )
            : null}
        </Marker>
      ))}
      {polylinePaths.length ? <Polyline path={polylinePaths} options={polylinePathsStyle} /> : null}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default ReactGoogleMap;
