# Frontend Integration Guide

## Overview

This guide explains the changes needed in the frontend to work with the redesigned backend schema. The main changes involve updating data structures, API calls, and component state management.

## Key Schema Changes Affecting Frontend

### 1. Registrations vs Participants

**Old Structure:**

```javascript
// participants table - separate from events
const participant = {
  participant_id: 123,
  event_id: 456,
  user_id: 789,
  payment_status: "completed",
};
```

**New Structure:**

```javascript
// registrations table - unified
const registration = {
  registration_id: 123,
  user_id: 789,
  event_id: 456,
  status: "confirmed", // pending, confirmed, cancelled
  registered_at: "2024-02-01T10:00:00Z",
};
```

### 2. Judge Assignment

**Old Structure:**

```javascript
// judges table
const judge = {
  judge_id: 1,
  user_id: 2,
  organizer_id: 3,
};

// judge_events table
const assignment = {
  judge_id: 1,
  event_id: 456,
};
```

**New Structure:**

```javascript
// users table with role = 'judge'
const judge = {
  user_id: 2,
  name: "John Doe",
  role: "judge",
};

// judge_assignments table
const assignment = {
  assignment_id: 1,
  event_id: 456,
  judge_id: 2,
  active: 1,
  assigned_at: "2024-02-01T10:00:00Z",
};
```

### 3. Event Structure

**Added Fields:**

- `assigned_judge_id` - Reference to judge's user_id
- `event_status` - Lifecycle status (created, open, ongoing, completed)
- `prize_pool` - Event prize amount
- `sponsorship_total` - Calculated from sponsorships
- `total_prize_pool` - prize_pool + sponsorship contributions

**Removed Fields:**

- `organizer_name` (use organizer_id to join users)
- `judge_id` (now assigned_judge_id)

---

## Frontend File Updates

### 1. Update `src/lib/api.ts`

Add new endpoints for the new schema:

```typescript
// Add to api.ts

// Registrations API
export async function getMyRegistrations() {
  return api.get("/registrations");
}

export async function registerForEvent(eventId: number) {
  return api.post("/registrations", { event_id: eventId });
}

export async function updateRegistration(registrationId: number, status: string) {
  return api.patch(`/registrations/${registrationId}`, { status });
}

// Judge Assignments API
export async function getJudgeAssignments() {
  return api.get("/judges/assignments");
}

export async function getJudgeWorkload() {
  return api.get("/judges/workload");
}

// Sponsorships API
export async function getSponsorships(filters?: any) {
  return api.get("/sponsorships", { params: filters });
}

export async function createSponsorship(eventId: number, amount: number, tier: string) {
  return api.post("/sponsorships", { event_id: eventId, amount, tier });
}
```

### 2. Update `src/hooks/useEvents.ts`

**Before:**

```typescript
interface EventData {
  event_id: number;
  event_name: string;
  participants: number; // from participants table count
  judge_id: number; // legacy
}
```

**After:**

```typescript
interface EventData {
  event_id: number;
  event_name: string;
  registered_participants: number; // from registrations count
  assigned_judge_id: number; // from events.assigned_judge_id
  event_status: "created" | "open" | "ongoing" | "completed";
  prize_pool: number;
  sponsorship_total: number;
  total_prize_pool: number;
}

export function useEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (filters?: { category?: string; from?: string; to?: string }) => {
    setLoading(true);
    try {
      const response = await getEvents(filters);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: number) => {
    try {
      const response = await api.post("/registrations", {
        event_id: eventId,
        team_id: null,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to register for event");
    }
  };

  return { events, loading, fetchEvents, registerForEvent };
}
```

### 3. Update `src/hooks/useDashboard.ts`

**Add type definitions:**

