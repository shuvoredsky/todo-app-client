import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const RootLayout = () => {
  return (
    <div className="text-base-content min-h-screen transition-colors duration-300">
      <Navbar />
      <main className="min-h-[calc(100vh-136px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
