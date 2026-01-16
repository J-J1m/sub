const API_KEY = "ΒΑΛΕ_ΕΔΩ_TO_API_KEY";

const CHANNELS = {
  jimibloxx: {
    id: "ΒΑΛΕ_CHANNEL_ID_1",
    element: document.getElementById("jimibloxx")
  },
  dali: {
    id: "ΒΑΛΕ_CHANNEL_ID_2",
    element: document.getElementById("dali")
  }
};

let cachedStats = {};

async function fetchYouTubeStats() {
  const ids = Object.values(CHANNELS).map(c => c.id).join(",");
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ids}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  data.items.forEach((item, i) => {
    const key = Object.keys(CHANNELS)[i];
    cachedStats[key] = {
      subs: Number(item.statistics.subscriberCount),
      views: Number(item.statistics.viewCount)
    };
  });
}

function animateUI() {
  if (!cachedStats.jimibloxx || !cachedStats.dali) return;

  const maxSubs = Math.max(cachedStats.jimibloxx.subs, cachedStats.dali.subs);

  for (let key in CHANNELS) {
    const card = CHANNELS[key].element;
    card.querySelector(".subs").textContent = cachedStats[key].subs.toLocaleString();
    card.querySelector(".views").textContent = cachedStats[key].views.toLocaleString();
    const percent = (cachedStats[key].subs / maxSubs) * 100;
    card.querySelector(".fill").style.width = percent + "%";
  }

  const leader =
    cachedStats.jimibloxx.subs > cachedStats.dali.subs
      ? "👑 jimibloxx_official προηγείται!"
      : cachedStats.jimibloxx.subs < cachedStats.dali.subs
      ? "👑 dali-p9y προηγείται!"
      : "⚖️ Ισοπαλία!";

  document.getElementById("leader").textContent = leader;
}

fetchYouTubeStats();
setInterval(fetchYouTubeStats, 60000); // API κάθε 60s
setInterval(animateUI, 10000);         // UI κάθε 10s
