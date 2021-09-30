import React, { useEffect, useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import coordinatesData from '../../Utils/data.json'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import calculateDistance from '../../Utils/calculateDistance'
import ReactGoogleMap from '../GoogleMap'
import styles from './style.module.css'

const CoordinatesCalculator = () => {
  const [startDate, setStartDate] = useState(null)
  const [calculatedDistance, setCalculatedDistance] = useState('')
  const [calculatedDistanceMiles, setCalculatedDistanceMiles] = useState('')
  const [calculatedDistanceNauticalMiles, setCalculatedDistanceNauticalMiles] = useState('')
  const [coordinates, setCoordinates] = useState(coordinatesData)
  const [activeMarker, setActiveMarker] = useState([])

  const searchCoordinatesHandler = () => {
    if (startDate === null) return null
    const matchedCoordinates = coordinatesData.filter(
      (data) => moment(data.date_created).format('YYYY-MM-DD') === moment(startDate).format('YYYY-MM-DD')
    )
    // set matched coordinates to map
    setCoordinates(matchedCoordinates)

    if (!matchedCoordinates.length) {
      setCoordinates([])
      resetStateOnDateChange()
      alert('Coordinates not found!')
    }
  }

  const calculateDistanceFromMapHandler = () => {
    if (activeMarker.length !== 2 && activeMarker.length > 2) return
    const lat = activeMarker
    const lng = activeMarker
    setCalculatedDistanceMiles(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng))
    setCalculatedDistance(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng, 'K'))
    setCalculatedDistanceNauticalMiles(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng, 'N'))
  }

  function resetStateOnDateChange() {
    // reset calculated coordinates
    setCalculatedDistance('')
    setCalculatedDistanceMiles('')
    setCalculatedDistanceNauticalMiles('')
    setActiveMarker([])
    // reset coordinates to map
    // setCoordinates([])
  }

  useEffect(() => {
    console.log('activeMarker: ', activeMarker)
  })
  return (
    <Container>
      <section>
        <h1 className='text-center mt-5 mb-3'>Calculate 🤖 Coordinates</h1>
      </section>

      <section className='text-center d-flex justify-content-center align-items-center mb-2'>
        <DatePicker
          className={`form-control rounded ${styles.input_custom_style}`}
          selected={startDate}
          onChange={(date) => {
            setStartDate(date)
            resetStateOnDateChange()
          }}
          style={{ height: '51px' }}
          placeholderText='Select a date'
        />
        <Button
          role='button'
          variant='primary'
          className={`ms-2 rounded ${styles.button_custom_style}`}
          onClick={searchCoordinatesHandler}
          disabled={!startDate}>
          Search
        </Button>
      </section>

      <section>
        <ReactGoogleMap coordinatesState={[coordinates, setCoordinates]} activeMarkerState={[activeMarker, setActiveMarker]} />
        {activeMarker.length === 2 ? (
          <div className='text-center my-2'>
            <Button role='button' variant='success' onClick={() => calculateDistanceFromMapHandler()}>
              Calculate Coordinates
            </Button>
          </div>
        ) : null}
      </section>

      {!!calculatedDistance && activeMarker.length === 2 ? (
        <section className='text-center mt-2 mb-5'>
          <Card style={{ width: '100%' }} className='text-center bg-light mx-auto mt-2'>
            <Card.Body>
              <Card.Title>Coordinates Distance</Card.Title>
              <Card.Text>Miles: {calculatedDistanceMiles}</Card.Text>
              <Card.Text>Kilometers: {calculatedDistance}</Card.Text>
              <Card.Text>Nautical miles: {calculatedDistanceNauticalMiles}</Card.Text>
            </Card.Body>
          </Card>
        </section>
      ) : null}
    </Container>
  )
}

export default CoordinatesCalculator