```typescript
interface ParticipantDashboard {
  myEvents: Array<{
    registration_id: number;
    event_id: number;
    event_name: string;
    status: "pending" | "confirmed" | "cancelled";
    registered_at: string;
    current_registrations: number;
    max_participants: number;
  }>;
  payments: PaymentRecord[];
  stats: {
    registered_count: number;
    paid_count: number;
    pending_payment: number;
  };
}

interface JudgeDashboard {
  assigned: Array<{
    event_id: number;
    event_name: string;
    total_rounds: number;
  }>;
  submitted: ScoreRecord[];
  pending: PendingEvaluation[];
  stats: {
    assigned_count: number;
    submitted_count: number;
    pending_count: number;
  };
}

interface OrganizerDashboard {
  events: Array<{
    event_id: number;
    event_status: string;
    registered_participants: number;
    max_participants: number;
    fill_rate: number;
  }>;
  judges: JudgeInfo[];
  rounds: EventRound[];
  stats: {
    total_events: number;
    total_registrations: number;
    avg_fill_rate: number;
  };
}

interface SponsorDashboard {
  sponsorInfo: {
    sponsor_id: number;
    name: string;
    sponsorship_tier: string;
    contribution_amount: number;
  };
  sponsoredEvents: Array<{
    event_id: number;
    event_name: string;
    participants_reached: number;
    sponsorship_contribution: number;
  }>;
  stats: {
    total_contribution: number;
    events_sponsored: number;
    total_reach: number;
  };
}
```

### 4. Component Updates

#### Event Registration Component

**Before:**

```typescript
// Outdated - no registration tracking
async function handleRegister(eventId: number) {
  // No clear registration flow
}
```

**After:**

```typescript
async function handleRegister(eventId: number) {
  try {
    // 1. Create registration (status: pending)
    const registration = await api.post("/registrations", {
      event_id: eventId,
      team_id: null,
    });

    // 2. Initiate payment
    const payment = await api.post("/payments", {
      registration_id: registration.data.registration_id,
      amount: event.registration_fee,
      payment_type: "registration",
      method: "card",
    });

    // 3. On successful payment, update registration status
    if (payment.data.status === "completed") {
      await api.patch(`/registrations/${registration.data.registration_id}`, {
        status: "confirmed",
      });
      toast.success("Successfully registered for event!");
    }
  } catch (error) {
    toast.error("Registration failed: " + error.message);
  }
}
```

#### Leaderboard Component

**Before:**

```typescript
// Queried from participants table
const [leaderboard, setLeaderboard] = useState([]);
```

**After:**

```typescript
// Query from vw_event_leaderboard view
async function fetchLeaderboard(eventId: number) {
  const response = await api.get(`/dashboard/judge?event_id=${eventId}`);
  const leaderboard = response.data.leaderboard;
  setLeaderboard(leaderboard);
}
```

#### Judge Assignment Component

**Before:**

```typescript
// Outdated judge structure
const judges = await api.get("/judges");
// Returns judges with separate judge_id and user_id
```

**After:**

```typescript
// Users with role='judge' and judge_assignments
async function getAvailableJudges() {
  const response = await api.get("/users?role=judge");
  return response.data; // Returns users with role='judge'
}

async function assignJudgeToEvent(eventId: number, judgeId: number) {
  return api.post("/judges/assign", {
    event_id: eventId,
    judge_id: judgeId,
  });
}
```

#### Sponsor Contribution Component

**Before:**

```typescript
// sponsor_events + payments tables
const sponsorships = await api.get(`/events/${eventId}/sponsors`);
```

**After:**

```typescript
// Direct sponsorships table
async function getSponsorships(eventId: number) {
  const response = await api.get("/sponsorships", {
    params: { event_id: eventId },
  });
  return response.data; // sponsorship_id, amount, tier, status
}

async function addSponsorship(eventId: number, amount: number, tier: string) {
  return api.post("/sponsorships", {
    event_id: eventId,
    amount,
    tier,
  });
}
```

---

## Data Mapping Guide

### Event List Query Changes

**Old Query:**

```typescript
// Participated events (from participants table)
const myEvents = events.filter((e) =>
  participants.some((p) => p.event_id === e.event_id && p.user_id === userId),
);
```

**New Query:**

```typescript
// Participated events (from registrations table)
const myEvents = events.filter((e) =>
  registrations.some((r) => r.event_id === e.event_id && r.user_id === userId),
);
```

### Judge Info Query Changes

**Old Query:**

```typescript
// Get event judge from judges table
const judge = judges.find((j) => j.judge_id === event.judge_id);
const judgeUser = users.find((u) => u.user_id === judge.user_id);
```

**New Query:**

```typescript
// Get event judge directly from users (no join needed)
const judge = users.find((u) => u.user_id === event.assigned_judge_id);
```

