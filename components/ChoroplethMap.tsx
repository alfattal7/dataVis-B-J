import React, { useRef, useEffect, useState } from "react";
import ReactMapGL, { ViewState, MapRef, Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { airTemperatureData } from '../data/airTemperature';
import { precipitationData } from '../data/precipitation';
import { sunshineData } from '../data/sunshine';

interface ChoroplethMapProps {
  attribute: string;
  year: number;
  hoveredStateId: string | null;
  setHoveredStateId: (stateId: string | null) => void;
}

interface Data {
  year: number;
  [key: string]: number;
}

interface FeatureProperties {
  name: string;
}

interface HoveredFeature {
  properties: FeatureProperties;
  [key: string]: any;
}

// Mapping-Funktion zur Zuordnung von GeoJSON-Namen zu Datenbanknamen
const nameMapping: { [key: string]: string } = {
  "Baden-Württemberg": "Baden-Wuerttemberg",
  "Bayern": "Bayern",
  "Brandenburg": "Brandenburg",
  "Berlin": "Brandenburg/Berlin",
  "Hamburg": "Niedersachsen/Hamburg/Bremen",
  "Hessen": "Hessen",
  "Mecklenburg-Vorpommern": "Mecklenburg-Vorpommern",
  "Niedersachsen": "Niedersachsen",
  "Nordrhein-Westfalen": "Nordrhein-Westfalen",
  "Rheinland-Pfalz": "Rheinland-Pfalz",
  "Saarland": "Saarland",
  "Sachsen": "Sachsen",
  "Sachsen-Anhalt": "Sachsen-Anhalt",
  "Schleswig-Holstein": "Schleswig-Holstein",
  "Thüringen": "Thueringen",
  "Bremen": "Niedersachsen/Hamburg/Bremen"
};

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({ attribute, year, hoveredStateId, setHoveredStateId }) => {
  const mapRef = useRef<MapRef | null>(null);  // Referenz für die Map-Instanz
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 51.1657,  // Initiale Breiten- und Längengradeinstellung für Deutschland
    longitude: 10.4515,
    zoom: 4,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },  // Keine zusätzliche Padding-Einstellung
  });

  // Funktion zur Handhabung von Viewport-Änderungen
  const handleViewportChange = (nextViewport: ViewState) => {
    setViewport(nextViewport);
  };

  // Funktion zur Bestimmung der Farbe basierend auf dem Attributwert
  const getColorForValue = (value: number, attribute: string) => { 
    if (attribute === "temperature") {
      if (value >= 0 && value < 8.5) return "#0000FF";  // Blau für niedrige Temperaturen
      if (value >= 8.5 && value < 9) return "#00FFFF";  // Hellblau für mittlere Temperaturen
      if (value >= 9 && value < 9.5) return "#00FF00";  // Grün für wärmere Temperaturen
      if (value >= 9.5 && value < 10) return "#FFFF00";  // Gelb für warme Temperaturen
      if (value >= 10 &&value < 100) return "#FF0000";  // Rot für sehr warme Temperaturen
    } else if (attribute === "precipitation") {
      if (value >= 0 && value < 600) return "#E5F3FA";  // Hellblau für niedrige Niederschläge
      if (value >= 600 && value < 700) return "#A1D7F2";  // Blau für mittlere Niederschläge
      if (value >= 700 && value < 800) return "#4DB3E6";  // Dunkleres Blau für höhere Niederschläge
      if (value >= 800 && value < 1000) return "#4D7FE6";  // Noch dunkleres Blau für hohe Niederschläge
      if (value >= 1000 && value < 10000) return "#1832F7";  // Dunkelblau für sehr hohe Niederschläge
    } else if (attribute === "sunshine") {
      if (value >= 0 && value < 1400) return "#F6F5D5";  // Hellgelb für wenig Sonnenschein
      if (value >= 1400 && value < 1550) return "#E1DD56";  // Gelb für mittleren Sonnenschein
      if (value >= 1550 && value < 1700) return "#FBF02D";  // Helleres Gelb für mehr Sonnenschein
      if (value >= 1700 && value < 1800) return "#FBC72D";  // Dunkleres Gelb für viel Sonnenschein
      if (value >= 1800 && value < 3000) return "#f57c00";  // Orange für sehr viel Sonnenschein
    }
    return "#FF1FBF";  // Standardfarbe, falls der Wert außerhalb des Bereichs liegt
  };

  // Funktion zur Abrufung der Daten basierend auf Jahr und Attribut
  const getDataForYearAndAttribute = (year: number, attribute: string): Data | undefined => {
    if (attribute === "temperature") {
      return airTemperatureData.find((d: Data) => d.year === year);  // Suche nach Temperaturdaten für das Jahr
    } else if (attribute === "precipitation") {
      return precipitationData.find((d: Data) => d.year === year);  // Suche nach Niederschlagsdaten für das Jahr
    } else if (attribute === "sunshine") {
      return sunshineData.find((d: Data) => d.year === year);  // Suche nach Sonnenscheindaten für das Jahr
    }
    return undefined;  // Rückgabe undefined, falls das Attribut nicht gefunden wird
  };

  // Funktion zum  Aufruf von getDataForYearAndAttribute und Übertragen der Farbe und Kordinaten auf die Karte
  const getPaintProperty = (year: number, attribute: string): mapboxgl.Expression => {
    const data = getDataForYearAndAttribute(year, attribute);

    if (!data) return ["literal", "#ffb74d"];  // Standardfarbe, falls keine Daten vorhanden

    // Mappt die Farben auf die Bundesländer basierend auf den Daten und dem Attribut
    return [
      "match",
      ["get", "name"],
      ...Object.entries(nameMapping).flatMap(([geoJsonName, dataName]) => [
        geoJsonName, getColorForValue(data[dataName], attribute)
      ]),
      "#CC00B4"  // Standardfarbe
    ];
  };

  // Funktion zur Handhabung von Hover-Ereignissen
  const handleHover = (event: any) => {
    if (event.features && event.features.length) {
      const hoveredFeature: HoveredFeature = event.features[0];
      setHoveredStateId(hoveredFeature.properties.name);  // Aktualisieren des Hover-Zustands
    } else {
      setHoveredStateId(null);  // Löschen des Hover-Zustands, falls keine Features gehovered werden
    }
  };

  return (
    // Container-Div für die Karte
    <div className="text-black relative" style={{ height: "calc(100vh - 64px)", width: "100%" }}>
      {/* Map-Container */}
      <ReactMapGL
        {...viewport}  // Viewport-Einstellungen
        mapboxAccessToken="pk.eyJ1IjoiYWxmYXR0YWwiLCJhIjoiY2x4a2xibmk2MDJxdDJpc2lodzgya2FlNiJ9.w3bowLOQUYdtpxwuBiP1xg"
        onMove={(evt) => handleViewportChange(evt.viewState)}  // Event-Handler für Viewport-Änderungen
        ref={mapRef}  // Referenz für die Map-Instanz
        minZoom={5}
        maxZoom={15}
        mapStyle="mapbox://styles/mapbox/light-v10"  // Stil der Karte
        interactiveLayerIds={["countries-fill"]}  // Interaktive Layer-ID
        onMouseMove={handleHover}  // Event-Handler für Hover-Interaktionen
      >
        {/* Datenquelle für die Bundesländer */}
        <Source id="countries" type="geojson" data="https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/1_sehr_hoch.geo.json">
          {/* Layer für die Füllung der Bundesländer */}
          <Layer
            id="countries-fill"
            type="fill"
            paint={{
              "fill-color": getPaintProperty(year, attribute),  // Setzt die Farben basierend auf den Daten
              "fill-opacity": 0.6,  // Setzt die Transparenz
            }}
          />
          {/* Layer für die Umrisse der Bundesländer */}
          <Layer
            id="countries-outline"
            type="line"
            paint={{
              "line-color": "#000",  // Setzt die Farbe der Umrisse
              "line-width": 1,  // Setzt die Breite der Umrisse
            }}
          />
        </Source>

        {/* Anzeige der Hover-Informationen */}
        {hoveredStateId && (  // Bedingtes Rendern der Hover-Info, falls ein Feature gehovered wird
          <div className="hover-info" style={{ position: "absolute", zIndex: 10, pointerEvents: "none", left: "50%", top: 0, transform: "translateX(-50%)", backgroundColor: "white", padding: "10px", borderRadius: "5px", boxShadow: "0px 0px 5px rgba(0,0,0,0.5)" }}>
            <strong>{hoveredStateId}</strong>  {/* Name des Bundeslandes */}
            <br />
            {/* Attributwert für das Bundesland */}
            {attribute.charAt(0).toUpperCase() + attribute.slice(1)}: {getDataForYearAndAttribute(year, attribute)?.[nameMapping[hoveredStateId]] ?? "N/A"}
          </div>
        )}
      </ReactMapGL>
    </div>
  );
};

export default ChoroplethMap;
