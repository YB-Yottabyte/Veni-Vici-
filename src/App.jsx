import React, { useState, useEffect } from "react";
import "./App.css";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [catData, setCatData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [history, setHistory] = useState([]); // New state to store history of results

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.thecatapi.com/v1/breeds?api_key=live_kdVioWKg0TfqdHqmz8GMj8yxmTAUevROlmC5EPjQDmo5BXksk1Q3jiOu8J6tIBTz",
        {
          headers: {
            "x-api-key": "live_kdVioWKg0TfqdHqmz8GMj8yxmTAUevROlmC5EPjQDmo5BXksk1Q3jiOu8J6tIBTz",
          },
        }
      );

      const data = await response.json();
      console.log(response);

      while (true) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const { reference_image_id, name, life_span, origin, weight } = data[randomIndex];

        const attributes = [name, life_span, origin, weight.imperial];
        if (attributes.some((attribute) => bannedAttributes.includes(attribute))) {
          continue;
        }

        const image = new Image();
        image.src = `https://cdn2.thecatapi.com/images/${reference_image_id}.jpg`;

        image.onload = () => {
          const catInfo = {
            reference_image_id,
            name,
            life_span,
            weight: weight.imperial,
            origin,
            randomName: randomCatName,
          };

          setCatData(catInfo);
          setHistory((prevHistory) => [catInfo, ...prevHistory]); // Add the new cat info to the history
        };

        image.onerror = () => {
          console.error("Error loading image. Finding another cat.");
        };
        break;
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBanAttribute = (attribute) => {
    if (!bannedAttributes.includes(attribute)) {
      setBannedAttributes([...bannedAttributes, attribute]);
    }
  };

  const handleRemoveBannedAttribute = (attribute) => {
    const updatedAttributes = bannedAttributes.filter((attr) => attr !== attribute);
    setBannedAttributes(updatedAttributes);
  };

  const handleClearHistory = () => {
    setHistory([]); // Clear history
  };

  useEffect(() => {
    fetchData();
  }, []);

  const catNames = [
    "Shadow", "Tiger", "Simba", "Whiskers", "Gizmo", "Misty", "Smokey", "Toby", "Oreo", "Chloe",
    "Dexter", "Mittens", "Boots", "Pumpkin", "Nala", "Sassy", "Cleo", "Peanut", "Mocha", "Felix"
  ];

  const randomCatName = catNames[Math.floor(Math.random() * catNames.length)];

  return (
    <>
      <div className="center-page">
        <h1>Veni Vici!</h1>
        <h3>Take a look at these beautiful cats!</h3>
        <p id="cat-icon">🐱 😺 😸 😻 😼 😽 🙀 😿 😺</p>
        <br />
        <br />
        <div className="discover-container">
          {buttonClicked && catData !== null && (
            <div className="listening-container">
              <h2 className="cat-name">{catData.randomName}</h2>
              <div className="buttons">
                <button
                  type="attribute"
                  className="attribute-buttons"
                  onClick={() => handleBanAttribute(catData.life_span)}
                >
                  {catData.life_span}
                </button>
                <button
                  type="attribute"
                  className="attribute-buttons"
                  onClick={() => handleBanAttribute(catData.name)}
                >
                  {catData.name}
                </button>
                <button
                  type="attribute"
                  className="attribute-buttons"
                  onClick={() => handleBanAttribute(catData.weight)}
                >
                  {catData.weight}
                </button>
                <button
                  type="attribute"
                  className="attribute-buttons"
                  onClick={() => handleBanAttribute(catData.origin)}
                >
                  {catData.origin}
                </button>
                <br />
              </div>

              <img
                className="cat-pic"
                src={`https://cdn2.thecatapi.com/images/${catData.reference_image_id}.jpg`}
                alt="random image from Cat API"
                height="250px"
                width="250px"
              />
            </div>
          )}
          <br />
          <button
            type="discover"
            className="discover-btn"
            onClick={() => {
              fetchData();
              setButtonClicked(true);
            }}
          >
            🔀 Discover!
          </button>
        </div>
      </div>

      {/* Left Side History Section */}
      <div className="left-section">
        <h2>History</h2>
        <div className="history-container">
          {history.map((cat, index) => (
            <div key={index} className="history-item">
              <h3>{cat.randomName}</h3>
              <img
                src={`https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`}
                alt={`Cat ${cat.randomName}`}
                height="100px"
                width="100px"
              />
              <p>{cat.name} - {cat.life_span} years</p>
            </div>
          ))}
        </div>
        <button
          className="clear-history-btn"
          onClick={handleClearHistory}
        >
          Clear History
        </button>
      </div>

      <div className="right-section">
        <h2>Ban List</h2>
        <h3>Select an attribute in your listing to ban it</h3>
        <div className="banned-attributes-container">
          {bannedAttributes.map((attribute) => (
            <button
              key={attribute}
              className="banned-attribute-buttons"
              onClick={() => handleRemoveBannedAttribute(attribute)}
            >
              {attribute}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
