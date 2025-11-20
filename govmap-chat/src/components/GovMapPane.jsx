// src/components/GovMapPane.jsx
import React, { useEffect, useState } from "react";

function GovMapPane() {
  const [gush, setGush] = useState("");
  const [helka, setHelka] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.govmap.gov.il/govmap/api/govmap.api.js";
    script.async = true;

    script.onload = () => {
      if (!window.govmap) {
        console.error("GovMap loaded but window.govmap is undefined");
        return;
      }

      const token = "f683abfd-c77e-461a-a41e-7a80d4b46cb2"; // TODO: real token

      window.govmap.createMap("govmap-container", {
        token,
        layers: ["GASSTATIONS", "PARCEL_HOKS", "KSHTANN_ASSETS", "bus_stops", "PARCEL_ALL"],
        showXY: true,
        identifyOnClick: true,
        isEmbeddedToggle: false,
        background: "1",
        layersMode: 1,
        zoomButtons: false,
        onLoad: () => setIsMapReady(true)
      });
    };

    script.onerror = () => {
      console.error("Failed to load GovMap API script");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSearchParcel = () => {
    if (!window.govmap || !isMapReady) return;

    const gushTrim = gush.trim();
    const helkaTrim = helka.trim();

    if (!gushTrim || !helkaTrim) {
      alert("נא להזין גם גוש וגם חלקה");
      return;
    }

    const keyword = `גוש ${gushTrim} חלקה ${helkaTrim}`;

    window.govmap
      .geocode({
        keyword,
        type: window.govmap.geocodeType.AccuracyOnly
      })
      .then((response) => {
        console.log("geocode response:", response);

        const first =
          (response && response.data && response.data[0]) ||
          (response && response[0]) ||
          null;

        if (!first) {
          alert("לא נמצאה תוצאה מתאימה לגוש/חלקה");
          return;
        }

        const x = first.X || first.x || first.LON || first.lon;
        const y = first.Y || first.y || first.LAT || first.lat;

        if (!x || !y) {
          alert("נמצאה תוצאה אבל אין X/Y – בדוק את האובייקט בקונסול");
          console.log("first result:", first);
          return;
        }

        window.govmap.zoomToXY({
          x,
          y,
          level: 10,
          marker: true
        });
      })
      .catch((err) => {
        console.error("geocode error:", err);
        alert("אירעה שגיאה בחיפוש – ראה בקונסול");
      });
  };

  return (
    <div className="govmap-pane">
      <div className="govmap-header">
        <h2>GovMap</h2>
        <p className="govmap-subtitle">
          חיפוש לפי גוש / חלקה דרך govmap.geocode
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            type="text"
            placeholder="גוש"
            value={gush}
            onChange={(e) => setGush(e.target.value)}
            style={{ width: 80, padding: "4px 6px" }}
          />
          <input
            type="text"
            placeholder="חלקה"
            value={helka}
            onChange={(e) => setHelka(e.target.value)}
            style={{ width: 80, padding: "4px 6px" }}
          />
          <button
            onClick={handleSearchParcel}
            disabled={!isMapReady}
            style={{ padding: "4px 12px" }}
          >
            חפש
          </button>
        </div>
      </div>

      <div id="govmap-container" className="govmap-container" />
    </div>
  );
}

export default GovMapPane;
