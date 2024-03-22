import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../components/heading";
import SubHeading from "../components/subHeading";
import Input from "../components/inputComponent";
import Button from "../components/button";
import BottomWarning from "../components/bottomWarning";

function Signup() {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setUserDetails((prevData) => ({ ...prevData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch("/api/v1/user/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert(data.message);
        }
        if (data.message === "User Created Successfully!") {
          sessionStorage.setItem("accessToken", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className='bg-white text-slate-800 w-1/4 mx-auto items-center flex flex-col gap-y-3 py-3 rounded-lg mt-24'>
      <Heading label={"Sign Up"} />
      <SubHeading label={"Enter your details to create an account"} />
      <form
        className='text-start flex flex-col gap-y-3 w-10/12'
        onSubmit={handleSubmit}
      >
        <Input
          label={"First Name"}
          type={"text"}
          name={"firstName"}
          onChange={handleChange}
          id={"firstName"}
          placeholder={"John"}
        />
        <Input
          label={"Last Name"}
          type={"text"}
          name={"lastName"}
          onChange={handleChange}
          id={"lastName"}
          placeholder={"Doe"}
        />
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
        <Button label={"Sign Up"} />
      </form>
      <BottomWarning
        label={"Already have an account?"}
        to={"/signin"}
        page={"SignIn"}
      />
    </div>
  );
}

export default Signup;
