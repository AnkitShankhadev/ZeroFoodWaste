# Task Acceptance Flow - Complete Implementation

## Overview

This document outlines the complete flow for volunteers accepting and completing delivery tasks in the ZeroFoodWaste application.

## Flow Diagram

```
VOLUNTEER ACCEPTS TASK
         ↓
    Status: PENDING
    Notification → Donor & NGO
         ↓
VOLUNTEER MARKS PICKED UP
    (Mark as Picked Up Button)
         ↓
    Status: IN_PROGRESS
    Donation Status: IN_TRANSIT
    Notification → Donor & NGO
         ↓
VOLUNTEER MARKS COMPLETED
   (Mark as Completed Button)
         ↓
    Status: COMPLETED
    Donation Status: DELIVERED
    Points Awarded: 50 pts
    Notifications → Donor, NGO & Volunteer
```

## Frontend Implementation

### Files Modified:

- **src/lib/api.ts** - API methods
- **src/pages/dashboard/VolunteerDashboard.tsx** - UI and handlers

### New State Variables:

```typescript
const [isAcceptingTask, setIsAcceptingTask] = useState(false);
const [isMarkingPickedUp, setIsMarkingPickedUp] = useState(false);
const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
```

### Key Handlers:

#### 1. handleAcceptTask(donationId)

- Calls `api.acceptTask(donationId)`
- Creates a new assignment with status `PENDING`
- Reloads both assignments and available tasks
- Shows loading state with spinner

**Endpoint:** `POST /api/matching/accept-task/:donationId`

#### 2. handleMarkPickedUp()

- Calls `api.updateAssignmentStatus(assignmentId, "IN_PROGRESS")`
- Updates assignment status to `IN_PROGRESS`
- Updates donation status to `IN_TRANSIT`
- Shows loading state with spinner

**Endpoint:** `PUT /api/matching/assignments/:id/status`

#### 3. handleMarkCompleted()

- Calls `api.completeAssignment(assignmentId)`
- Updates assignment status to `COMPLETED`
- Updates donation status to `DELIVERED`
- Awards 50 points to volunteer
- Reloads both assignments and available tasks
- Shows loading state with spinner

**Endpoint:** `POST /api/matching/assignments/:id/complete`

## Backend Implementation

### Files Modified:

- **src/controllers/matchingController.js** - All task acceptance logic

### Endpoints Updated:

#### 1. POST /api/matching/accept-task/:donationId

**Handler:** `volunteerAcceptTask`

**Flow:**

- Validates donation exists and status is `ACCEPTED`
- Checks if task already assigned
- Checks volunteer doesn't have active task
- Creates new `PickupAssignment` with status `PENDING`
- Updates donation status to `ASSIGNED`
- **Sends Notifications:**
  - Donor: "A volunteer has accepted your donation: {foodType}"
  - NGO: "Volunteer {name} has accepted pickup for: {foodType}"
- Returns populated assignment

**Business Rules:**

- ✅ Volunteer can only accept if they have no active delivery
- ✅ Task must not already be assigned
- ✅ Donation must be in `ACCEPTED` status

#### 2. PUT /api/matching/assignments/:id/status

**Handler:** `updateAssignmentStatus`

**Statuses Supported:**

- `PENDING` → `IN_PROGRESS`
- `IN_PROGRESS` → `COMPLETED`
- Any → `CANCELLED`

**For IN_PROGRESS:**

- Sets `startedAt` timestamp
- Updates donation to `IN_TRANSIT`
- **Sends Notifications:**
  - Donor: "Your donation is on the way! Volunteer {name} has picked it up."
  - NGO: "Pickup in progress for: {foodType}"

**For COMPLETED:**

- Sets `completedAt` timestamp
- Updates donation to `DELIVERED`
- Awards 50 points to volunteer
- **Sends Notifications:**
  - Donor: "Your donation has been delivered successfully!"
  - NGO: "Donation delivery completed: {foodType}"
  - Volunteer: "Delivery completed! You earned 50 points."

**For CANCELLED:**

- Sets `cancelledAt` timestamp
- Reverts donation to `ACCEPTED` status
- Clears assignment
- **Sends Notifications:**
  - NGO: "Volunteer cancelled the pickup for: {foodType}"

#### 3. POST /api/matching/assignments/:id/complete

**Handler:** `completeAssignment`

**Flow:**

- Validates assignment exists and volunteer is authorized
- Sets status to `COMPLETED`
- Sets `completedAt` timestamp
- Updates donation to `DELIVERED`
- Awards 50 points
- **Sends Notifications:**
  - Donor: "Your donation has been delivered successfully!"
  - NGO: "Donation delivery completed: {foodType}"
  - Volunteer: "Delivery completed! You earned 50 points."

## Notification System

The system sends real-time notifications at each stage:

| Event             | Recipient             | Message                           |
| ----------------- | --------------------- | --------------------------------- |
| Task Accepted     | Donor, NGO            | Volunteer accepted the task       |
| Pickup Started    | Donor, NGO            | Donation is on the way            |
| Delivery Complete | Donor, NGO, Volunteer | Delivery confirmed, points earned |
| Task Cancelled    | NGO                   | Volunteer cancelled pickup        |

## UI Components Updated

### Available Tasks Section

- Shows list of donations accepted by NGOs but not yet assigned
- Shows donor/pickup location and NGO/dropoff location
- "Accept Task" button with loading state
- Disabled while accepting

### Active Delivery Section

- Shows current assignment details
- "Mark as Picked Up" button (visible when status is PENDING)
  - Disabled while marking up
- "Mark as Completed" button (visible when status is IN_PROGRESS)
  - Disabled while marking completed
- Both buttons show loading spinners

## Data Validation

**Frontend Validations:**

- ✅ Button disabled during API calls
- ✅ Loading states prevent double-clicks
- ✅ Error toasts show API errors
- ✅ Success toasts confirm actions

**Backend Validations:**

- ✅ Volunteer authorization checks
- ✅ Status transition validation
- ✅ Duplicate task prevention
- ✅ Active delivery limits

## Points System

- **Points Awarded:** 50 points per completed delivery
- **Trigger:** When status changes to `COMPLETED`
- **Recipient:** The volunteer who completed the task
- **Notification:** Volunteer receives confirmation message

## Database Updates

When a task is completed:

1. **PickupAssignment:** status → COMPLETED, completedAt → timestamp
2. **FoodDonation:** status → DELIVERED
3. **User (Volunteer):** totalPoints += 50

## Error Handling

All endpoints include proper error handling for:

- Invalid task/assignment IDs
- Unauthorized access attempts
- Invalid status transitions
- Already completed tasks
- Volunteer with active delivery
- Task already assigned

## Testing Scenarios

1. **Accept Task**
   - Volunteer clicks "Accept Task"
   - Task moves to current delivery
   - Available tasks list updates
   - Notifications sent

2. **Mark as Picked Up**
   - Volunteer marks food as picked up
   - Status changes to IN_PROGRESS
   - Button switches to "Mark as Completed"
   - Notifications sent

3. **Mark as Completed**
   - Volunteer marks delivery complete
   - 50 points awarded
   - Available tasks reload
   - New task can be accepted

4. **Cancel Delivery**
   - Volunteer calls updateAssignmentStatus with CANCELLED
   - Task reverts to ACCEPTED
   - NGO notified
   - Volunteer can accept new task

## Security Considerations

- ✅ All endpoints require authentication (protect middleware)
- ✅ Volunteer role verification
- ✅ Ownership validation (only assigned volunteer can update)
- ✅ Status transition validation
- ✅ Points awarded only on actual completion
