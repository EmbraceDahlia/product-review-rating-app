import React from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Navbar />  */}
      <main className="flex-grow-1 container">{children}</main> 
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