### Payment Status Query Changes

**Old Query:**

```typescript
// Payment from legacy structure
const isPaid = participants.find((p) => p.event_id === eventId && p.payment_status === "completed");
```

**New Query:**

```typescript
// Check both registration and payment tables
const registration = registrations.find(
  (r) => r.event_id === eventId && r.user_id === userId && r.status === "confirmed",
);
const payment = payments.find(
  (p) => p.registration_id === registration?.registration_id && p.status === "completed",
);
```

---

## Redux/State Management Updates

If using Redux, update slices:

```typescript
// slices/eventsSlice.ts
interface EventState {
  items: EventData[];
  selectedEvent: EventData | null;
  loading: boolean;
  registrations: Registration[];
}

const initialState: EventState = {
  items: [],
  selectedEvent: null,
  loading: false,
  registrations: [],
};

// Add registration reducer
builder.addCase(registerForEvent.fulfilled, (state, action) => {
  state.registrations.push(action.payload);
});

// Add judge info to event
builder.addCase(fetchEventDetail.fulfilled, (state, action) => {
  state.selectedEvent = {
    ...action.payload,
    assigned_judge_id: action.payload.assigned_judge_id,
    event_status: action.payload.event_status,
  };
});
```

---

## React Query Updates

If using React Query:

```typescript
// hooks/useEventQueries.ts
export function useRegistrations() {
  return useQuery(["registrations"], () => api.get("/registrations"), { staleTime: 5 * 60 * 1000 });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation((eventId: number) => api.post("/registrations", { event_id: eventId }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["registrations"]);
      queryClient.invalidateQueries(["events"]);
    },
  });
}

export function useEventDetail(eventId: number) {
  return useQuery(["events", eventId], () => api.get(`/events/${eventId}`), {
    select: (response) => {
      const event = response.data;
      return {
        ...event,
        // Ensure all new fields are present
        assigned_judge_id: event.assigned_judge_id,
        event_status: event.event_status,
        prize_pool: event.prize_pool,
        sponsorship_total: event.sponsorship_total,
      };
    },
  });
}
```

---

## Common Patterns

### Check if User is Registered

**Old:**

```typescript
const isRegistered = participants.some((p) => p.user_id === userId && p.event_id === eventId);
```

**New:**

```typescript
const isRegistered = registrations.some(
  (r) => r.user_id === userId && r.event_id === eventId && r.status === "confirmed",
);
```

### Get Registration Status

**Old:**

```typescript
const participant = participants.find((p) => p.user_id === userId && p.event_id === eventId);
const status = participant?.payment_status;
```

**New:**

```typescript
const registration = registrations.find((r) => r.user_id === userId && r.event_id === eventId);
const status = registration?.status; // pending, confirmed, cancelled
const paymentStatus = payments.find(
  (p) => p.registration_id === registration?.registration_id,
)?.status;
```

### Update Event after Judge Assignment

**Old:**

```typescript
event.judge_id = judgeId;
```

**New:**

```typescript
event.assigned_judge_id = judgeId;
// Also create judge_assignments record on backend
```

---

## Testing Checklist

- [ ] Event listing shows correct participant counts
- [ ] Registration flow creates registration and payment records
- [ ] Judge assignment updates event.assigned_judge_id
- [ ] Leaderboard queries work with new structure
- [ ] Payment status correctly reflects registration confirmation
- [ ] Dashboard endpoints return all expected data
- [ ] Role-based filtering works (participant, judge, organizer, sponsor)
- [ ] Sponsorship tracking shows correct contribution amounts
- [ ] Team memberships still work with registrations
- [ ] Accommodation bookings independent of registration changes

---

## Migration Checklist

- [ ] Update API client calls in `src/lib/api.ts`
- [ ] Update type definitions for Event, Registration, Payment
- [ ] Update useEvents hook
- [ ] Update useDashboard hook
- [ ] Update event listing components
- [ ] Update registration form/flow
- [ ] Update judge assignment components
- [ ] Update leaderboard queries
- [ ] Update sponsor tracking components
- [ ] Update all data transformations
- [ ] Test full user flows end-to-end
- [ ] Update error handling for new endpoints
- [ ] Update loading states and UI feedback
