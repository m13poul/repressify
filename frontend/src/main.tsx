import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ClientSideProvider } from "./contexts/clientContext";
import LoginPage from "./pages/Login";
import { useContext } from "react";
import { ClientSideContext } from "./contexts/clientContext";
import Home from "./pages/Home";
import SignupPage from "./pages/Signup";
import Recovery from "./pages/Recovery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
// const queryClient = new QueryClient();

const AppWrapper = () => {
  const [user, dispatch] = useContext(ClientSideContext);
  // console.log("user is", user);
  return <>{localStorage.getItem("user") && user !== "" ? <App /> : <Home />}</>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClientSideProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<AppWrapper />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/recovery" element={<Recovery />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClientSideProvider>
  </React.StrictMode>
);
