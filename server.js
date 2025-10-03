const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const seedrandom = require('seedrandom');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Combine both question batches into a single pool
const questionsPool = [
  // Batch 1
  { id: 1, text: "What is Monad's classification in the blockchain landscape?", options: {A: "Layer 2 (L2) Optimistic Rollup", B: "Proof-of-Authority Sidechain", C: "High-performance Layer 1 (L1) blockchain", D: "Decentralized Storage Network"}, correct: "C", difficulty: "Easy" },
  { id: 2, text: "What is Monad's primary target throughput metric in Transactions Per Second (TPS)?", options: {A: "1,000 TPS", B: "5,000 TPS", C: "10,000 TPS", D: "25,000 TPS"}, correct: "C", difficulty: "Easy" },
  { id: 3, text: "What is Monad's targeted finality time in milliseconds (ms)?", options: {A: "150 ms", B: "800 ms", C: "1,500 ms", D: "3,000 ms"}, correct: "B", difficulty: "Easy" },
  { id: 4, text: "What is the fundamental strategic goal of Monad regarding its execution environment?", options: {A: "To create a custom, non-EVM runtime.", B: "To achieve full compatibility with the Ethereum Virtual Machine (EVM).", C: "To focus only on zero-knowledge proofs.", D: "To support only centralized financial applications."}, correct: "B", difficulty: "Easy" },
  { id: 5, text: "Who is the co-founder and CEO of Monad Labs?", options: {A: "Chris Dixon", B: "Keone Hon", C: "Anatoly Yakovenko", D: "Sam Bankman-Fried"}, correct: "B", difficulty: "Easy" },
  { id: 6, text: "In which year did Keone Hon co-found Monad Labs?", options: {A: "2020", B: "2021", C: "2022", D: "2023"}, correct: "C", difficulty: "Easy" },
  { id: 7, text: "Which prestigious high-frequency trading (HFT) firm did Keone Hon spend eight years at, leading a trading team?", options: {A: "Citadel Securities", B: "Getco LLC", C: "Jane Street", D: "Jump Trading"}, correct: "D", difficulty: "Easy" },
  { id: 8, text: "What was the size of Monad Labs' Seed Round funding?", options: {A: "$5 million", B: "$19 million", C: "$50 million", D: "$100 million"}, correct: "B", difficulty: "Easy" },
  { id: 9, text: "In which month and year did Monad Labs close its Seed Round?", options: {A: "April 2022", B: "October 2023", C: "February 2023", D: "May 2024"}, correct: "C", difficulty: "Easy" },
  { id: 10, text: "Which firm led Monad Labs' Seed Round?", options: {A: "Paradigm", B: "Andreessen Horowitz (a16z)", C: "Dragonfly", D: "Electric Capital"}, correct: "C", difficulty: "Easy" },
  { id: 11, text: "What was the total amount raised in Monad Labs' Series A round?", options: {A: "$100 million", B: "$150 million", C: "$225 million", D: "$244 million"}, correct: "C", difficulty: "Easy" },
  { id: 12, text: "Which firm led Monad Labs' Series A round?", options: {A: "OKX Ventures", B: "Dragonfly", C: "Paradigm", D: "Sequoia Capital"}, correct: "C", difficulty: "Easy" },
  { id: 13, text: "What is the total known capital raised by Monad Labs across all funding rounds mentioned?", options: {A: "$150 million", B: "$190 million", C: "$244 million or more", D: "$300 million"}, correct: "C", difficulty: "Easy" },
  { id: 14, text: "Monad's targeted 800ms block time and single-slot finality is a direct transplant of performance requirements from which industry?", options: {A: "Web development", B: "Gaming infrastructure", C: "High-Frequency Trading (HFT)", D: "Cloud computing"}, correct: "C", difficulty: "Easy" },
  { id: 15, text: "Monad's current valuation, as per the research when the Seed Round was closed, was stated to be:", options: {A: "$100 million", B: "$200 million", C: "$500 million", D: "Not publicly disclosed"}, correct: "B", difficulty: "Easy" },
  { id: 16, text: "In which month and year did Monad Labs announce its Series A funding round?", options: {A: "February 2023", B: "April 2024", C: "May 2024", D: "August 2024"}, correct: "B", difficulty: "Easy" },
  { id: 17, text: "Which firm led the Venture Round for Monad Labs in May 2024?", options: {A: "Paradigm", B: "OKX Ventures", C: "Dragonfly", D: "Jump Crypto"}, correct: "B", difficulty: "Easy" },
  { id: 18, text: "Keone Hon's career began by optimizing low-latency trading strategies at which firm?", options: {A: "Jump Trading", B: "Jump Crypto", C: "Getco LLC", D: "Monad Labs"}, correct: "C", difficulty: "Easy" },
  { id: 19, text: "When did Keone Hon transition to Jump Crypto?", options: {A: "January 2013", B: "January 2021", C: "May 2021", D: "February 2022"}, correct: "C", difficulty: "Easy" },
  { id: 20, text: "What is the standard vesting period expected for Monad's core team members?", options: {A: "1 year", B: "2 years", C: "3 years", D: "4 years"}, correct: "D", difficulty: "Easy" },
  { id: 21, text: "What is the typical cliff period expected for core team members' tokens before vesting begins?", options: {A: "3 months", B: "6 months", C: "1 year", D: "2 years"}, correct: "C", difficulty: "Easy" },
  { id: 22, text: "What is the typical lockup period expected for institutional investors in a project like Monad?", options: {A: "6 months - 1 year", B: "1 year - 1.5 years", C: "2 years - 3 years", D: "4 years - 5 years"}, correct: "C", difficulty: "Easy" },
  { id: 23, text: "What specific type of financial applications is Monad positioned to capture due to its low latency?", options: {A: "Art NFTs", B: "Institutional Decentralized Finance (DeFi)", C: "Social media DApps", D: "Prediction markets"}, correct: "B", difficulty: "Easy" },
  { id: 24, text: "The massive $225M Series A funding is strategically important for Monad because it provides funding for what key activity?", options: {A: "Immediate Mainnet launch", B: "Buying out competitors", C: "A multi-year development cycle and elite engineering talent", D: "Investing in Bitcoin"}, correct: "C", difficulty: "Easy" },
  { id: 25, text: "Monad's positioning is described as aiming to bridge the gap between EVM compatibility and which specific requirement?", options: {A: "Low gas fees", B: "Sharding", C: "HFT-level performance", D: "Proof-of-Work mining"}, correct: "C", difficulty: "Easy" },
  { id: 26, text: "Why does Monad seek to avoid the fragmentation introduced by Layer 2 (L2) solutions?", options: {A: "L2s are too expensive to build.", B: "Monad aims to solve scalability at the base L1 layer.", C: "L2s are not EVM compatible.", D: "L2s cannot handle smart contracts."}, correct: "B", difficulty: "Easy" },
  { id: 27, text: "What is the name of the organization officially established to foster growth and oversee decentralization of the protocol?", options: {A: "Monad Labs", B: "Monad Capital", C: "The Monad Foundation", D: "Monad Genesis"}, correct: "C", difficulty: "Easy" },
  { id: 28, text: "In which month and year was the Monad Foundation officially established?", options: {A: "April 2024", B: "August 2024", C: "December 2024", D: "February 2025"}, correct: "C", difficulty: "Easy" },
  { id: 29, text: "The total prize pool for the Monad Madness Pitch Competitions mentioned in the roadmap was:", options: {A: "$100,000", B: "$500,000", C: "$1 million", D: "$2 million"}, correct: "C", difficulty: "Easy" },
  { id: 30, text: "Monad's strategy ensures that existing Ethereum smart contracts can be deployed onto Monad without modification, minimizing what for developers?", options: {A: "Consensus mechanism changes", B: "Switching costs", C: "Security risks", D: "Hardware requirements"}, correct: "B", difficulty: "Easy" },
  { id: 31, text: "What is the execution environment for Monad called?", options: {A: "Ethereum Virtual Machine (EVM)", B: "Solana Runtime (SR)", C: "Monad Virtual Machine (MVM)", D: "Cardano VM (CVM)"}, correct: "C", difficulty: "Medium" },
  { id: 32, text: "What is the key technology Monad uses to enable massive concurrency and simultaneous transaction processing?", options: {A: "Sharding", B: "State Channels", C: "Optimistic Parallel Execution (OPE)", D: "Proof-of-History"}, correct: "C", difficulty: "Medium" },
  { id: 33, text: "What is the assumption under which Monad's OPE processes multiple transactions simultaneously?", options: {A: "That all transactions will fail.", B: "That all transactions access independent parts of the blockchain state.", C: "That the transactions are sequentially ordered.", D: "That they are processed by a centralized sequencer."}, correct: "B", difficulty: "Medium" },
  { id: 34, text: "What happens if Monad's OPE detects a state conflict (e.g., two transactions modifying the same account)?", options: {A: "Both transactions are automatically rejected.", B: "The affected transactions are flagged and selectively re-executed sequentially.", C: "The entire block is discarded.", D: "The chain halts until consensus is reached."}, correct: "B", difficulty: "Medium" },
  { id: 35, text: "What is the name of Monad's custom state management solution designed for efficient storage and reduced hardware costs?", options: {A: "EthereumDB", B: "MonadDB", C: "ParallelState", D: "OptimisticStorage"}, correct: "B", difficulty: "Medium" },
  { id: 36, text: "By leveraging MonadDB, what type of hardware storage is Monad able to use primarily for state storage, thereby reducing costs?", options: {A: "Expensive, high-speed RAM", B: "Large-capacity, lower-cost SSDs/Disk", C: "External cloud servers", D: "Tape backups"}, correct: "B", difficulty: "Medium" },
  { id: 37, text: "Which industry-standard data structure does MonadDB still utilize for state storage?", options: {A: "Merkle Tree", B: "Patricia Trie", C: "B-Tree", D: "Heap"}, correct: "B", difficulty: "Medium" },
  { id: 38, text: "The reduction in high-cost hardware requirements (RAM) achieved by MonadDB promotes what key objective?", options: {A: "Higher gas fees", B: "Validator centralization", C: "Scalable decentralization", D: "Reduced transaction throughput"}, correct: "C", difficulty: "Medium" },
  { id: 39, text: "What technique, similar to that used in modern CPUs, does Monad use to allow different stages of transaction processing (fetch, execution, state writing) to overlap?", options: {A: "Sharding", B: "Merkleization", C: "Superscalar Pipelining", D: "Virtual Memory"}, correct: "C", difficulty: "Medium" },
  { id: 40, text: "Monad introduces Asynchronous Execution by fundamentally decoupling which two layers?", options: {A: "The networking layer and the application layer", B: "The execution layer and the consensus layer", C: "The front-end and the back-end", D: "The storage layer and the networking layer"}, correct: "B", difficulty: "Medium" },
  { id: 41, text: "What is the consensus mechanism Monad integrates, tuned for ultra-low latency?", options: {A: "Proof-of-Work (PoW)", B: "Delegated Proof-of-Stake (DPoS)", C: "Custom High-Performance Proof-of-Stake (PoS)", D: "Proof-of-History (PoH)"}, correct: "C", difficulty: "Medium" },
  { id: 42, text: "Monad's architecture facilitates what type of finality in relation to its block time?", options: {A: "Delayed Finality", B: "Dual-Slot Finality", C: "Single-Slot Finality", D: "Eventual Finality"}, correct: "C", difficulty: "Medium" },
  { id: 43, text: "What is the term for the value extracted by reordering, censoring, or inserting transactions that Monad seeks to mitigate through a 'core-protocol approach'?", options: {A: "Gas Fees", B: "Maximal Extractable Value (MEV)", C: "Arbitrage", D: "Front-Running"}, correct: "B", difficulty: "Medium" },
  { id: 44, text: "What happens to the theoretical throughput ceiling of 10,000 TPS if frequent re-execution cycles become necessary due to high state conflicts?", options: {A: "It increases.", B: "It diminishes significantly.", C: "It remains constant.", D: "It depends on gas fees."}, correct: "B", difficulty: "Medium" },
  { id: 45, text: "What is the critical strategic advantage Monad gains by achieving full EVM compatibility?", options: {A: "Lower energy consumption", B: "Access to the massive Ethereum developer ecosystem and DApps", C: "Faster consensus", D: "More decentralized governance"}, correct: "B", difficulty: "Medium" },
  
  // Batch 2
  { id: 46, text: "Which structural weakness of high-speed chains like Solana does Monad's MonadDB attempt to rectify?", options: {A: "Low TPS", B: "Lack of EVM compatibility", C: "High node operating costs and subsequent centralization risks", D: "Slow finality"}, correct: "C", difficulty: "Medium" },
  { id: 47, text: "Monad's high throughput and sub-second latency are typically associated with which layer of the Ethereum ecosystem?", options: {A: "Layer 0", B: "Layer 1 (L1)", C: "Layer 2 (L2) solutions", D: "Layer 3"}, correct: "C", difficulty: "Medium" },
  { id: 48, text: "Monad is described as a 'rebuild of Ethereum' to enable which key architectural feature?", options: {A: "Sequential execution", B: "Parallel execution", C: "Proof-of-Work", D: "Sharding"}, correct: "B", difficulty: "Medium" },
  { id: 49, text: "The decoupling of the execution layer from the consensus layer in Monad significantly reduces what?", options: {A: "Network size", B: "Latency and execution bottlenecks", C: "Validator rewards", D: "Security vulnerabilities"}, correct: "B", difficulty: "Medium" },
  { id: 50, text: "What is the fundamental assurance Monad's Optimistic Parallel Execution maintains?", options: {A: "That all transactions are always processed instantly.", B: "That the outcome of parallel execution is identical to the outcome of sequential execution.", C: "That state conflicts never occur.", D: "That all nodes use high-speed RAM."}, correct: "B", difficulty: "Medium" },
  { id: 51, text: "Which of the following is not one of the standard utility functions anticipated for the native Monad token?", options: {A: "Transaction Fees (Gas)", B: "Staking and Security", C: "Paying for centralized cloud services", D: "Governance"}, correct: "C", difficulty: "Medium" },
  { id: 52, text: "What is the primary technical risk associated with Monad's Optimistic Parallel Execution (OPE)?", options: {A: "It might require too much electricity.", B: "High state conflict rates could negate performance gains through constant re-execution.", C: "It is incompatible with the internet.", D: "It requires non-EVM languages."}, correct: "B", difficulty: "Medium" },
  { id: 53, text: "The process of pipelining in Monad ensures what is minimized?", options: {A: "Network security", B: "Idle time of computational resources", C: "Block size", D: "Decentralization"}, correct: "B", difficulty: "Medium" },
  { id: 54, text: "What type of model is expected for the vesting of tokens allocated for Community/Ecosystem growth?", options: {A: "Immediate 100% unlock", B: "Fixed 10-year lockup", C: "KPI-driven or milestone-based issuance", D: "Weekly linear unlocks only"}, correct: "C", difficulty: "Medium" },
  { id: 55, text: "Monad aims to neutralize the critique leveled against other high-performance L1s, which is that speed inevitably leads to what?", options: {A: "High gas fees", B: "Centralization", C: "Low transaction volume", D: "Developer apathy"}, correct: "B", difficulty: "Medium" },
  { id: 56, text: "Monad's commitment to ultra-fast finality reduces the time window available for malicious actors to exploit which opportunity?", options: {A: "Staking rewards", B: "Governance voting", C: "Maximal Extractable Value (MEV)", D: "Node validation"}, correct: "C", difficulty: "Medium" },
  { id: 57, text: "By providing the high throughput and low latency natively on L1, Monad aims to eliminate which risk associated with L2s?", options: {A: "EVM incompatibility", B: "Security risks associated with bridging", C: "Low staking rewards", D: "Sequential execution"}, correct: "B", difficulty: "Medium" },
  { id: 58, text: "What is the general range for the low transaction throughput of Ethereum's Layer 1 (L1)?", options: {A: "1-5 TPS", B: "15-30 TPS", C: "50-75 TPS", D: "100-200 TPS"}, correct: "B", difficulty: "Medium" },
  { id: 59, text: "Monad's custom database, MonadDB, uses both on-disk storage (SSD) and what other type of memory?", options: {A: "Tape storage", B: "Cloud storage", C: "Volatile memory (RAM)", D: "Cold storage"}, correct: "C", difficulty: "Medium" },
  { id: 60, text: "What concept ensures that the execution engine can continuously process the next batch of transactions without waiting for network-wide consensus confirmation on the previous block?", options: {A: "Sequential Execution", B: "Optimistic Parallel Execution", C: "Single-Slot Finality", D: "Asynchronous Execution"}, correct: "D", difficulty: "Medium" },
  { id: 61, text: "What is the name of the project built on Monad that is designed to simplify launching and investing in crypto projects through a tiered investment system?", options: {A: "Monad Launch", B: "Monad Pad", C: "Monad Bridge", D: "Monad Swap"}, correct: "B", difficulty: "Hard" },
  { id: 62, text: "Monad Pad's token that grants holders access to various features and benefits is called:", options: {A: "$MONAD", B: "$MVM", C: "$MPAD", D: "$MLAB"}, correct: "C", difficulty: "Hard" },
  { id: 63, text: "When was the Monad Testnet Onboarding Guide officially released?", options: {A: "December 2024", B: "January 2025", C: "February 2025", D: "September 2025"}, correct: "C", difficulty: "Hard" },
  { id: 64, text: "What was the date of the public announcement regarding Monad's core-protocol approach to 'Mitigating MEV'?", options: {A: "August 26, 2024", B: "October 11, 2023", C: "February 5, 2025", D: "September 18, 2025"}, correct: "B", difficulty: "Hard" },
  { id: 65, text: "The $1 million Monad Madness Pitch Competition was held in which month(s) of 2024?", options: {A: "June and July", B: "August and October", C: "November and December", D: "Only in October"}, correct: "B", difficulty: "Hard" },
  { id: 66, text: "What event took place on February 5, 2025, focused on developer acquisition?", options: {A: "The Mainnet Launch", B: "The first Monad hackathon: evm/accathon", C: "The Series A funding announcement", D: "The Monad Foundation establishment"}, correct: "B", difficulty: "Hard" },
  { id: 67, text: "What is the title of the announcement from September 18, 2025, that confirms sustained development and ecosystem maturation efforts?", options: {A: "Introducing: Monad Foundation", B: "Monad Testnet Onboarding Guide", C: "Monad Momentum: Accelerating Ecosystem Growth", D: "Mitigating MEV: a core-protocol approach"}, correct: "C", difficulty: "Hard" },
  { id: 68, text: "What specific date was the Monad Monthly December 2024 Recap released?", options: {A: "December 5, 2024", B: "December 16, 2024", C: "January 3, 2025", D: "February 19, 2025"}, correct: "C", difficulty: "Hard" },
  { id: 69, text: "What phase of development is Monad currently focused on, according to the roadmap milestones in early 2025?", options: {A: "Research and development", B: "Mainnet deployment", C: "Testnet phase", D: "Token distribution"}, correct: "C", difficulty: "Hard" },
  { id: 70, text: "What is the most realistic expectation for a Mainnet deployment, given the complex Testnet requirements for OPE?", options: {A: "Early 2025", B: "Mid-to-late 2026", C: "Late 2025", D: "Already live since 2024"}, correct: "B", difficulty: "Hard" },
  { id: 71, text: "The Monad Madness Bangkok Finals were stated to be LIVE on what date?", options: {A: "October 3, 2024", B: "October 22, 2024", C: "November 16, 2024", D: "December 5, 2024"}, correct: "C", difficulty: "Hard" },
  { id: 72, text: "What date was the announcement 'Monad's $1M Pitch Competition (Monad Madness)' in August 2024?", options: {A: "August 1, 2024", B: "August 26, 2024", C: "September 3, 2024", D: "October 3, 2024"}, correct: "B", difficulty: "Hard" },
  { id: 73, text: "The Monad Monthly November 2024 Recap was released on what date?", options: {A: "October 22, 2024", B: "November 1, 2024", C: "December 5, 2024", D: "January 3, 2025"}, correct: "C", difficulty: "Hard" },
];

