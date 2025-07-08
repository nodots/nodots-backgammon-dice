import cors from 'cors'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { EnhancedRandomGenerator } from './services/randomService'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Initialize enhanced random generator
const randomGenerator = new EnhancedRandomGenerator()

// In-memory storage for audit trail
const rollHistory: Array<{
  id: string
  die: number
  timestamp: string
  rollNumber: number
  entropyInfo?: object
}> = []

let rollCounter = 0

// Ultra-enhanced die rolling with maximum entropy sources
function rollDie(): number {
  // Use the enhanced random generator for maximum randomness
  return randomGenerator.rollDie()
}

// Single endpoint to roll a die
app.post('/roll', (req, res) => {
  const die = rollDie()
  rollCounter++

  const roll = {
    id: uuidv4(),
    die,
    timestamp: new Date().toISOString(),
    rollNumber: rollCounter,
    entropyInfo: randomGenerator.getEntropyInfo(),
  }

  rollHistory.push(roll)

  res.json({
    success: true,
    data: roll,
    auditTrail: {
      totalRolls: rollCounter,
      lastRoll:
        rollHistory.length > 1 ? rollHistory[rollHistory.length - 2] : null,
    },
  })
})

// Get audit trail
app.get('/audit', (req, res) => {
  res.json({
    success: true,
    data: {
      totalRolls: rollCounter,
      rolls: rollHistory,
    },
  })
})

// Get entropy information
app.get('/entropy', (req, res) => {
  res.json({
    success: true,
    data: {
      currentEntropy: randomGenerator.getEntropyInfo(),
      randomMethod: 'Ultra-Enhanced Entropy Pool',
      description:
        'Uses multiple crypto sources, system metrics, and advanced entropy mixing for maximum randomness',
      features: [
        'Multiple crypto.randomBytes sources',
        'System memory and CPU metrics',
        'Entropy history and counter',
        'Advanced bit-shifting mixing',
        'Triple-pass entropy combination',
      ],
    },
  })
})

app.listen(PORT, () => {
  console.log(`Dice API running on port ${PORT}`)
})
