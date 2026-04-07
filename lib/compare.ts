import { Player } from "@/types/player"
import { Category } from "@/types/category"

export type CompareResult =
  | "correct"
  | "higher"
  | "lower"
  | "close"
  | "incorrect"

export function compare(
  guess: Player,
  target: Player,
  category: Category
): CompareResult {
  const guessValue = guess[category.key]
  const targetValue = target[category.key]

  // 🧩 ARRAY (position)
  if (category.type === "array") {
    const guessArr = guessValue as string[]
    const targetArr = targetValue as string[]

    const match = guessArr.some((val) => targetArr.includes(val))
    return match ? "correct" : "incorrect"
  }

  // 🔢 NUMERIC
  if (category.type === "numeric") {
    const g = (guessValue as number) ?? 0
    const t = (targetValue as number) ?? 0

    if (g === t) return "correct"

    if (
      category.hasClose &&
      Math.abs(g - t) <= (category.closeThreshold || 0)
    ) {
      return "close"
    }

    return g < t ? "higher" : "lower"
  }

  // 🔤 CATEGORICAL
  if (category.type === "categorical") {
    return guessValue === targetValue ? "correct" : "incorrect"
  }

  return "incorrect"
}