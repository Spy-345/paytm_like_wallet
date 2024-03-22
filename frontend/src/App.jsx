import { Routes, Route, BrowserRouter } from "react-router-dom";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import SendMoney from "./pages/sendmoney";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/send' element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
