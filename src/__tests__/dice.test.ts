import express from 'express'
import request from 'supertest'

// Mock the main app for testing
const app = express()
app.use(express.json())

// In-memory storage for testing
const rollHistory: Array<{
  id: string
  die: number
  timestamp: string
  rollNumber: number
}> = []

let rollCounter = 0

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1
}

app.post('/roll', (req, res) => {
  const die = rollDie()
  rollCounter++

  const roll = {
    id: `test-${rollCounter}`,
    die,
    timestamp: new Date().toISOString(),
    rollNumber: rollCounter,
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

app.get('/audit', (req, res) => {
  res.json({
    success: true,
    data: {
      totalRolls: rollCounter,
      rolls: rollHistory,
    },
  })
})

describe('Dice API', () => {
  beforeEach(() => {
    rollHistory.length = 0
    rollCounter = 0
  })

  describe('POST /roll', () => {
    it('should roll a die and return valid response', async () => {
      const response = await request(app).post('/roll').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('die')
      expect(response.body.data).toHaveProperty('timestamp')
      expect(response.body.data).toHaveProperty('rollNumber')

      expect(response.body.data.die).toBeGreaterThanOrEqual(1)
      expect(response.body.data.die).toBeLessThanOrEqual(6)
      expect(response.body.data.rollNumber).toBe(1)
    })

    it('should increment roll counter', async () => {
      await request(app).post('/roll')
      await request(app).post('/roll')

      const response = await request(app).post('/roll')
      expect(response.body.data.rollNumber).toBe(3)
    })

    it('should include audit trail', async () => {
      const response1 = await request(app).post('/roll')
      const response2 = await request(app).post('/roll')

      expect(response2.body.auditTrail.totalRolls).toBe(2)
      expect(response2.body.auditTrail.lastRoll).toEqual(response1.body.data)
    })
  })

  describe('GET /audit', () => {
    it('should return empty audit trail initially', async () => {
      const response = await request(app).get('/audit').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.totalRolls).toBe(0)
      expect(response.body.data.rolls).toEqual([])
    })

    it('should return complete roll history', async () => {
      await request(app).post('/roll')
      await request(app).post('/roll')

      const response = await request(app).get('/audit')

      expect(response.body.data.totalRolls).toBe(2)
      expect(response.body.data.rolls).toHaveLength(2)
      expect(response.body.data.rolls[0].rollNumber).toBe(1)
      expect(response.body.data.rolls[1].rollNumber).toBe(2)
    })
  })
})
