# Redux Practice Project

> 📚 Part of the course: **[React - The Complete Guide (incl. Next.js, Redux)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)** on Udemy.

---

## About This Project

This project is a hands-on practice application built while studying the **"Diving into Redux (An Alternative To The Context API)"** section of the React course.

It is NOT just a coding exercise. It is a **study workbook** and **mental model guide**. Every concept learned — from the core Redux architecture to Redux Toolkit — is documented here in detail, explained through the lens of a **Product Engineer** who understands the _why_ behind every decision, not just the _how_.

### What the App Does

The app demonstrates two real-world Redux use cases implemented with **Redux Toolkit**:

1.  **Authentication Flow:** A login/logout system where the UI conditionally renders based on the user's authentication state (`isAuthenticated`). The `Header` shows navigation links only when logged in. The `Auth` form is replaced by a `UserProfile` and `Counter` upon successful login.

2.  **Counter Feature:** A counter component with Increment, Decrement, and custom Increase-by-10 actions. The counter display can be toggled on/off using a visibility action. All counter state is managed in a dedicated Redux slice.

### Tech Stack

- **React** (with functional components and hooks)
- **Redux** (Classic Redux for foundational understanding)
- **Redux Toolkit** (`createSlice`, `configureStore`, `useSelector`, `useDispatch`)
- **React-Redux** (`<Provider>`, `useSelector`, `useDispatch`)
- **CSS Modules** for scoped component styling

### Project Structure

```
src/
├── components/
│   ├── Auth.js           ← Login form, dispatches authActions.login()
│   ├── Counter.js        ← Counter UI, reads & dispatches counterActions
│   ├── Header.js         ← Nav bar, conditionally renders based on auth state
│   └── UserProfile.js    ← Shown only when authenticated
└── store/
    ├── index.js          ← configureStore entry point (combines all slices)
    ├── counter-slice.js  ← Counter slice: state, reducers & actions
    └── auth-slice.js     ← Auth slice: state, reducers & actions
```

---

## Core Concepts Studied

### 1. What is Redux?

- Redux is a **predictable state container** for JavaScript applications.
- It acts as an **External Brain** or **Central Vault** for your application's state, decoupling the state from the React component tree.
- It solves the problem of "Prop Drilling" (passing data through multiple layers of components) and unpredictable state mutations by enforcing strict, standardized rules on how data can change.

### 2. Redux vs. React Context API

Both solve the "prop drilling" problem, but they are architecturally different:

- **React Context (The Delivery System):** Best for low-frequency updates (e.g., Theme toggling, Auth state, Locale/Language). If a Context value changes, it strictly forces all consuming components to re-render, creating a major performance bottleneck for frequently changing data.
- **Redux (Complete State Management System):** Best for high-frequency updates (e.g., counters, tracking typing users, live data feeds). Redux selectively triggers re-renders only for the specific components that care about the exact piece of data that changed.

### 3. The Flux Architecture vs MVC

- **MVC (Model-View-Controller):** The older web standard. In massive applications, MVC often results in unpredictable "spaghetti" data flows because models and views can mutate and trigger each other from multiple directions simultaneously.
- **Flux (The Redux Blueprint):** Invented by Facebook to solve MVC issues by enforcing a strict **Unidirectional Data Flow**. Data only ever moves in one perfect circle.

### 4. The 4 Pillars of the Redux Flow (The Unidirectional Cycle)

Data flows completely predictably through these four steps:

1. **The Store (The Vault):** A single giant JavaScript object that holds the absolute truth for the entire state of the application.
2. **The Components (The UI):** They read data from the store to display it. They **cannot directly mutate** the state. They can only issue a formal paper request by triggering an Action.
3. **The Action (The Request Form):** A simple JavaScript object describing _what_ should happen, always having a `type` property (e.g., `{ type: 'INCREMENT', payload: 1 }`). The component _dispatches_ this Action.
4. **The Reducer (The Brain):** A **Pure Function** that receives two arguments: the current giant state object from the Store, and the Action. The Reducer uses logic to calculate the new state and returns a **brand new copy** of the object. **It never modifies the old state object directly.**

### 5. Why Reducers MUST be Pure Functions

- A Pure Function guarantees: **Same Inputs = Same Outputs**, and **Zero Side Effects** (No external API calls, `localStorage` checks, or manipulating variables outside its scope).
- Redux demands purity so the state transitions are 100% mathematically Predictable. This predictability is what powers the famous Redux Developer Tools, unlocking the ability to use "Time-Travel Debugging" by scrubbing backward and forward through past states.
- Because every dispatch executes the entire Reducer function again top-to-bottom, the code inside a Reducer must be very fast to prevent app freezing.

### 6. The Overwriting Rule (Immutability)

- When a Reducer calculates the new state, Redux takes exactly what the Reducer returns and uses it to completely overwrite and replace the old Store object.
- Therefore, to update only a single property, we must always copy all the other unchanged data into our new return object (using the JavaScript spread operator `...oldState`) so we don't accidentally delete the rest of the application's data.

---

### 7. Providing the Redux Store to the React App

