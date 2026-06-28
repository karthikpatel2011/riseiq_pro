import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Secondpage from "./Components/Secondpage";
import Thirdpage from "./Components/Thirdpage";
import Fourthpage from "./Components/Fourthpage";
import Fifthpage from "./Components/Fifthpage";
import Sixthpage from "./Components/Sixthpage";
import Seventh from "./Components/Seventh";
import Eightcard from "./Components/Eightcard";
import Footer1 from "./Components/Footer1";
import AboutPage from "./Components/AboutPage";

function Landing() {
  return (
    <>
      <Navbar />
      <Home />
      <Secondpage />
      <Thirdpage />
      <Fourthpage />
      <Fifthpage />
      <Sixthpage />
      <Eightcard />
      <Seventh />
      <Footer1 />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/"      element={<Landing />} />
      <Route path="/about"  element={<AboutPage />} />
    </Routes>
  );
}

export default App;
