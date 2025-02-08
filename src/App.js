import React from "react";
import Layout from "./Layout";
import "./App.css";
import { Route, Routes } from "react-router-dom";


/**
 * App is a wrapper for <Layout>, you should not need to change this file.
 */

function App() {
  return (
    <div className="app-routes">
        <Layout /> 
                
      </div>
  );
}

export default App;
