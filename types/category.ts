import { Player } from "./player"

export type CategoryType = "numeric" | "categorical" | "array"

export type Category = {
  key: keyof Player
  type: CategoryType
  hasClose?: boolean
  closeThreshold?: number
}