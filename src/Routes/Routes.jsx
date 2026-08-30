// src/router/router.jsx
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true, // path: "/"
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        // 🔒 প্রোটেক্টেড রুট — লগইন ছাড়া ঢোকা যাবে না
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      // নতুন রুট যোগ করতে চাইলে এখানেই {} যোগ করো
      // প্রোটেক্টেড করতে চাইলে element কে <ProtectedRoute> দিয়ে wrap করো
    ],
  },
]);

export default router;