import React, { useCallback, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader, InfoWindow, Polyline } from '@react-google-maps/api'

const ReactGoogleMap = ({ coordinatesState, activeMarkerState }) => {
  const [coordinates, setCoordinates] = coordinatesState
  const [activeMarker, setActiveMarker] = activeMarkerState
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_KEY_GOOGLE,
  })
  const [map, setMap] = useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds()
    coordinates.forEach(({ lat, lng }) => bounds.extend({ lat, lng }))
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const markerOnClick = (marker) => {
    // console.log('marker onclick: ', marker)
  }

  const handleActiveMarker = (marker) => {
    if (activeMarker.length >= 2) {
      alert('You select only two coordinates at a time!')
      return
    }
    if (activeMarker.some((activeMarker) => activeMarker.id === marker.id)) {
      alert('You already selected the coordinates.')
      return
    }
    setActiveMarker([...activeMarker, marker])
  }

  const polylinePaths = activeMarker.length === 2 ? activeMarker.map(({ lat, lng }) => ({ lat, lng })) : []

  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: polylinePaths,
    zIndex: 1,
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '700px',
      }}
      zoom={16}
      onLoad={onLoad}
      onUnmount={onUnmount}>
      {/* Child components, such as markers, info windows, etc. */}
      {coordinates.map(({ id, date_created, date_disabled, lat, lng }) => (
        <Marker
          key={id}
          position={{ lat, lng }}
          onClick={(e) => {
            handleActiveMarker({ id, date_created, date_disabled, lat, lng })
            markerOnClick(e)
          }}>
          {activeMarker.length
            ? activeMarker.map((activeMarkerIdObj) =>
                activeMarkerIdObj?.id === id ? (
                  <InfoWindow
                    onCloseClick={() => {
                      const filteredMarker = activeMarker.filter((markerFilter) => markerFilter?.id !== activeMarkerIdObj?.id)
                      setActiveMarker(filteredMarker)
                    }}>
                    <div>{`Location ${activeMarkerIdObj?.id}`}</div>
                  </InfoWindow>
                ) : null
              )
            : null}
        </Marker>
      ))}
      {polylinePaths.length ? <Polyline path={polylinePaths} options={options} /> : null}
    </GoogleMap>
  ) : (
    <></>
  )
}

export default ReactGoogleMap
