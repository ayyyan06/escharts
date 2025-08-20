import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../style.css";

export const Layout = () => {
  return (
    <div>
      <header className="header">
        <NavLink to="/">Map Qyzylorda</NavLink>
        <NavLink to="/mapKz">Map Qazazstan</NavLink>
        <NavLink to="/bar">Bar Chart</NavLink>
        <NavLink to="/line">Line Chart</NavLink>
        <NavLink to="/pie">Pie Chart</NavLink>
      </header>

      <Outlet />

      <footer></footer>
    </div>
  );
};
