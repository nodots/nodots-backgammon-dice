# Backgammon Dice API

A transparent, auditable, and cryptographically secure dice rolling API designed specifically for backgammon games. This API provides ultra-enhanced randomness with complete audit trails for maximum transparency and fairness.

## 🎯 Features

- **Ultra-Enhanced Randomness**: Multiple entropy sources including crypto.randomBytes, system metrics, and advanced entropy mixing
- **Complete Audit Trail**: Every roll is logged with timestamp, roll number, and entropy information
- **Transparency**: Full visibility into the randomness generation process
- **Cryptographic Security**: Uses Node.js crypto module for maximum security
- **Real-time Entropy Monitoring**: Track entropy pool status and system metrics
- **RESTful API**: Simple HTTP endpoints for easy integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dice

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

### Development

```bash
# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run randomness simulation
npm run simulate
```

## 📡 API Endpoints

### POST /roll

Roll a single die (1-6) with full audit trail.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "die": 4,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "rollNumber": 42,
    "entropyInfo": {
      "poolSize": 156,
      "lastSeed": 1234567890,
      "entropyCounter": 42,
      "entropyHistorySize": 25,
      "entropySources": [
        /* last 8 entropy values */
      ],
      "memoryUsage": {
        /* system memory info */
      },
      "systemInfo": {
        /* system metrics */
      }
    }
  },
  "auditTrail": {
    "totalRolls": 42,
    "lastRoll": {
      /* previous roll data */
    }
  }
}
```

### GET /audit

Retrieve the complete audit trail of all rolls.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRolls": 42,
    "rolls": [
      {
        "id": "uuid-v4",
        "die": 3,
        "timestamp": "2024-01-15T10:29:55.000Z",
        "rollNumber": 41
      }
      // ... all previous rolls
    ]
  }
}
```

### GET /entropy

Get current entropy pool status and randomness information.

**Response:**

```json
{
  "success": true,
  "data": {
    "currentEntropy": {
      /* current entropy info */
    },
    "randomMethod": "Ultra-Enhanced Entropy Pool",
    "description": "Uses multiple crypto sources, system metrics, and advanced entropy mixing for maximum randomness",
    "features": [
      "Multiple crypto.randomBytes sources",
      "System memory and CPU metrics",
      "Entropy history and counter",
      "Advanced bit-shifting mixing",
      "Triple-pass entropy combination"
    ]
  }
}
```

## 🔬 Randomness Features

### Ultra-Enhanced Entropy Sources

The API uses multiple entropy sources for maximum randomness:

1. **Cryptographic Sources**:

   - Multiple `crypto.randomBytes()` calls
   - `crypto.randomInt()` for base randomization
   - Triple-pass crypto entropy mixing

2. **System Metrics**:

   - Memory usage (heap, external, RSS)
   - CPU load averages
   - System uptime and process metrics
   - Available and total memory

3. **Advanced Mixing**:
   - Entropy pool with 200+ values
   - Bit-shifting operations (XOR, left/right shifts)
   - Triple-pass entropy combination
   - Historical entropy tracking

### Entropy Pool Management

- **Dynamic Pool**: Automatically maintains 100-200 entropy values
- **Historical Tracking**: Keeps last 25 entropy states for additional mixing
- **Counter Evolution**: Incremental entropy counter for uniqueness
- **Memory Integration**: Real-time system metrics integration

## 🧪 Testing

The project includes comprehensive tests for all API endpoints:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- ✅ Die roll validation (1-6 range)
- ✅ Roll counter increment
- ✅ Audit trail functionality
- ✅ Response structure validation
- ✅ Entropy information inclusion

## 📊 Simulation

Run randomness simulations to verify distribution:

```bash
npm run simulate
```

The simulation performs thousands of rolls and analyzes:

- Distribution uniformity
- Entropy effectiveness
- Randomness quality metrics

## 🏗️ Architecture

### Project Structure

```
src/
├── index.ts              # Main API server
├── services/
│   └── randomService.ts  # Enhanced random generator
├── types/
│   └── dice.ts          # TypeScript type definitions
├── simulation.ts        # Randomness simulation
└── __tests__/
    └── dice.test.ts     # API tests
```

### Key Components

- **EnhancedRandomGenerator**: Ultra-secure random number generation
- **Audit Trail**: In-memory storage with full roll history
- **Entropy Monitoring**: Real-time entropy pool status
- **Express Server**: RESTful API endpoints

## 🔒 Security & Transparency

### Cryptographic Security

- Uses Node.js `crypto` module for cryptographically secure random numbers
- Multiple entropy sources prevent predictability
- Advanced mixing algorithms ensure uniform distribution

### Audit Trail

- Every roll is logged with unique ID and timestamp
- Complete history available via `/audit` endpoint
- Entropy information included in each roll response

### Transparency

- Full visibility into randomness generation process
- Entropy pool status and system metrics exposed
- No hidden or deterministic patterns

## 🚀 Deployment

### Environment Variables

- `PORT`: Server port (default: 4000)

### Production Considerations

- Consider persistent storage for audit trails
- Implement rate limiting for production use
- Add authentication if needed
- Monitor entropy pool health

## 📝 License

[Add your license information here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

[Add support contact information here]
