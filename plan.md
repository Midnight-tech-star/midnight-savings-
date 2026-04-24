## Plan: Midnight Savings 💯

### Phase 1: Project Setup and Core UI

1.  **Initialize Project:**
    *   Ensure all necessary dependencies are installed.
    *   Set up the basic project structure (`src/` directory, `App.tsx`, `main.tsx`, `index.css`).
    *   Configure Tailwind CSS for styling.

2.  **Branding and Layout:**
    *   Define a consistent color palette (deep blues, silvers, or custom gradient) and typography.
    *   Create a main application layout component that accommodates various sections/routes.
    *   Implement a header/navbar with the brand name "Midnight Savings 💯" and a professional logo.

3.  **User Authentication (Login/Registration):**
    *   Create a `Login/Registration page` component.
    *   Implement a `secure HTML <input type="tel">` for phone number input.
    *   Integrate with a `payment gateway API` for phone number verification (OTP via SMS).
    *   Develop a flow for users to set a secure passcode during registration/first-time login.
    *   Implement logic to distinguish between new and existing members.

4.  **Group Creation UI:**
    *   Create the group creation UI component.
    *   Implement `HTML input type="text" id="groupNameInput"` pre-populated with "Midnight Savings 💯".
    *   Implement a `read-only HTML <p class="current-group-name" aria-live="polite">` element to display the group name dynamically.
    *   Implement `HTML input type="number" id="contributionAmountInput" min="0" value="740"`.
    *   Use CSS/JavaScript to append "KSh" suffix to the contribution amount input and dynamically update it via event listeners.
    *   Create an `HTML <button id="updateContributionBtn" type="button">` for admin updates.

5.  **"Join Group" Button:**
    *   Design a `"Join Group" button component` (`<button id="joinGroupBtn" type="button">`).
    *   Implement conditional rendering based on a `user.isMember` boolean state using frontend state management.

### Phase 2: Admin Dashboard and Membership Management

1.  **Admin Dashboard Route/Component:**
    *   Create the admin dashboard route/component.

2.  **Pending Membership Requests:**
    *   Implement a `dynamic, sortable HTML <table>` for pending membership requests.
    *   Mock data or create a placeholder for fetching data from a backend API endpoint.
    *   Each row should have `interactive accept/reject buttons` (`<button onClick="handleRequest(requestId, 'accept')" data-request-id="[id]">`).
    *   Implement AJAX functionality for status updates (will require backend integration).

3.  **Member List Component:**
    *   Create a `scrollable member list component` (`<div class="member-list-scroll-container" style="overflow-y: auto;">`).
    *   Display member details, initially with mock data, to be fetched from a dedicated API later.

4.  **Paid Members Ledger:**
    *   Create a `paid members ledger component` within the admin dashboard.
    *   Implement a `sortable HTML <table>` displaying `member name`, `amount contributed`, and `payment timestamp` (formatted).
    *   Mock data for now, to be fetched from a backend API.

5.  **Payout Confirmation Checklist:**
    *   Create an `interactive payout confirmation checklist component`.
    *   Dynamically list members eligible for payout.
    *   Implement admin toggles (`<input type="checkbox" data-member-id="..." />`) to mark "Payout Received".
    *   Include a dynamically updated timestamp (`<span>`) recorded via backend API call upon checkbox toggle.

6.  **Weekly Savings Account Report:**
    *   Develop a `weekly savings account report UI component`.
    *   Display `money in and out` summaries.
    *   Include functionality for customizable date ranges.

### Phase 3: Group Rules, Payments, and Transactions

1.  **"Rules" UI Section:**
    *   Create a dedicated `"Rules" UI section/tab` (`<div role="tabpanel" id="rulesTab" aria-labelledby="rulesTabButton">`).
    *   Implement `conditional UI logic` for an "Exit Group" button:
        *   Disable (`<button id="exitGroupBtn" disabled>`) if `roundActive` is true.
        *   Trigger a warning confirmation modal ("Cannot exit during an active round") if `roundActive` is true.

2.  **Real-time Countdown Timer:**
    *   Implement a `real-time countdown timer component` (`<span id="countdownTimer" aria-live="assertive">`).
    *   Target Saturday at 9:00 PM local time.
    *   Update every second using `JavaScript's setInterval()`.

3.  **Payment Status Indicator:**
    *   Add a `payment status indicator` (e.g., "Paid", "Pending" badges/labels with `.status-paid`, `.status-pending` classes) for each member in the member list.
    *   Dynamically render based on payment data.

4.  **Member Dismissal:**
    *   Provide admin buttons for member dismissal within the member list.
    *   Each button should trigger a confirmation modal before processing via a backend API.

5.  **Disbursement Eligibility and Schedule:**
    *   Display `disbursement eligibility status` ("Eligible", "Ineligible" with distinct CSS styles).
    *   Show the `disbursement schedule` (Sunday mornings, based on shares).

6.  **"Payment Info" UI Section:**
    *   Create a static `"Payment Info" UI section`.
    *   Display Treasurer's number (0713703322) and M-Pesa Till No. (3344034).

7.  **Transaction History Log:**
    *   Develop a `scrollable transaction history log component` (`<div class="transaction-history" style="overflow-y: scroll;">`).
    *   Fetch data from a backend API, displaying payments, disbursements, joins, exits, ordered by date (newest first).

8.  **Account Closure Confirmation:**
    *   Develop a `confirmation modal dialog` for account closure.
    *   Include a prominent warning: "No compensation will be provided before the term end".
    *   Require user confirmation input.

9.  **New Member Payment Interface:**
    *   Implement a `dedicated payment interface component` for new members only (conditionally rendered).
    *   Require a `100 KSh initial contribution`.
    *   Use `HTML input type="number" id="initialContributionInput" value="100" min="100" readonly`.
    *   Include a `submit button` (`<button id="submitInitialPaymentBtn" type="submit">`).
    *   Initiate a payment gateway transaction.

10. **Payout Transaction Evidence Display:**
    *   Create a `payout transaction evidence display component`.
    *   Allow image uploads or embedding of payment proofs.
    *   Integrate with cloud storage solutions.

### Phase 4: Backend Integration and Refinements

1.  **API Endpoints:**
    *   Define and implement backend API endpoints for:
        *   User authentication (phone number, passcode, OTP).
        *   Group creation and management.
        *   Membership requests (accept/reject).
        *   Fetching member lists.
        *   Fetching transaction history.
        *   Fetching paid members ledger data.
        *   Member dismissal.
        *   Payout confirmation updates.
        *   Payment processing and verification.
        *   Storing and retrieving payout transaction evidence.

2.  **Database Schema:**
    *   Design and implement database schema for users, groups, memberships, transactions, etc. (Consider Supabase if needed).

3.  **State Management:**
    *   Implement robust frontend state management (e.g., Context API, Zustand, Redux) for user authentication, group state, UI states, etc.

4.  **Error Handling and Validation:**
    *   Implement comprehensive client-side and server-side validation.
    *   Implement clear error handling and user feedback mechanisms.

5.  **Testing:**
    *   Write unit and integration tests for frontend components and backend logic.

6.  **Final Review and Deployment:**
    *   Review all implemented features against the requirements.
    *   Ensure branding consistency.
    *   Deploy the application.
