import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./ourComponents/Pages/Home";
import About from "./ourComponents/Pages/About/About";
import NotFound from "./ourComponents/Pages/NotFound";
import CreateNewTour from "./ourComponents/Pages/CreateNewTour/CreateNewTour";
import TourIndex from "./ourComponents/Pages/TourIndex";
import TourLive from "./ourComponents/Pages/TourLive";
import EndTour from "./ourComponents/Pages/EndTour/EndTour";
import ScrollToTop from "./ourComponents/ScrollToTop";

import NavBar from "./ourComponents/NavBar/NavBar";
import Footer from "./ourComponents/Footer/Footer";

function App() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="App">
      <Router>
        <ScrollToTop /> {/* ✅ GLOBAL SCROLL RESET */}

        <NavBar onContactClick={() => setShowContactModal(true)} />

        {/* ✅ CONTACT US MODAL OVERLAY (no route) */}
        {showContactModal && (
          <EndTour
            mode="contact"
            autoClose
            onClose={() => setShowContactModal(false)}
          />
        )}

        <main>
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/createnewtour" element={<CreateNewTour />} />
              <Route path="/tours" element={<TourIndex />} />
              <Route path="/tours/:id" element={<TourLive />} />
              <Route path="/endtour" element={<EndTour />} />
              {/* ✅ REMOVE /contact route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>

        <Footer onContactClick={() => setShowContactModal(true)} />
      </Router>
    </div>
  );
}

export default App;
