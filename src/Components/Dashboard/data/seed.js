/**
 * seed.js — static seed data for the dashboard.
 *
 * These are intentionally hardcoded so the UI is fully usable before a
 * backend feed exists. Swap any of these for a Firestore collection later
 * without touching the views (they only read from these arrays).
 */

/* ── Hackathons shown in Hackathons → Discover ── */
export const HACKATHONS = [
  {
    id: "sih-2026",
    name: "Smart India Hackathon 2026",
    organizer: "Ministry of Education, AICTE",
    mode: "Hybrid",
    theme: "Software · Hardware",
    prize: "₹1,00,000",
    deadline: "2026-08-15",
    tags: ["AI/ML", "IoT", "GovTech"],
    color: "#5B43E6",
  },
  {
    id: "hackwithinfy",
    name: "HackWithInfy 2026",
    organizer: "Infosys",
    mode: "Online",
    theme: "Competitive Coding",
    prize: "₹2,00,000 + PPO",
    deadline: "2026-07-30",
    tags: ["DSA", "System Design"],
    color: "#1D9E75",
  },
  {
    id: "ethindia",
    name: "ETHIndia 2026",
    organizer: "Devfolio",
    mode: "In-person",
    theme: "Web3 · Blockchain",
    prize: "$50,000",
    deadline: "2026-09-01",
    tags: ["Solidity", "Web3", "DeFi"],
    color: "#D85A30",
  },
  {
    id: "google-solution",
    name: "Google Solution Challenge",
    organizer: "Google Developers",
    mode: "Online",
    theme: "UN Sustainable Goals",
    prize: "Mentorship + Swag",
    deadline: "2026-08-22",
    tags: ["Android", "Firebase", "Cloud"],
    color: "#185FA5",
  },
];

/* ── Starter templates shown in Projects → Project Templates ── */
export const PROJECT_TEMPLATES = [
  {
    id: "ml-webapp",
    title: "AI/ML Web App",
    description: "A full-stack app with an ML model served behind an API and a React frontend.",
    tags: ["Python", "FastAPI", "React", "scikit-learn"],
    icon: "brain",
  },
  {
    id: "mern",
    title: "MERN Stack Project",
    description: "MongoDB + Express + React + Node starter with auth and CRUD wired up.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    icon: "stack",
  },
  {
    id: "mobile-app",
    title: "Cross-platform Mobile App",
    description: "A Flutter app with Firebase backend, ready for a hackathon demo.",
    tags: ["Flutter", "Firebase", "Dart"],
    icon: "device",
  },
  {
    id: "iot",
    title: "IoT / Hardware Project",
    description: "Sensor data pipeline from an ESP32 to a cloud dashboard.",
    tags: ["ESP32", "MQTT", "Node.js", "Charts"],
    icon: "chip",
  },
];
