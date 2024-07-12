import React from 'react';

interface LegendProps {
  attribute: "temperature" | "precipitation" | "sunshine";  // Erwartete Attribute
}

// Definition der Legenden-Daten für die verschiedenen Attribute
const legendData = {
  temperature: [
    { color: '#0000FF', value: 'Cold', range: '0 - 8.5' },  // Blau für kalte Temperaturen
    { color: '#00FFFF', value: 'Cool', range: '8.5 - 9' },  // Hellblau für kühle Temperaturen
    { color: '#00FF00', value: 'Mild', range: '9 - 9.5' },  // Grün für milde Temperaturen
    { color: '#FFFF00', value: 'Warm', range: '9.5 - 10' },  // Gelb für warme Temperaturen
    { color: '#FF0000', value: 'Hot', range: '10+' },  // Rot für heiße Temperaturen
  ],
  precipitation: [
    { color: '#E5F3FA', value: 'Low', range: '0 - 600' },  // Hellblau für niedrige Niederschläge
    { color: '#A1D7F2', value: 'Moderate', range: '600 - 700' },  // Blau für moderate Niederschläge
    { color: '#4DB3E6', value: 'High', range: '700 - 800' },  // Dunkleres Blau für hohe Niederschläge
    { color: '#4D7FE6', value: 'Very High', range: '800 - 1000' },  // Noch dunkleres Blau für sehr hohe Niederschläge
    { color: '#1832F7', value: 'Extreme', range: '1000+' },  // Dunkelblau für extreme Niederschläge
  ],
  sunshine: [
    { color: '#F6F5D5', value: 'Low', range: '0 - 1400' },  // Hellgelb für wenig Sonnenschein
    { color: '#E1DD56', value: 'Moderate', range: '1400 - 1550' },  // Gelb für moderate Sonnenschein
    { color: '#FBF02D', value: 'High', range: '1550 - 1700' },  // Helleres Gelb für hohen Sonnenschein
    { color: '#FBC72D', value: 'Very High', range: '1700 - 1800' },  // Dunkleres Gelb für sehr hohen Sonnenschein
    { color: '#f57c00', value: 'Extreme', range: '1800+' },  // Orange für extremen Sonnenschein
  ],
};

const Legend: React.FC<LegendProps> = ({ attribute }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md"> {/* Container für die Legende */}
      <h4 className="text-lg font-medium mb-4">
        {attribute.charAt(0).toUpperCase() + attribute.slice(1)} Legend  {/* Überschrift der Legende */}
      </h4>
      <ul>
        {legendData[attribute].map((item, index) => (
          <li key={index} className="flex items-center mb-2"> {/* Liste der Legenden-Items */}
            <span className="w-6 h-6 inline-block rounded-full mr-2" style={{ backgroundColor: item.color }}></span> {/* Farbiger Kreis */}
            <span>{item.value} ({item.range})</span> {/* Beschreibung und Bereich des Wertes */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
