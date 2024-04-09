import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SendMoney from "../components/sendmoney";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loggedUser, setLoggedUser] = useState({
    firstName: "User",
    lastName: "",
  });
  const [userbalance, setUserBalance] = useState("0.00");
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  console.log(userId);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/v1/user/bulk");
      const data = await response.json();
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  //Effect to Fetch the User balance
  useEffect(() => {
    const fetchBalance = async () => {
      const response = await fetch("/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      setUserBalance(data.balance);
    };
    fetchBalance();
  });

  // Handle search
  function handleChange(e) {
    setSearch(e.target.value);
  }

  function handleLogOut() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    navigate("/signin");
  }

  //Fetch users based on search
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`/api/v1/user/bulk?filter=${search}`);
      const data = await response.json();
      setUsers(data.users);
    }
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    if (sessionUser) {
      setLoggedUser(sessionUser);
    }
    fetchUsers();
  }, [search]);

  const friends = users.filter(
    (user) => loggedUser.firstName !== user.firstName
  );

  const User = ({ user }) => {
    return (
      <div className='flex flex-row justify-between items-center p-2 my-2 border border-solid border-gray-300 rounded-lg'>
        <div className='flex flex-row gap-x-3 items-center'>
          <FaUser
            size={20}
            className='border border-solid rounded-xl bg-gray-200 border-gray-400 p-1'
          />
          <h2>
            {user.firstName} {user.lastName}
          </h2>
        </div>
        <div className='w-1/4'>
          <button
            className='bg-green-500 text-white p-2 rounded-lg w-full'
            onClick={() => {
              setIsOpen(true);
              setUserId(user._id);
            }}
          >
            Pay
          </button>
        </div>
      </div>
    );
  };

  User.propTypes = {
    user: PropTypes.object.isRequired,
  };

  return (
    <div
      className='w-1/2
     bg-white h-screen text-slate-800 mx-auto font-medium'
    >
      <div className='flex flex-row justify-between p-2 my-2'>
        <div className='text-black font-bold'>
          <h1 className='text-lg'>Payments App</h1>
        </div>
        <div className='flex flex-row gap-2 items-center'>
          <h2>Hello,{loggedUser.firstName}</h2>
          <FaUser
            size={20}
            className='border border-solid rounded-xl bg-gray-200 border-gray-400 p-1'
            onClick={handleLogOut}
          />
        </div>
      </div>
      <div className='h-[1px] bg-gray-300'></div>
      <div className='flex flex-row gap-x-3 mx-2'>
        <h2 className='font-semibold'>Balance :</h2>
        <span>$ {userbalance.toString().slice(0, 6)}</span>
      </div>
      <div className='text-start mx-2 mt-3'>
        <h2 className='font-semibold'>Users</h2>
        <input
          name='search'
          type='text'
          placeholder='Search user..'
          onChange={handleChange}
          className='p-2 bg-white mt-2 placeholder:text-slate-400 placeholder:font-sans rounded-lg border border-solid border-gray-300 w-1/2'
        />
      </div>
      <div className='mx-2'>
        {friends.map((user) => {
          return <User key={user._id} user={user} />;
        })}
      </div>
      <SendMoney
        name={loggedUser.firstName}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userId={userId}
      />
    </div>
  );
}