- After creating the store, React has no idea it exists. We must connect the two using the `<Provider>` component from the `react-redux` library.
- Wrap the entire `<App />` inside `<Provider store={store}>` in `src/index.js`. This is the highest level of the React tree, ensuring every component in the entire app can access the Store.
- Think of the `<Provider>` as installing a power grid. The Redux Store is the Power Plant. The `<Provider>` lays the power lines to every house (component) in the city (app).

### 8. Reading Data from the Store: `useSelector`

- `useSelector` is a hook from `react-redux` that allows a component to extract (select) a specific slice of data from the Redux Store.
- It takes a **Selector Function** as its argument: `const counter = useSelector(state => state.counter);`
- **What it does internally:**
  1. **Extraction**: It runs the Selector function, passing the full Store state object in as the argument, and returns only the specific value you asked for.
  2. **Precision Subscription**: It automatically subscribes the component to that specific slice of data. After every Action is dispatched, Redux re-runs your Selector and compares the new result to the old one. If different → re-render. If same → do nothing.

#### `useSelector` vs `useStore`

|                     | `useSelector`                    | `useStore`                              |
| ------------------- | -------------------------------- | --------------------------------------- |
| **What it reads**   | A precise slice of state         | The entire raw Store object             |
| **Re-renders when** | Only the selected slice changes  | ❌ Never. Does not subscribe.           |
| **When to use**     | ✅ Always for displaying UI data | Rarely. Advanced background tasks only. |

### 9. The One-Store Rule (Single Source of Truth)

- While you can technically create multiple Redux stores, **you must never do this**. It destroys every advantage Redux provides.
- Multiple stores break the unified audit trail, make Time-Travel Debugging impossible, and create data synchronization nightmares between stores.
- The correct approach for handling multiple domains of data (Auth, Cart, Products) is to create **multiple Reducer functions** and merge them into a single Store using `configureStore` from Redux Toolkit.

### 10. Redux Toolkit: `createSlice` & `configureStore`

- **Classic Redux** requires a lot of repetitive boilerplate: manual Action types, manual `...state` spreading, and a giant Reducer with many `if` blocks.
- **Redux Toolkit** eliminates all of this by introducing `createSlice`, which bundles the `initialState`, all Reducers, and auto-generated Action Creators into a single, self-contained unit called a **Slice**.
- **Immer** is built into RTK, allowing you to write code that looks like direct mutation (`state.counter++`) while RTK safely handles immutability under the hood.
- **`configureStore`** replaces `createStore` and accepts a `reducer` map object where each key defines the state property name used in `useSelector`.

### 11. Action Payloads

- The `type` of an Action answers: **"What happened?"**
- The `payload` answers: **"With what data?"**
- In RTK, when you dispatch `counterActions.increase(10)`, the `10` is automatically wrapped as `action.payload` inside the Reducer, making dynamic data passing clean and standardized.

### 12. Splitting Redux into Feature Files (Scalable Architecture)

The Industry-standard folder structure for a scalable Redux setup:

```
src/store/
├── index.js         ← ONLY configureStore (the entry point)
├── counter-slice.js ← Self-contained counter feature slice
└── auth-slice.js    ← Self-contained auth feature slice
```

Each slice file exports its own Actions. Components import Actions directly from their slice file, not from `store/index.js`. Adding a new feature means creating a new slice file and registering it in `index.js` only — zero impact on other files.

---

### ✅ The Complete Redux Cycle (Verified Mental Model)

This is the full, end-to-end flow of Redux validated as a perfect mental model:

1. There is **one giant Redux Store** — the Single Source of Truth for all global state in the app.
2. **Components that need data subscribe** to the Store automatically when they use the `useSelector` hook.
3. When a **user interacts** with a component, the component **dispatches an Action** (a plain JS object). It never touches the Store directly.
4. The Action is **forwarded to the Reducer function**, which receives the current state and the Action as arguments.
5. The Reducer **returns a brand-new state object** (never mutating the old one) based on the Action type.
6. Redux **compares the new state to the old one**. If it changed, it notifies all subscribed components.
7. All subscribed components re-execute their **Selector function** (the one passed to `useSelector`). React-Redux passes the entire new Store state into it.
8. If the specific data the Selector returns **has changed** from what it returned before → the component **re-renders**. If it is the same → the component is **ignored**.

> **Key Immutability Note:** The Reducer does not "update" the Store. It returns a completely new state object. Redux discards the old state and replaces it with the new one. This is what makes Time-Travel Debugging possible.

---

## 🤝 Acknowledgements

This learning journey was made significantly richer thanks to AI-powered tools that elevated the study experience from simply following a course to developing a genuine **senior engineering mindset**.

- **[Google Antigravity AI Agent](https://deepmind.google/)** — acted as a dedicated senior engineer and personal instructor throughout this entire section. Every concept was explained in depth — including JavaScript internals and under-the-hood mechanics — with a constant focus on the _why_ behind every architectural decision, not just the _how_. This helped build the mental models that real Product Engineers rely on.

- **Code Wiki** — used to explore and navigate the actual React and Redux open-source repositories, providing direct insight into how these libraries are built and designed at the source code level.

Thanks to AI tools like these, the role of a software engineer is evolving. The future belongs to **Product Engineers** — developers who leverage AI to build smarter, faster, and with deeper architectural understanding.
