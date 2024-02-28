const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "EMP. State Building",
    description: "One of the tallest buildings in the world",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484445,
      lng: -73.9882447,
    },
    creator: "u2",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const foundPlace = DUMMY_PLACES.find((place) => {
    return place.id === placeId;
  });
  if (!foundPlace) {
    return next(
      new HttpError("Could not find a place for the provided place id.", 404)
    );
  }
  res.json({ place: foundPlace });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const userPlaces = DUMMY_PLACES.filter((place) => {
    return place.creator === userId;
  });
  if (userPlaces.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  console.log(userPlaces.length);
  res.json({ userPlaces });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = {
    id: uuidv4(),
    title,
    description,
    address,
    creator,
    location: coordinates,
  };
  DUMMY_PLACES.push(newPlace);
  res.status(201).json({ place: newPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;
  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => {
      return place.id === placeId;
    }),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => {
    return place.id === placeId;
  });
  if (placeIndex === -1) {
    return next(
      new HttpError("Could not find a place for the provided place id.", 404)
    );
  }
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((place) => place.id === placeId)) {
    return next(
      new HttpError("Could not find a place for the provided place id.", 404)
    );
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => {
    return place.id !== placeId;
  });

  res.status(200).json({ message: `Deleted place ${placeId}` });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
