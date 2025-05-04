import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Login from "./login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Upload from "./Upload";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/Dashboard",
    element: <Dashboard />,
  },
  {
    path: "/Upload",
    element: <Upload />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
