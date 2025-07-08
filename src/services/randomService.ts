import crypto from 'crypto'
import os from 'os'

// Ultra-enhanced random number generator with maximum entropy sources
export class EnhancedRandomGenerator {
  private entropyPool: number[] = []
  private lastSeed: number = Date.now()
  private entropyCounter: number = 0
  private lastMemoryUsage: number = 0
  private entropyHistory: number[] = []

  constructor() {
    this.initializeEntropyPool()
  }

  private initializeEntropyPool(): void {
    // Collect initial entropy from extensive sources
    const sources = [
      Date.now(),
      process.hrtime.bigint(),
      Math.random(),
      crypto.randomBytes(8).readBigUInt64LE(0),
      process.pid,
      process.uptime(),
      os.freemem(),
      os.totalmem(),
      os.loadavg()[0] * 1000000,
      os.cpus().length,
      process.memoryUsage().heapUsed,
      process.memoryUsage().external,
      process.memoryUsage().rss,
      crypto.randomBytes(4).readUInt32LE(0),
      crypto.randomBytes(4).readUInt32LE(0), // Extra crypto entropy
    ]

    this.entropyPool = sources.map((source) =>
      typeof source === 'bigint'
        ? Number(source % BigInt(Number.MAX_SAFE_INTEGER))
        : source
    )

    this.lastMemoryUsage = process.memoryUsage().heapUsed
  }

  private addEntropy(): void {
    this.entropyCounter++

    // Add new entropy sources with system metrics
    const newEntropy = [
      Date.now(),
      process.hrtime.bigint(),
      Math.random(),
      crypto.randomBytes(8).readBigUInt64LE(0),
      this.lastSeed,
      this.entropyCounter,
      process.memoryUsage().heapUsed,
      process.memoryUsage().external,
      process.memoryUsage().rss,
      os.freemem(),
      os.loadavg()[0] * 1000000,
      crypto.randomBytes(4).readUInt32LE(0),
      crypto.randomBytes(4).readUInt32LE(0),
      crypto.randomBytes(4).readUInt32LE(0), // Triple crypto entropy
    ]

    this.entropyPool.push(
      ...newEntropy.map((source) =>
        typeof source === 'bigint'
          ? Number(source % BigInt(Number.MAX_SAFE_INTEGER))
          : source
      )
    )

    // Keep pool size manageable but larger for more entropy
    if (this.entropyPool.length > 200) {
      this.entropyPool = this.entropyPool.slice(-100)
    }

    // Advanced seed evolution
    this.lastSeed = this.entropyPool.reduce((a, b) => a ^ b, 0)
    this.lastSeed = this.lastSeed ^ (this.lastSeed >>> 17)
    this.lastSeed = this.lastSeed ^ (this.lastSeed << 5)
    this.lastSeed = this.lastSeed ^ (this.lastSeed >>> 13)

    // Store entropy history for additional mixing
    this.entropyHistory.push(this.lastSeed)
    if (this.entropyHistory.length > 50) {
      this.entropyHistory = this.entropyHistory.slice(-25)
    }
  }

  private mixEntropy(): number {
    // Advanced entropy mixing with multiple passes
    let mixed = this.entropyPool.reduce((a, b) => a ^ b, 0)

    // Multiple mixing passes
    for (let i = 0; i < 3; i++) {
      mixed = mixed ^ (mixed >>> 17)
      mixed = mixed ^ (mixed << 5)
      mixed = mixed ^ (mixed >>> 13)
      mixed = mixed ^ (mixed << 7)
      mixed = mixed ^ (mixed >>> 11)
    }

    // Mix with entropy history
    const historyMix = this.entropyHistory.reduce((a, b) => a ^ b, 0)
    mixed = mixed ^ historyMix

    return mixed
  }

  public rollDie(): number {
    // Add entropy before each roll
    this.addEntropy()

    // Multiple crypto sources for maximum randomness
    const cryptoRandom1 = crypto.randomBytes(8).readBigUInt64LE(0)
    const cryptoRandom2 = crypto.randomBytes(4).readUInt32LE(0)
    const cryptoRandom3 = crypto.randomBytes(4).readUInt32LE(0)

    // Mix with our entropy pool
    const mixedEntropy = this.mixEntropy()

    // Combine multiple sources with advanced mixing
    let combined = Number(cryptoRandom1 % BigInt(Number.MAX_SAFE_INTEGER))
    combined = combined ^ cryptoRandom2
    combined = combined ^ cryptoRandom3
    combined = combined ^ mixedEntropy
    combined = combined ^ this.lastSeed
    combined = combined ^ this.entropyCounter

    // Additional mixing
    combined = combined ^ (combined >>> 17)
    combined = combined ^ (combined << 5)
    combined = combined ^ (combined >>> 13)

    // Ensure positive and within range
    const positive = Math.abs(combined)
    return (positive % 6) + 1
  }

  public getEntropyInfo(): object {
    return {
      poolSize: this.entropyPool.length,
      lastSeed: this.lastSeed,
      entropyCounter: this.entropyCounter,
      entropyHistorySize: this.entropyHistory.length,
      entropySources: this.entropyPool.slice(-8), // Last 8 entropy values
      memoryUsage: process.memoryUsage(),
      systemInfo: {
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        loadavg: os.loadavg(),
        cpus: os.cpus().length,
      },
    }
  }
}

// Ultra-secure die rolling with multiple crypto sources
export function rollDieWithCrypto(): number {
  // Use multiple crypto sources for maximum randomness
  const crypto1 = crypto.randomBytes(8).readBigUInt64LE(0)
  const crypto2 = crypto.randomBytes(4).readUInt32LE(0)
  const crypto3 = crypto.randomBytes(4).readUInt32LE(0)

  let combined = Number(crypto1 % BigInt(Number.MAX_SAFE_INTEGER))
  combined = combined ^ crypto2 ^ crypto3

  // Additional mixing
  combined = combined ^ (combined >>> 17)
  combined = combined ^ (combined << 5)
  combined = combined ^ (combined >>> 13)

  const positive = Math.abs(combined)
  return (positive % 6) + 1
}

// Alternative: Use Node.js crypto.randomInt with additional mixing
export function rollDieWithCryptoInt(): number {
  const base = crypto.randomInt(1, 7)
  const extra = crypto.randomBytes(4).readUInt32LE(0)
  const mixed = base ^ extra % 6
  return ((mixed - 1 + 6) % 6) + 1
}

// Alternative: Use Web Crypto API style with enhanced mixing
export function rollDieWithWebCrypto(): number {
  const array = new Uint32Array(3) // Use 3 values for more entropy
  crypto.getRandomValues(array)

  let combined = array[0] ^ array[1] ^ array[2]
  combined = combined ^ (combined >>> 17)
  combined = combined ^ (combined << 5)
  combined = combined ^ (combined >>> 13)

  return (Math.abs(combined) % 6) + 1
}
