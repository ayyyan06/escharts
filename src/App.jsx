import Home from "./pages/Home";
import "./style.css";
import { Route } from "react-router-dom";
import { Routes } from "react-router";
import { Layout } from "./components/Layout";
import { About } from "./pages/About";
import { Posts } from "./pages/Posts";
import { LineChart } from "./pages/LineChart";
import { PieChart } from "./pages/PieChart";

function App() {
  return (
    <div>
      <Layout />
      <Routes>
        <Route path="/" element={<Home />}>
          Map
        </Route>
        <Route path="/mapKz" element={<About />}>
          Map
        </Route>
        <Route path="/bar" element={<Posts />}>
          Bar
        </Route>
        <Route path="/line" element={<LineChart />}>
          Bar
        </Route>
        <Route path="/pie" element={<PieChart />}>
          Pie
        </Route>
      </Routes>
    </div>
  );
}

export default App;
