// Web Audio API Synthesizer for Bus Approaching Chimes
// Zero external audio files required - works fully offline in any browser

export function playBusApproachingChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Harmonic Transit Chime (F#5 -> A#5 -> C#6 ascending chime)
    const notes = [739.99, 932.33, 1108.73];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.7);
    });

    // Gentle vibration for smartphones
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 250, 100, 400]);
    }
  } catch (err) {
    console.warn("Audio chime could not be played:", err);
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const perm = await Notification.requestPermission();
    return perm === "granted";
  }
  return false;
}

export function sendProximityNotification(busNumber, stopName, etaMinutes) {
  playBusApproachingChime();

  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(`🚍 Bus Approaching: ${busNumber}`, {
        body: `Your bus is approaching near ${stopName}! ETA ~${etaMinutes} mins. Ready to board!`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        vibrate: [200, 100, 200]
      });
    } catch (e) {
      // ignore
    }
  }
}
