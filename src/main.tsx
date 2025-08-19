import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootLayout from "./RootLayout/RootLayout.tsx";
import { RouterProvider, createBrowserRouter } from "react-router";
import SignUp from "./SignUP/SignUp.tsx";
import Home from "./Components/Home.tsx";
import SignIn from "./SignIn/SignIn.tsx";

// router define
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
