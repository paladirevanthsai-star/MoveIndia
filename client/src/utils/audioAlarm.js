// Web Audio API Synthesizer for Bus Approaching & SIH Emergency Alarms
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
      gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.7);
    });

    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 250, 100, 400]);
    }
  } catch (err) {
    console.warn("Audio chime could not be played:", err);
  }
}

export function playEmergencyAlertSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Urgent Dual-Tone Siren (880Hz <-> 1175Hz rapid police pulses)
    for (let i = 0; i < 4; i++) {
      const freq = i % 2 === 0 ? 880 : 1174.66;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + i * 0.14);

      gain.gain.setValueAtTime(0.3, now + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.14 + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 0.14);
    }

    if ("vibrate" in navigator) {
      navigator.vibrate([400, 100, 400, 100, 600]);
    }
  } catch (err) {}
}

export function playHazardWarningSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Low rumble warning pulses (220Hz -> 180Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.4);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);

    if ("vibrate" in navigator) {
      navigator.vibrate([300, 150, 300]);
    }
  } catch (err) {}
}

export function playSuccessChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Positive two-tone confirmation (C6 -> G6)
    [1046.50, 1567.98].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.25, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.55);
    });

    if ("vibrate" in navigator) {
      navigator.vibrate([150]);
    }
  } catch (err) {}
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
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z'/></svg>",
        vibrate: [200, 100, 200]
      });
    } catch (e) {}
  }
}
