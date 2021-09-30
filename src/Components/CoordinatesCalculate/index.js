import React, { useEffect, useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import coordinatesData from './../../Utils/data.json'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import calculateDistance from './../../Utils/calculateDistance'

const CoordinatesCalculate = () => {
  const [startDate, setStartDate] = useState(null)
  const [matchedCoordinates, setMatchedCoordinates] = useState([])
  const [coordinatesNotFound, setCoordinatesNotFound] = useState('')
  const [selectedCoordinates, setSelectedCoordinates] = useState([])
  const [calculatedDistance, setCalculatedDistance] = useState('')
  const [calculatedDistanceMiles, setCalculatedDistanceMiles] = useState('')
  const [calculatedDistanceNauticalMiles, setCalculatedDistanceNauticalMiles] = useState('')

  const searchCoordinatesHandler = () => {
    if (startDate === null) return null
    const matchedCoordinates = coordinatesData.filter(
      (data) => moment(data.date_created).format('YYYY-MM-DD') === moment(startDate).format('YYYY-MM-DD')
    )
    setMatchedCoordinates(matchedCoordinates)
    if (matchedCoordinates.length) {
      setCoordinatesNotFound('')
    } else {
      setCoordinatesNotFound('Coordinates not found!')
    }
  }

  const addCoordinatesHandler = (coordinateData) => {
    if (coordinateData?.id === undefined) return null
    if (selectedCoordinates.length >= 2) {
      alert('You select only two coordinates at a time!')
      return null
    }
    if (selectedCoordinates.some((coordinate) => coordinate.id === coordinateData.id)) {
      alert('You already selected the coordinates.')
      return null
    }
    setSelectedCoordinates([...selectedCoordinates, coordinateData])
  }

  const removeCoordinatesHandler = (coordinateData) => {
    const filteredCoordinates = selectedCoordinates.filter((coordinate) => coordinate.id !== coordinateData.id)
    setSelectedCoordinates(filteredCoordinates)
  }

  const calculateDistanceHandler = () => {
    if (selectedCoordinates.length !== 2 && selectedCoordinates.length > 2) return null
    const lat = selectedCoordinates
    const lng = selectedCoordinates
    setCalculatedDistanceMiles(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng))
    setCalculatedDistance(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng, 'K'))
    setCalculatedDistanceNauticalMiles(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng, 'N'))
  }

  useEffect(() => {
    console.log(matchedCoordinates)
  })
  return (
    <Container>
      <section>
        <h1 className='text-center mt-5'>Calculate 🤖 Coordinates</h1>
      </section>

      <section className='text-center'>
        <DatePicker
          className='form-control mt-3 rounded'
          selected={startDate}
          onChange={(date) => {
            setStartDate(date)
            // reset not coordinates not found error when startDate === null
            setCoordinatesNotFound('')
            // reset matched coordinates
            setMatchedCoordinates([])
            // reset selected coordinates
            setSelectedCoordinates([])
            // reset calculated coordinates
            setCalculatedDistance('')
          }}
          placeholderText='Select a date'
        />
        <Button role='button' variant='primary' className='mt-2 rounded' onClick={searchCoordinatesHandler} disabled={!startDate}>
          Search Coordinates
        </Button>
      </section>

      {!!coordinatesNotFound ? (
        <section>
          <Card style={{ maxWidth: '50rem' }} className='text-center bg-light mx-auto mt-5'>
            <Card.Body>
              <Card.Text className='text-danger'>{coordinatesNotFound}</Card.Text>
            </Card.Body>
          </Card>
        </section>
      ) : null}

      {matchedCoordinates.length ? (
        <section>
          <Card style={{ maxWidth: '50rem' }} className='text-center bg-light mx-auto mt-5'>
            <Card.Body>
              <Card.Title>Available Coordinates</Card.Title>
              {matchedCoordinates.map((data) => {
                return (
                  <div className='d-flex justify-content-center align-items-center py-2' key={data.id}>
                    <Card.Text className='m-0 me-2'>id: {data?.id || ''}</Card.Text>
                    <Card.Text className='m-0 me-2'>lng: {data?.lng || ''}</Card.Text>
                    <Card.Text className='m-0 me-2'>lat: {data?.lat || ''}</Card.Text>
                    <Button role='button' variant='info' onClick={() => addCoordinatesHandler(data)}>
                      Add
                    </Button>
                  </div>
                )
              })}
            </Card.Body>
          </Card>
        </section>
      ) : null}

      {selectedCoordinates.length ? (
        <>
          <section>
            <Card style={{ maxWidth: '50rem' }} className='text-center bg-light mx-auto mt-5'>
              <Card.Body>
                <Card.Title>Selected Coordinates</Card.Title>
                {selectedCoordinates.map((data) => {
                  return (
                    <div className='d-flex justify-content-center align-items-center py-2' key={data.id}>
                      <Card.Text className='m-0 me-2'>id: {data?.id || ''}</Card.Text>
                      <Card.Text className='m-0 me-2'>lng: {data?.lng || ''}</Card.Text>
                      <Card.Text className='m-0 me-2'>lat: {data?.lat || ''}</Card.Text>
                      <Button role='button' variant='danger' onClick={() => removeCoordinatesHandler(data)}>
                        Remove
                      </Button>
                    </div>
                  )
                })}
              </Card.Body>
            </Card>
          </section>
          {selectedCoordinates.length === 2 ? (
            <section className='text-center mt-2'>
              <Button role='button' variant='success' onClick={() => calculateDistanceHandler()}>
                Calculate Coordinates
              </Button>
            </section>
          ) : null}
        </>
      ) : null}

      {!!calculatedDistance ? (
        <section className='text-center mt-2'>
          <Card style={{ maxWidth: '50rem' }} className='text-center bg-light mx-auto mt-5'>
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

export default CoordinatesCalculate
