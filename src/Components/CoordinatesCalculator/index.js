import React, { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import coordinatesData from "../../Utils/data.json";
import DatePicker from "react-datepicker";
import moment from "moment";
import calculateDistance from "../../Utils/calculateDistance";
import ReactGoogleMap from "../GoogleMap";

const CoordinatesCalculator = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isEndInputDisabled, setIsEndInputDisabled] = useState(true);
  const [calculatedDistance, setCalculatedDistance] = useState("");
  const [calculatedDistanceMiles, setCalculatedDistanceMiles] = useState("");
  const [calculatedDistanceNauticalMiles, setCalculatedDistanceNauticalMiles] = useState("");
  const [coordinates, setCoordinates] = useState(coordinatesData);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);

  function calculateDistanceFromMapHandler() {
    if (selectedLocations.length !== 2 && selectedLocations.length > 2) return;
    const lat = selectedLocations;
    const lng = selectedLocations;
    setCalculatedDistanceMiles(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng));
    setCalculatedDistance(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng, "K"));
    setCalculatedDistanceNauticalMiles(calculateDistance(lat[0].lat, lng[0].lng, lat[1].lat, lng[1].lng, "N"));
  }

  function resetCalculateDistanceState() {
    setCalculatedDistance("");
    setCalculatedDistanceMiles("");
    setCalculatedDistanceNauticalMiles("");
  }

  function resetState() {
    resetCalculateDistanceState();
    setSelectedLocations([]);
    // reset coordinates to map
    setCoordinates([]);
  }

  function searchCoordinatesHandler() {
    if (!startDate || !endDate) return;
    const dateFormatStr = "YYYY-MM-DD hh:mm:ss";
    const filteredCoordinates = coordinatesData.filter((coordinate) => {
      const coordinateCreateDate = moment(coordinate.date_created).format(dateFormatStr);
      const formattedStartDate = moment(startDate).format(dateFormatStr);
      const formattedEndDate = moment(endDate).format(dateFormatStr);
      const coordinateDisabledDate = moment(coordinate.date_disabled).format(dateFormatStr);
      return (
        (coordinateDisabledDate > formattedStartDate || coordinate.date_disabled === null) &&
        coordinateCreateDate >= formattedStartDate &&
        coordinateCreateDate <= formattedEndDate
      );
    });
    setCoordinates(filteredCoordinates);
  }

  // disable endDate input & clear input value if startDate input is empty
  useEffect(() => {
    if (!startDate) {
      setIsEndInputDisabled(true);
      setEndDate(null);
    } else {
      setIsEndInputDisabled(false);
    }
  }, [startDate, endDate]);

  // disable search button if startDate & endDate input is empty
  useEffect(() => {
    if (!startDate || !endDate) {
      setIsSearchButtonDisabled(true);
    } else {
      setIsSearchButtonDisabled(false);
    }
  }, [startDate, endDate]);

  // reset state on date change
  useEffect(() => {
    resetState();
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedLocations.length === 0) return;
    resetCalculateDistanceState();
  }, [selectedLocations]);

  return (
    <Container fluid>
      <Container>
        <section>
          <h1 className="text-center mt-5 mb-3">Calculate 🤖 Distance</h1>
        </section>

        <section className="w-100 mb-2 d-flex justify-content-center align-items-center ">
          <div className="w-100" data-bs-toggle="tooltip" data-bs-placement="top" title="Select start date">
            <DatePicker
              className="form-control d-block w-100 text-center rounded"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              placeholderText="Start Date"
              showTimeSelect
              timeIntervals={1}
              dateFormat="MMMM d, yyyy h:mm aa"
              isClearable
            />
          </div>
          <div className="mx-2 w-100" data-bs-toggle="tooltip" data-bs-placement="top" title="Select end date">
            <DatePicker
              className="form-control text-center rounded"
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
              placeholderText="End Date"
              showTimeSelect
              timeIntervals={1}
              dateFormat="MMMM d, yyyy h:mm aa"
              disabled={isEndInputDisabled}
              isClearable
            />
          </div>
          <Button
            role="button"
            variant="primary"
            data-testid="searchbtn"
            onClick={searchCoordinatesHandler}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            disabled={isSearchButtonDisabled}
            title="Search coordinates">
            Search
          </Button>
        </section>
      </Container>

      <section className="row">
        <div className={`${selectedLocations.length ? "col-8" : "col-12"}`}>
          <ReactGoogleMap
            coordinatesState={[coordinates, setCoordinates]}
            selectedLocationsState={[selectedLocations, setSelectedLocations]}
          />
        </div>
        <div className="col-4">
          {selectedLocations.length ? (
            <section className="mt-2 mb-5">
              <Card style={{ width: "100%" }} className="text-start bg-light mx-auto mt-2">
                <Card.Body>
                  <Card.Title className="text-center">Selected Coordinates</Card.Title>
                  {selectedLocations.map((location, idx) => (
                    <div className="card-text" key={idx}>
                      <p>Location {idx + 1}:</p>
                      <ul>
                        <li>lat {location.lat}</li>
                        <li>lng {location.lng}</li>
                      </ul>
                    </div>
                  ))}
                  {!!calculatedDistance ? (
                    <>
                      <Card.Title className="text-center mb-3">Calculated Distance</Card.Title>
                      <div className="card-text">
                        <ul>
                          <li>Miles: {calculatedDistanceMiles}</li>
                          <li>Kilometers: {calculatedDistance}</li>
                          <li>Nautical miles: {calculatedDistanceNauticalMiles}</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </Card.Body>
              </Card>
              <div className="text-center my-2">
                <Button
                  role="button"
                  variant="success"
                  onClick={() => calculateDistanceFromMapHandler()}
                  data-testid="calculateCoordinateDistanceButton"
                  disabled={selectedLocations.length === 2 ? false : true}>
                  Calculate Coordinates Distance
                </Button>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </Container>
  );
};

export default CoordinatesCalculator;
