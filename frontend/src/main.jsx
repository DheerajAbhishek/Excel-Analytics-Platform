import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home";
import Login from "./Login"; // Capital 'L' — make sure filename matches
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Upload from "./Upload";
import Charts from "./Charts";
import Admin from "./Admin";
import AdminDash from "./AdminDash"; // Import AdminDash if needed
import { UserContextProvider } from './UserContext';

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/Dashboard", element: <Dashboard /> },
  { path: "/Upload", element: <Upload /> },
  { path: "/Charts", element: <Charts /> },
  { path: "/Admin", element: <Admin /> },
  { path: "/AdminDash", element: <AdminDash /> } // Add AdminDash route if needed
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>
);
