# React Routing Lab

A stripped-down React + TypeScript + MUI app based on the original `react-back-button-lab`.

This version intentionally removes the custom back-button/history examples so we can add them back slowly, one concept at a time.

## What has been removed

- Browser history logging
- Raw `history.back()`
- Raw `history.forward()`
- Raw `history.pushState()`
- Raw `history.replaceState()`
- `popstate` event handling
- React Router `replace` navigation examples
- Unsaved-form navigation blocking with `useBlocker`
- URL/search-param workflow state

## What remains

- React
- TypeScript
- Vite
- MUI
- React Router
- A simple app shell
- A few normal routed pages
- One simple programmatic navigation example
- One local-state-only SPA workflow example

## Install

```bash
yarn
yarn dev
```

or:

```bash
npm install
npm run dev
```

## Pages

- Home
- Customers
- Reports
- SPA Workflow

## Purpose

This is now the clean starting point.

From here, we can add back-button behavior step by step and observe exactly what each change does.
