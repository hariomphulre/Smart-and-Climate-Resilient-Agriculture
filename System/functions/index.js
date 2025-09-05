const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const { onValueUpdated } = require("firebase-functions/database");
const { getDatabase } = require("firebase-admin/database");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const Papa = require("papaparse"); 

setGlobalOptions({ maxInstances: 10 });
admin.initializeApp();

exports.helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});

exports.trigger = onValueUpdated("/climate-data/vegetation/", async (event) => {
  const db = getDatabase();
  const indexList = ["ndvi", "evi", "gci", "psri", "ndre", "cri1"];
  let values = {};

  // Fetch latest value for each index
  for (let i of indexList) {
    const snapshot = await db.ref(`/climate-data/vegetation/${i}`).get();
    if (snapshot.exists()) {
      const url = snapshot.val().url;
      logger.info(`Fetching ${i} CSV from ${url}`);
      try {
        const res = await fetch(url);
        const text = await res.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const lastRow = parsed.data[parsed.data.length - 1]; // latest row

        // CSV column names match indices, e.g., ndvi, evi
        values[i] = parseFloat(lastRow[i.toLowerCase()] || 0);
      } catch (err) {
        logger.error(`Error fetching/parsing ${i}:`, err);
        values[i] = 0;
      }
    } else {
      values[i] = 0;
    }
  }

  // ---- Helper Functions ----
  const normalize = (val, min, max) => Math.max(0, Math.min(1, (val - min) / (max - min)));

  // ---- Health Calculation (NDVI, EVI, NDRE) ----
  const ndviNorm = normalize(values.ndvi, 0.2, 0.8);
  const eviNorm = normalize(values.evi, 0.1, 0.7);
  const ndreNorm = normalize(values.ndre, 0.2, 0.5);
  const healthFactor = ((ndviNorm + eviNorm + ndreNorm) / 3).toFixed(2);

  let healthStatus = "Poor";
  if (healthFactor > 0.7) healthStatus = "Healthy";
  else if (healthFactor > 0.4) healthStatus = "Moderate";

  // ---- Stress Calculation (CRI1) ----
  let stressStatus = "Low";
  if (values.cri1 >= 0.1 && values.cri1 < 0.2) stressStatus = "Medium";
  else if (values.cri1 >= 0.2) stressStatus = "High";

  // ---- Aging Calculation (PSRI) ----
  let agingStatus = "Young";
  if (values.psri >= 0.02 && values.psri < 0.05) agingStatus = "Maturing";
  else if (values.psri >= 0.05) agingStatus = "Aging";

  // ---- Chlorophyll Calculation (GCI + NDRE) ----
  let chlorophyllStatus = (values.gci > 2.5 && values.ndre > 0.3) ? "High" : "Low";

  // ---- Key Observations ----
  const keyObservations = {
    Health: { value: healthFactor, status: healthStatus },
    Stress: { value: values.cri1, status: stressStatus },
    Aging: { value: values.psri, status: agingStatus },
    Chlorophyll: { value: chlorophyllStatus, status: chlorophyllStatus === "High" ? "Good" : "Deficient" }
  };

  // Save to Firebase
  await db.ref("GEE/climate-data/vegetation/key-observations").set(keyObservations);

  logger.info("Updated Key Observations:", keyObservations);
});
