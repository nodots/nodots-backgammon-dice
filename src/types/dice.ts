export interface DiceRoll {
  id: string
  dice: [number, number]
  timestamp: string
  isDoubles: boolean
  total: number
  rollNumber: number
}

export interface DiceRollResponse {
  success: boolean
  data: DiceRoll
  auditTrail: {
    totalRolls: number
    lastRoll: DiceRoll | null
  }
}
