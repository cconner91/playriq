import { Category } from "@/types/category"

export const categories: Category[] = [
  { key: "team", type: "categorical" },
  { key: "position", type: "array" },

  { key: "age", type: "numeric", hasClose: true, closeThreshold: 2 },

  { key: "teamsPlayedFor", type: "numeric", hasClose: true, closeThreshold: 1 },

  {
    key: "totalTDsResponsible",
    type: "numeric",
    hasClose: true,
    closeThreshold: 5,
  },

  { key: "proBowls", type: "numeric", hasClose: true, closeThreshold: 1 },

  // NEW CATEGORIES (optional) ✅
  { key: "college", type: "categorical" },
  { key: "draftRound", type: "numeric", hasClose: true, closeThreshold: 1 },
  { key: "draftPick", type: "numeric", hasClose: true, closeThreshold: 10 },
]