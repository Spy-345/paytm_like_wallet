import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Heading from "../components/heading";
import SubHeading from "../components/subHeading";
import Input from "../components/inputComponent";
import Button from "../components/button";
import BottomWarning from "../components/bottomWarning";

export default function SignIn() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Use the useNavigate hook to navigate to the dashboard
  const navigate = useNavigate();

  // Function to handle the input change
  function handleChange(event) {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  }

  // Function to handle the form submission
  function handleSubmit(event) {
    event.preventDefault();
    fetch("/api/v1/user/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          sessionStorage.setItem("accessToken", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        }
      })
      .catch((error) => console.log(error));
  }

  // Check if the user is already logged in
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, []); //eslint-disable-line

  return (
    <>
      <div className='bg-white text-slate-800 w-1/4 mx-auto mt-24 items-center flex flex-col gap-y-3 py-3 rounded-lg h-full'>
        <Heading label={"Sign In"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <form
          className='text-start flex flex-col gap-y-3 w-10/12'
          onSubmit={handleSubmit}
        >
          <Input
            label={"Email"}
            type={"email"}
            name={"username"}
            onChange={handleChange}
            id={"username"}
            placeholder={"jonhndoe@example.com"}
          />
          <Input
            label={"Password"}
            type={"password"}
            name={"password"}
            onChange={handleChange}
            id={"password"}
            placeholder={"********"}
          />
          <Button label={"Sign In"} />
        </form>
        <BottomWarning
          label={"Don't have an account?"}
          to={"/signup"}
          page={"SignUp"}
        />
      </div>
    </>
  );
}
