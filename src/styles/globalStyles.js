import { createGlobalStyle } from 'styled-components';

/**
 * Global Styles - Shared across all pages.
 * Import this ONCE in App.js and render <GlobalStyle /> inside the Router.
 *
 * Design Token Reference:
 *   Colors:     --primary, --primary-dark, --primary-light, --accent
 *   Semantic:   --success, --warning, --danger
 *   Text:       --text, --text-muted, --text-dim
 *   Surfaces:   --bg1, --bg2, --bg3
 *   Glass:      --glass, --glass-dark
 *   Borders:    --border, --border-light
 *   Misc:       --shadow, --shadow-lg, --radius, --radius-sm, --transition, --ring
 *
 * Breakpoints (use in media queries):
 *   xs:  480px   (very small phones)
 *   sm:  640px   (small phones/landscape)
 *   md:  768px   (tablets)
 *   lg:  1024px  (small laptops)
 *   xl:  1280px  (desktops)
 *   2xl: 1536px  (large desktops)
 */

const GlobalStyle = createGlobalStyle`
  /* ===================== CSS DESIGN TOKENS ===================== */
  :root {
    /* Backgrounds */
    --bg1: #0a0e1a;
    --bg2: #0f172a;
    --bg3: #1e293b;

    /* Brand Colors */
    --primary: #667eea;
    --primary-dark: #5a67d8;
    --primary-light: #8ba4f9;
    --accent: #22d3ee;

    /* Semantic Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;

    /* Text */
    --text: #f1f5f9;
    --text-muted: #94a3b8;
    --text-dim: #64748b;

    /* Glass / Surface */
    --glass: rgba(255, 255, 255, 0.08);
    --glass-dark: rgba(255, 255, 255, 0.04);

    /* Borders */
    --border: rgba(255, 255, 255, 0.12);
    --border-light: rgba(255, 255, 255, 0.06);

    /* Shadows */
    --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 35px 60px -12px rgba(0, 0, 0, 0.6);
    --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.25);

    /* Shape */
    --radius: 20px;
    --radius-sm: 14px;
    --radius-xs: 10px;

    /* Interaction */
    --ring: 0 0 0 4px rgba(102, 126, 234, 0.2);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-fast: all 0.15s ease;

    /* Responsive Spacing (used in component padding) */
    --page-padding-x: clamp(16px, 5vw, 48px);
    --page-padding-y: clamp(16px, 4vw, 40px);
    --container-max: 1200px;
    --card-padding: clamp(16px, 3vw, 28px);
  }

  /* ===================== BASE RESETS ===================== */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html,
  body,
  #root {
    height: 100%;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    color: var(--text);
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
      Roboto, Helvetica, Arial, sans-serif;
    font-size: clamp(13px, 1.5vw, 15px);
    line-height: 1.6;
    background:
      radial-gradient(1200px 800px at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
      radial-gradient(800px 600px at 80% 20%, rgba(34, 211, 238, 0.12) 0%, transparent 50%),
      linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 50%, var(--bg3) 100%);
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ===================== SCROLLBARS ===================== */
  ::-webkit-scrollbar {
    width: 8px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg2);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  /* ===================== TYPOGRAPHY ===================== */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    line-height: 1.2;
    font-weight: 700;
  }

  p {
    margin: 0;
  }

  a {
    color: var(--primary-light);
    text-decoration: none;
  }
  a:hover {
    color: var(--accent);
  }

  /* ===================== FORM ELEMENTS ===================== */
  input, select, textarea, button {
    font-family: inherit;
    font-size: inherit;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px var(--bg2) inset;
    -webkit-text-fill-color: var(--text);
    transition: background-color 5000s ease-in-out 0s;
  }

  /* ===================== ANIMATIONS ===================== */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  .fade-in {
    animation: fadeIn 0.3s ease forwards;
  }

  /* ===================== REACT DATE PICKER OVERRIDES ===================== */
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg2);
    box-shadow: var(--shadow);
    color: var(--text);
  }

  .react-datepicker__header {
    background: var(--glass);
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker-time__header {
    color: var(--text);
  }

  .react-datepicker__day {
    color: var(--text-muted);
    border-radius: 8px;
    transition: var(--transition-fast);
  }

  .react-datepicker__day:hover {
    background: var(--glass);
    color: var(--text);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: var(--primary) !important;
    color: white !important;
  }

  .react-datepicker__navigation-icon::before {
    border-color: var(--text-muted);
  }

  .react-datepicker__month-select,
  .react-datepicker__year-select {
    background: var(--bg3);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 2px 6px;
  }

  /* ===================== RESPONSIVE UTILITY CLASSES ===================== */

  /* Hide/show helpers */
  .hide-mobile  { @media (max-width: 640px)  { display: none !important; } }
  .hide-tablet  { @media (max-width: 1024px) { display: none !important; } }
  .show-mobile  { display: none; @media (max-width: 640px)  { display: block !important; } }

  /* Overflow-scrollable table wrapper — add this class on the wrapper div */
  .table-scroll-x {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: var(--radius-xs);
  }

  /* Page wrapper used across all pages */
  .hr-page {
    min-height: 100vh;
    padding: var(--page-padding-y) var(--page-padding-x);
  }

  .hr-container {
    max-width: var(--container-max);
    margin: 0 auto;
    width: 100%;
  }
`;

export default GlobalStyle;
