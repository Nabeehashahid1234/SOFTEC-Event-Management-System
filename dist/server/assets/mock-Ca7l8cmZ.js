const VENUES = [
  { id: "v1", name: "CS Auditorium", capacity: 400 },
  { id: "v2", name: "EE Hall A", capacity: 200 },
  { id: "v3", name: "New Building Lab 1", capacity: 80 },
  { id: "v4", name: "Open Air Theatre", capacity: 800 },
  { id: "v5", name: "Sports Complex", capacity: 300 },
  { id: "v6", name: "Seminar Room 3", capacity: 60 }
];
const USERS = [
  { id: "u1", name: "Aisha Khan", email: "aisha@softec.org", role: "admin" },
  { id: "u2", name: "Bilal Ahmed", email: "bilal@nu.edu.pk", role: "participant", rollNumber: "24I-5699" },
  { id: "u3", name: "Hira Iqbal", email: "hira@nu.edu.pk", role: "participant", rollNumber: "23L-4421" },
  { id: "u4", name: "Dr. Faraz Mahmood", email: "faraz@nu.edu.pk", role: "judge", expertise: ["AI/ML", "Systems"] },
  { id: "u5", name: "Sana Riaz", email: "sana@softec.org", role: "organizer" },
  { id: "u6", name: "Systems Limited", email: "patrons@systemsltd.com", role: "sponsor", company: "Systems Limited", tier: "Title" },
  { id: "u7", name: "10Pearls", email: "give@10pearls.com", role: "sponsor", company: "10Pearls", tier: "Gold" },
  { id: "u8", name: "Afiniti", email: "marketing@afiniti.com", role: "sponsor", company: "Afiniti", tier: "Gold" },
  { id: "u9", name: "Devsinc", email: "events@devsinc.com", role: "sponsor", company: "Devsinc", tier: "Silver" },
  { id: "u10", name: "Prof. Naila Hashmi", email: "naila@nu.edu.pk", role: "judge", expertise: ["Product", "Strategy"] },
  { id: "u11", name: "Omar Sheikh", email: "omar@nu.edu.pk", role: "participant", rollNumber: "22F-9981" },
  { id: "u12", name: "Zara Malik", email: "zara@nu.edu.pk", role: "participant", rollNumber: "24I-3344" }
];
const D = (offsetDays, hour = 10) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const EVENTS = [
  {
    id: "e1",
    name: "Speed Programming",
    category: "Tech",
    excerpt: "A two-hour duel of algorithms, wits, and keystrokes — Pakistan's sharpest competitive programmers go head-to-head.",
    description: "An ICPC-style sprint contest hosted on a private judge. Solo participation. Top three teams advance to the regional showcase.",
    date: D(14, 9),
    endDate: D(14, 12),
    venueId: "v3",
    fee: 1500,
    capacity: 80,
    registered: 64,
    prizePool: 2e5,
    rules: ["Solo participation", "C++, Java, Python permitted", "No external libraries", "3-hour format"],
    rounds: [
      { name: "Qualifier", date: D(7, 10), venue: "Online" },
      { name: "Finals", date: D(14, 9), venue: "New Building Lab 1" }
    ],
    judges: ["u4"],
    organizers: ["u5"],
    sponsors: ["u6", "u7"],
    status: "filling",
    featured: true
  },
  {
    id: "e2",
    name: "SOFTEC Hackathon",
    category: "Tech",
    excerpt: "Thirty-six hours, infinite caffeine, one shipped product. Build something that matters between sunrise and Sunday.",
    description: "Pakistan's largest student hackathon. Teams of 2–4 build a working prototype against a surprise theme revealed at kickoff.",
    date: D(20, 18),
    endDate: D(22, 12),
    venueId: "v1",
    fee: 4e3,
    capacity: 200,
    registered: 188,
    prizePool: 5e5,
    rules: ["Teams of 2-4", "Code from scratch", "Open APIs allowed", "Final demo 5 minutes"],
    rounds: [
      { name: "Theme reveal & kickoff", date: D(20, 18), venue: "CS Auditorium" },
      { name: "Mid-checkpoint", date: D(21, 12), venue: "CS Auditorium" },
      { name: "Final demos", date: D(22, 9), venue: "CS Auditorium" }
    ],
    judges: ["u4", "u10"],
    organizers: ["u5"],
    sponsors: ["u6", "u7", "u8"],
    status: "filling",
    featured: true
  },
  {
    id: "e3",
    name: "Business Plan Showdown",
    category: "Business",
    excerpt: "Pitch a venture worth funding. A panel of investors, professors, and founders decides who walks away with seed capital.",
    description: "Submit an executive summary, deliver a 10-minute pitch, then survive the Q&A round with a panel of judges.",
    date: D(15, 14),
    endDate: D(15, 18),
    venueId: "v2",
    fee: 2500,
    capacity: 60,
    registered: 41,
    prizePool: 3e5,
    rules: ["Teams of 2-3", "Original ideas only", "10-minute pitch + 5 min Q&A", "Slides submitted 24h before"],
    rounds: [
      { name: "Submission deadline", date: D(10, 23), venue: "Online" },
      { name: "Live pitch", date: D(15, 14), venue: "EE Hall A" }
    ],
    judges: ["u10"],
    organizers: ["u5"],
    sponsors: ["u8"],
    status: "open",
    featured: true
  },
  {
    id: "e4",
    name: "Valorant Championship",
    category: "Gaming",
    excerpt: "Five-person squads. Best-of-three. The arena lights stay on until one team is left standing.",
    description: "Double-elimination bracket on private servers. BYO peripherals.",
    date: D(18, 11),
    endDate: D(19, 22),
    venueId: "v5",
    fee: 3e3,
    capacity: 80,
    registered: 80,
    prizePool: 25e4,
    rules: ["Teams of 5", "BYO peripherals", "Standard tournament map pool"],
    rounds: [
      { name: "Group stage", date: D(18, 11), venue: "Sports Complex" },
      { name: "Playoffs", date: D(19, 14), venue: "Sports Complex" }
    ],
    judges: [],
    organizers: ["u5"],
    sponsors: ["u9"],
    status: "closed"
  },
  {
    id: "e5",
    name: "Photography Salon",
    category: "General",
    excerpt: "A juried exhibition of frames captured on campus. Single image, infinite ways to look.",
    description: "Submit a single photograph. Top 30 prints exhibited at the Open Air Theatre.",
    date: D(16, 17),
    endDate: D(16, 20),
    venueId: "v4",
    fee: 800,
    capacity: 300,
    registered: 92,
    prizePool: 1e5,
    rules: ["One submission per person", "Original work only", "Max 12 MB"],
    rounds: [{ name: "Exhibition & awards", date: D(16, 17), venue: "Open Air Theatre" }],
    judges: ["u10"],
    organizers: ["u5"],
    sponsors: [],
    status: "open"
  },
  {
    id: "e6",
    name: "AI Ethics Symposium",
    category: "Tech",
    excerpt: "Practitioners, professors, and policy folk debate the questions our models won't answer for us.",
    description: "Panel discussions and a fishbowl debate. Open to all attendees.",
    date: D(17, 10),
    endDate: D(17, 16),
    venueId: "v2",
    fee: 500,
    capacity: 200,
    registered: 67,
    prizePool: 0,
    rules: ["Open to all", "Pre-reading distributed by email"],
    rounds: [{ name: "Symposium", date: D(17, 10), venue: "EE Hall A" }],
    judges: [],
    organizers: ["u5"],
    sponsors: ["u7"],
    status: "open"
  },
  {
    id: "e7",
    name: "Marketing Mavericks",
    category: "Business",
    excerpt: "A brand brief, four hours, one campaign. Defend your idea before a creative director's stare.",
    description: "Live brief revealed at start. Teams of 3 produce a deck, a tagline, and a 30-second hero spot.",
    date: D(12, 13),
    endDate: D(12, 18),
    venueId: "v6",
    fee: 2e3,
    capacity: 40,
    registered: 28,
    prizePool: 15e4,
    rules: ["Teams of 3", "All deliverables on the day"],
    rounds: [{ name: "Live competition", date: D(12, 13), venue: "Seminar Room 3" }],
    judges: ["u10"],
    organizers: ["u5"],
    sponsors: ["u8"],
    status: "open"
  },
  {
    id: "e8",
    name: "Tekken Solo Tournament",
    category: "Gaming",
    excerpt: "One stick. One arcade legend. The campus's reigning Tekken king will be crowned by Sunday night.",
    description: "Single-elimination bracket. Standard rule set.",
    date: D(19, 16),
    endDate: D(19, 22),
    venueId: "v5",
    fee: 1e3,
    capacity: 64,
    registered: 49,
    prizePool: 8e4,
    rules: ["Solo entry", "Standard ruleset", "BYO controller"],
    rounds: [{ name: "Bracket", date: D(19, 16), venue: "Sports Complex" }],
    judges: [],
    organizers: ["u5"],
    sponsors: [],
    status: "open"
  }
];
const REGISTRATIONS = [
  { id: "r1", userId: "u2", eventId: "e1", paymentStatus: "paid", amount: 1500, registeredAt: D(-5) },
  { id: "r2", userId: "u2", eventId: "e2", paymentStatus: "paid", amount: 4e3, registeredAt: D(-4) },
  { id: "r3", userId: "u2", eventId: "e6", paymentStatus: "pending", amount: 500, registeredAt: D(-2) },
  { id: "r4", userId: "u3", eventId: "e3", paymentStatus: "paid", amount: 2500, registeredAt: D(-7) }
];
const LEADERBOARDS = {
  e1: [
    { rank: 1, name: "Hassan Tariq", score: 9.6, team: "ByteForce" },
    { rank: 2, name: "Bilal Ahmed", score: 9.3, team: "Solo" },
    { rank: 3, name: "Mariam Sheikh", score: 9.1, team: "Recursion" },
    { rank: 4, name: "Omar Sheikh", score: 8.7, team: "Solo" },
    { rank: 5, name: "Zara Malik", score: 8.4, team: "Solo" }
  ],
  e2: [
    { rank: 1, name: "Team Polaris", score: 47.2 },
    { rank: 2, name: "Team Lighthouse", score: 45.8 },
    { rank: 3, name: "Team Quill", score: 44.1 },
    { rank: 4, name: "Team Atlas", score: 41 }
  ]
};
const ROOM_TYPES = [
  { id: "rt1", name: "Standard Twin", capacity: 2, price: 2500, available: 24 },
  { id: "rt2", name: "Quad Share", capacity: 4, price: 1500, available: 12 },
  { id: "rt3", name: "Premium Single", capacity: 1, price: 4500, available: 6 }
];
const TESTIMONIALS = [
  { quote: "SOFTEC is the closest a university can come to feeling like a startup conference.", author: "Sara M.", role: "Hackathon winner '25" },
  { quote: "I came for the prize money. I left with a co-founder.", author: "Hassan R.", role: "Business track '24" },
  { quote: "Three days that compress a semester of learning into a notebook.", author: "Dr. F. Mahmood", role: "Faculty judge" }
];
function venueById(id) {
  return VENUES.find((v) => v.id === id);
}
function eventById(id) {
  return EVENTS.find((e) => e.id === id);
}
export {
  EVENTS as E,
  LEADERBOARDS as L,
  REGISTRATIONS as R,
  TESTIMONIALS as T,
  USERS as U,
  ROOM_TYPES as a,
  eventById as e,
  venueById as v
};
