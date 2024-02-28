import React, { useContext, useState } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./Authenticate.css";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";

const Authenticate = () => {
  const auth = useContext(AuthContext);
  const [loginSwitch, setLoginSwitch] = useState(false);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },

      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = (event) => {
    event.preventDefault();
    switch (loginSwitch) {
      case true:
        console.log(formState.inputs);
        console.log("Create User in Backend");
        break;
      case false:
        console.log(formState.inputs);
        console.log("Log User in if exists in Backend");
        auth.login();
        break;
      default:
    }
  };

  const handleLoginSwitch = () => {
    if (loginSwitch) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setLoginSwitch((prevMode) => !prevMode);
  };

  return (
    <Card className="authentication">
      <h2 className="authentication__header center">
        {loginSwitch ? "Create User" : "Login Required"}
      </h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {loginSwitch && (
          <Input
            id="name"
            element="input"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter a Username."
            onInput={inputHandler}
          />
        )}
        <Input
          id="email"
          element="input"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="password"
          element="input"
          type="text"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(10)]}
          errorText="Please enter a valid password (at least 10 characters)."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {loginSwitch ? "CREATE USER" : "LOG IN"}
        </Button>
      </form>
      <Button inverse onClick={handleLoginSwitch}>
        SWITCH TO {loginSwitch ? "LOG IN" : "CREATE USER"}
      </Button>
    </Card>
  );
};

export default Authenticate;
