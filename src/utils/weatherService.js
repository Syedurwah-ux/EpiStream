const API_KEY = "99174f0fd29c9053d8b1e7caced0f49c";

export async function getRainfall(village) {
  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(village)},IN&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();
    if (!geoData[0]) return null;

    const { lat, lon } = geoData[0];
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherRes.json();
    return weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0;
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
}