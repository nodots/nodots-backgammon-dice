import axios from 'axios'

const API_BASE = 'http://localhost:4000'

interface RollResult {
  success: boolean
  data: {
    id: string
    die: number
    timestamp: string
    rollNumber: number
  }
  auditTrail: {
    totalRolls: number
    lastRoll: any
  }
}

async function runSimulation(rolls: number = 1000): Promise<void> {
  console.log(`Starting simulation: ${rolls} dice rolls...`)

  const results: number[] = []
  const startTime = Date.now()

  for (let i = 0; i < rolls; i++) {
    try {
      const response = await axios.post<RollResult>(`${API_BASE}/roll`)
      results.push(response.data.data.die)

      if ((i + 1) % 100 === 0) {
        console.log(`Completed ${i + 1} rolls...`)
      }
    } catch (error) {
      console.error(`Error on roll ${i + 1}:`, error)
      break
    }
  }

  const endTime = Date.now()
  const duration = endTime - startTime

  console.log(`\n=== SIMULATION RESULTS ===`)
  console.log(`Total rolls: ${results.length}`)
  console.log(`Duration: ${duration}ms`)
  console.log(
    `Average time per roll: ${(duration / results.length).toFixed(2)}ms`
  )

  // Calculate distribution
  const distribution = new Map<number, number>()
  for (let i = 1; i <= 6; i++) {
    distribution.set(i, 0)
  }

  results.forEach((die) => {
    distribution.set(die, (distribution.get(die) || 0) + 1)
  })

  console.log(`\n=== DICE DISTRIBUTION ===`)
  const expected = results.length / 6
  console.log(`Expected frequency per number: ${expected.toFixed(2)}`)
  console.log(`\nNumber | Count | Percentage | Deviation`)
  console.log(`-------|-------|------------|----------`)

  for (let i = 1; i <= 6; i++) {
    const count = distribution.get(i) || 0
    const percentage = ((count / results.length) * 100).toFixed(2)
    const deviation = (((count - expected) / expected) * 100).toFixed(2)
    console.log(
      `   ${i}   |  ${count
        .toString()
        .padStart(4)}  |    ${percentage}%   |   ${deviation}%`
    )
  }

  // Calculate statistics
  const mean = results.reduce((sum, die) => sum + die, 0) / results.length
  const variance =
    results.reduce((sum, die) => sum + Math.pow(die - mean, 2), 0) /
    results.length
  const stdDev = Math.sqrt(variance)

  console.log(`\n=== STATISTICS ===`)
  console.log(`Mean: ${mean.toFixed(3)} (expected: 3.5)`)
  console.log(`Standard Deviation: ${stdDev.toFixed(3)} (expected: ~1.708)`)
  console.log(`Variance: ${variance.toFixed(3)} (expected: ~2.917)`)

  // Check for randomness indicators
  console.log(`\n=== RANDOMNESS CHECK ===`)
  const maxDeviation = Math.max(
    ...Array.from(distribution.values()).map((count) =>
      Math.abs(((count - expected) / expected) * 100)
    )
  )
  console.log(`Maximum deviation: ${maxDeviation.toFixed(2)}%`)

  if (maxDeviation < 10) {
    console.log(`✅ Distribution looks random (deviation < 10%)`)
  } else if (maxDeviation < 20) {
    console.log(`⚠️  Distribution may have slight bias (deviation < 20%)`)
  } else {
    console.log(`❌ Distribution shows significant bias (deviation >= 20%)`)
  }
}

// Run the simulation
if (require.main === module) {
  const rolls = process.argv[2] ? parseInt(process.argv[2]) : 1000
  runSimulation(rolls).catch(console.error)
}