/**
 * Shuffle array using Fisher-Yates algorithm with seed
 */
function shuffleArray(array, seed) {
  const rng = seedrandom(seed);
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get questions by difficulty
 */
function getQuestionsByDifficulty(questions, difficulty) {
  return questions.filter(q => q.difficulty === difficulty);
}

/**
 * Generate daily quiz with proper difficulty progression
 */
function generateDailyQuiz(userId) {
  try {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const daySeed = today.getDate() % 3; // 3 unique daily sets
    
    // Calculate start index for daily question pool
    const startIndex = daySeed * 30;
    const dailyPool = questionsPool.slice(startIndex, startIndex + 30);
    
    // Group questions by difficulty
    const easyQuestions = getQuestionsByDifficulty(dailyPool, 'Easy');
    const mediumQuestions = getQuestionsByDifficulty(dailyPool, 'Medium');
    const hardQuestions = getQuestionsByDifficulty(dailyPool, 'Hard');
    
    // Create difficulty progression (30 questions total)
    const progression = [
      ...easyQuestions.slice(0, 4),           // Q1-4: Easy
      ...mediumQuestions.slice(0, 5),         // Q5-9: Medium
      ...hardQuestions.slice(0, 5),           // Q10-14: Hard
      ...hardQuestions.slice(5, 10),          // Q15-19: Harder
      ...hardQuestions.slice(10, 15),         // Q20-24: Advanced
      ...hardQuestions.slice(15, 20)          // Q25-30: Expert
    ].filter(q => q !== undefined); // Remove undefined if slices go beyond available questions
    
    // If we don't have enough questions, fill with random ones from the pool
    if (progression.length < 30) {
      const remainingNeeded = 30 - progression.length;
      const usedIds = new Set(progression.map(q => q.id));
      const availableQuestions = dailyPool.filter(q => !usedIds.has(q.id));
      progression.push(...availableQuestions.slice(0, remainingNeeded));
    }
    
    // Shuffle uniquely per user using userId + date
    const userSeed = `${userId}-${dateString}`;
    const shuffledQuestions = shuffleArray(progression, userSeed);
    
    return shuffledQuestions.slice(0, 30);
  } catch (error) {
    console.error('Error generating daily quiz:', error);
    throw error;
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'REAL NADS QUIZZES API is running' });
});

app.get('/api/quiz', (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required. Provide userId as query parameter.' 
      });
    }
    
    const quizQuestions = generateDailyQuiz(userId);
    
    res.json(quizQuestions);
  } catch (error) {
    console.error('Error in /api/quiz:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz. Please try again.' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 REAL NADS QUIZZES backend running on port ${PORT}`);
  console.log(`📝 Total questions in pool: ${questionsPool.length}`);
});
