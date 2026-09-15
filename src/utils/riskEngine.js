import { getRainfall } from "./weatherService";

export async function calculateRisk(reports, days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  const recent = reports.filter((r) => {
    const time = r.createdAt?.toMillis ? r.createdAt.toMillis() : 0;
    return time >= cutoff;
  });

  const grouped = {};
  recent.forEach((r) => {
    if (!grouped[r.village]) grouped[r.village] = [];
    grouped[r.village].push(r);
  });

  const results = await Promise.all(
    Object.entries(grouped).map(async ([village, list]) => {
      const count = list.length;
      let risk = "Low";
      if (count >= 10) risk = "High";
      else if (count >= 5) risk = "Medium";

      const rainfall = await getRainfall(village);
      if (rainfall && rainfall > 5 && risk === "Medium") risk = "High";
      if (rainfall && rainfall > 2 && risk === "Low" && count >= 3) risk = "Medium";

      return { village, count, risk, rainfall, symptoms: list.map((r) => r.symptom) };
    })
  );

  return results.sort((a, b) => b.count - a.count);
}