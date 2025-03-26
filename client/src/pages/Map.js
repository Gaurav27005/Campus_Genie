import React from 'react';
import '../viewmap.css';

const Map = () => {
  const showMap = (floor) => {
    const mapImage = document.getElementById('map-image');
    if (floor === 'ground') {
      mapImage.src = '/assets/ground-floor-map.jpg'; // Replace with your Ground Floor Map image
    } else if (floor === 'first') {
      mapImage.src = '/assets/first-floor-map.jpg'; // Replace with your First Floor Map image
    } else if (floor === 'second') {
      mapImage.src = '/assets/second-floor-map.jpg'; // Replace with your Second Floor Map image
    }
  };

  return (
    <>
      <header>
        <div className="brand">Campus Genie - View Map</div>
      </header>

      <main>
        <div className="floor-section">
          {/* Unified Image to the Left */}
          <img src="/assets/image 6.png" alt="Unified Campus Map Image" className="floor-image" />

          {/* Buttons for Floor Selection */}
          <div className="floor-buttons">
            <button id="ground-floor" className="btn" onClick={() => showMap('ground')}>Ground Floor</button>
            <button id="first-floor" className="btn" onClick={() => showMap('first')}>First Floor</button>
            <button id="second-floor" className="btn" onClick={() => showMap('second')}>Second Floor</button>
          </div>
        </div>

        {/* Campus Map Display Below */}
        <div className="map-container">
          <img id="map-image" src="/assets/DYPCOE.jpg" alt="Selected Campus Map" className="map-img" />
        </div>

        {/* Google Maps Location */}
        <div className="google-map">
          <h3>Locate Us on Google Maps</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1890.213487479512!2d73.75617343379163!3d18.644826388116837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9f1ca8dab03%3A0x6237cfbd36f9acf9!2sD.Y.%20Patil%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1742577462439!5m2!1sen!2sin&t=k"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Campus Genie. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Map;