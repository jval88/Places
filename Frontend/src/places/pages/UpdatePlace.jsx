import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { DUMMY_PLACES } from "./UserPlaces";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";

import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((place) => placeId === place.id);

  useEffect(() => {
    identifiedPlace &&
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
  }, [setFormData, identifiedPlace]);

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); //Send this to backend!
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Place Not Found!</h2>
        </Card>
      </div>
    );
  }
  return (
    <React.Fragment>
      {formState.inputs.title.value ? (
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialIsValid={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={formState.inputs.description.value}
            initialIsValid={formState.inputs.title.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      ) : (
        <div className="center">
          <h2>Loading...</h2>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
