import { useEffect, useState } from "react";
import Heading from "./heading";
import Input from "./inputComponent";
import PropTypes from "prop-types";

export default function SendMoney({ name, isOpen, setIsOpen, userId }) {
  const [amount, setAmount] = useState(0);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    async function getUser() {
      const response = await fetch(`/api/v1/user/singleUser?userId=${userId}`);
      const data = await response.json();
      console.log(data);
      setUser(data);
    }
    getUser();
  }, [userId]);

  //User Initial
  const userInitial = name.charAt(0).toUpperCase();

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/v1/account/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        to: userId,
        amount: amount,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      window.location.reload();
    } else {
      alert(data.message);
    }
  }

  return (
    <div
      className={
        isOpen
          ? "absolute backdrop-opacity-10 backdrop-invert top-0 bg-white/30 w-1/2 h-full"
          : "hidden"
      }
    >
      <div
        className={` bg-white text-slate-800 mx-auto font-medium p-3 w-1/2 border border-solid shadow-md rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
      >
        <div className='text-end '>
          <button
            className='bg-white border border-black'
            onClick={() => setIsOpen(!open)}
          >
            X
          </button>
        </div>
        <Heading label='Send Money' />
        <div className='flex flex-row items-center gap-2 my-2'>
          <div className='bg-green-600 rounded-full p-2 px-4'>
            {userInitial}
          </div>
          <div className='text-center font-bold text-xl'>Hello, {name}</div>
        </div>
        <div className='text-start ms-2 text-slate-400 my-2'>
          Sending money to : {user.firstName} {user.lastName}
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label='Amount(in Rs)'
            type='text'
            id='amount'
            name='amount'
            placeholder='Enter Amount'
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            label='Send'
            type='submit'
            className='w-1/2 bg-green-600  text-white rounded-lg my-2 mx-auto'
          >
            Initiate Transfer
          </button>
        </form>
      </div>
    </div>
  );
}

SendMoney.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
