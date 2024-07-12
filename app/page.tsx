"use client";
import React, { useState, useEffect } from "react";
import ChoroplethMap from "../components/ChoroplethMap";
import Legend from "../components/Legend";
import Hero from "@/components/Hero";

export default function Home() {
  const [yearLeft, setYearLeft] = useState(2000);  // Zustand für das Jahr der linken Karte
  const [yearRight, setYearRight] = useState(2023);  // Zustand für das Jahr der rechten Karte
  const [attribute, setAttribute] = useState<"temperature" | "precipitation" | "sunshine">("temperature");  // Zustand für das ausgewählte Attribut
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);  // Zustand für die ID des gehoverten Bundeslandes

  // Handler für die Änderung des linken Jahres
  const handleYearLeftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearLeft(parseInt(e.target.value, 10));
  };

  // Handler für die Änderung des rechten Jahres
  const handleYearRightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearRight(parseInt(e.target.value, 10));
  };

  // Handler für die Änderung des Attributs
  const handleAttributeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAttribute(e.target.value as "temperature" | "precipitation" | "sunshine");
  };

  // Array von Jahren für die Auswahlfelder
  const years = Array.from({ length: 2023 - 1981 + 1 }, (_, i) => 1981 + i);

  return (
    <>
    <Hero/>
    <div className="container mx-auto p-4"> {/* Hauptcontainer */}
      <div className="text-black-100 bg-white shadow-lg rounded-lg p-6"> {/* Weißer Hintergrund mit Schatten */}
        <div className="mb-4"> {/* Container für die Attributauswahl */}
          <label htmlFor="attribute-select" className="block text-gray-700 font-medium mb-2 border-yellow-100">
            Select Attribute  {/* Beschriftung für das Auswahlfeld */}
          </label>
          <select
            id="attribute-select"
            onChange={handleAttributeChange}
            value={attribute}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="temperature">Temperature</option>  {/* Auswahloption für Temperatur */}
            <option value="precipitation">Precipitation</option>  {/* Auswahloption für Niederschlag */}
            <option value="sunshine">Sunshine</option>  {/* Auswahloption für Sonnenschein */}
          </select>
        </div>
        <div className="text-black-100 flex justify-between mb-4"> {/* Container für die Jahresauswahl */}
          <div>
            <label htmlFor="year-left-select" className="block text-gray-700 font-medium mb-2">
              Select Left Year  {/* Beschriftung für das Auswahlfeld links */}
            </label>
            <select
              id="year-left-select"
              onChange={handleYearLeftChange}
              value={yearLeft}
              className="text-black-100 block w-full p-2 border border-yellow-300 rounded-md"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year-right-select" className="block text-gray-700 font-medium mb-2">
              Select Right Year  {/* Beschriftung für das Auswahlfeld rechts */}
            </label>
            <select
              id="year-right-select"
              onChange={handleYearRightChange}
              value={yearRight}
              className="block w-full p-2 border border-yellow-300 rounded-md"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex"> {/* Container für die beiden Karten */}
          <div className="w-1/2 pr-2"> {/* Container für die linke Karte */}
            <ChoroplethMap 
              attribute={attribute} 
              year={yearLeft} 
              hoveredStateId={hoveredStateId} 
              setHoveredStateId={setHoveredStateId} 
            />
          </div>
          <div className="w-1/2 pl-2"> {/* Container für die rechte Karte */}
            <ChoroplethMap 
              attribute={attribute} 
              year={yearRight} 
              hoveredStateId={hoveredStateId} 
              setHoveredStateId={setHoveredStateId} 
            />
          </div>
        </div>
        <div className="mt-4"> {/* Container für die Legende */}
          <Legend attribute={attribute} />  {/* Anzeige der Legende */}
        </div>
      </div>
    </div>
    </>
  );
}
