// KrishiTrace Blockchain Simulation Engine
// Client-side blockchain using SHA-256 hashing via expo-crypto
// Stores chain in AsyncStorage for persistence

import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'krishitrace_blockchain';

// ── Hash Helper ──────────────────────────────────────
const computeHash = async (data) => {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, str);
};

// ── Block Creation ───────────────────────────────────
const createBlockObject = async (index, data, previousHash) => {
  const timestamp = new Date().toISOString();
  const nonce = Math.floor(Math.random() * 100000);
  const payload = `${index}${timestamp}${JSON.stringify(data)}${previousHash}${nonce}`;
  const hash = await computeHash(payload);

  return {
    index,
    timestamp,
    data,
    previousHash,
    hash,
    nonce,
  };
};

// ── Genesis Block ────────────────────────────────────
const createGenesisBlock = async () => {
  return await createBlockObject(0, {
    type: 'GENESIS',
    message: 'KrishiTrace Blockchain Initialized',
    version: '1.0.0',
  }, '0'.repeat(64));
};

// ── Load / Save Chain ────────────────────────────────
const loadChain = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.log('Blockchain load error:', e);
  }
  return null;
};

const saveChain = async (chain) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
};

// ── Initialize ───────────────────────────────────────
const initChain = async () => {
  let chain = await loadChain();
  if (!chain || chain.length === 0) {
    const genesis = await createGenesisBlock();
    chain = [genesis];
    await saveChain(chain);
  }
  return chain;
};

// ── Add Block ────────────────────────────────────────
const addBlock = async (data) => {
  const chain = await initChain();
  const lastBlock = chain[chain.length - 1];
  const newBlock = await createBlockObject(chain.length, data, lastBlock.hash);
  chain.push(newBlock);
  await saveChain(chain);
  return { block: newBlock, chainLength: chain.length };
};

// ── Get Full Chain ───────────────────────────────────
const getChain = async () => {
  return await initChain();
};

// ── Validate Chain ───────────────────────────────────
// Walks every block and verifies hash linkage
const validateChain = async () => {
  const chain = await initChain();

  if (chain.length <= 1) return { valid: true, length: chain.length, brokenAt: -1 };

  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const previous = chain[i - 1];

    // Check previousHash linkage
    if (current.previousHash !== previous.hash) {
      return { valid: false, length: chain.length, brokenAt: i };
    }

    // Re-compute current block's hash to detect data tampering
    const payload = `${current.index}${current.timestamp}${JSON.stringify(current.data)}${current.previousHash}${current.nonce}`;
    const recomputedHash = await computeHash(payload);
    if (recomputedHash !== current.hash) {
      return { valid: false, length: chain.length, brokenAt: i };
    }
  }

  return { valid: true, length: chain.length, brokenAt: -1 };
};

// ── Get Blocks For Harvest ───────────────────────────
const getBlocksForHarvest = async (harvestId) => {
  const chain = await getChain();
  return chain.filter(
    (b) => b.data?.harvestId === harvestId || b.data?.type === 'GENESIS'
  );
};

// ── Tamper Test (Demo) ───────────────────────────────
// Corrupts a specific block's data to demonstrate tamper detection
const tamperBlock = async (blockIndex) => {
  const chain = await loadChain();
  if (!chain || blockIndex < 1 || blockIndex >= chain.length) return false;

  // Corrupt the block's data without re-computing hash
  chain[blockIndex].data = {
    ...chain[blockIndex].data,
    _tampered: true,
    _original: chain[blockIndex].data.type,
    type: 'TAMPERED_DATA',
  };

  await saveChain(chain);
  return true;
};

// ── Restore Chain (undo tamper) ──────────────────────
const restoreChain = async () => {
  const genesis = await createGenesisBlock();
  // We can't truly restore, so we rebuild with just genesis
  // Real blocks would need to be re-added after restore
  const chain = await loadChain();
  if (!chain) return;

  // Try to restore tampered blocks
  let needsSave = false;
  for (let i = 0; i < chain.length; i++) {
    if (chain[i].data?._tampered) {
      // Can't fully restore — mark it
      chain[i].data = {
        ...chain[i].data,
        type: chain[i].data._original || 'RESTORED',
        _tampered: false,
      };
      // Re-compute hash
      const payload = `${chain[i].index}${chain[i].timestamp}${JSON.stringify(chain[i].data)}${chain[i].previousHash}${chain[i].nonce}`;
      chain[i].hash = await computeHash(payload);
      needsSave = true;
    }
  }

  // Fix hash chain linkage
  for (let i = 1; i < chain.length; i++) {
    if (chain[i].previousHash !== chain[i - 1].hash) {
      chain[i].previousHash = chain[i - 1].hash;
      const payload = `${chain[i].index}${chain[i].timestamp}${JSON.stringify(chain[i].data)}${chain[i].previousHash}${chain[i].nonce}`;
      chain[i].hash = await computeHash(payload);
      needsSave = true;
    }
  }

  if (needsSave) await saveChain(chain);
  return true;
};

// ── Reset Chain ──────────────────────────────────────
const resetChain = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return await initChain();
};

// ── Chain Stats ──────────────────────────────────────
const getChainStats = async () => {
  const chain = await getChain();
  const validation = await validateChain();
  const harvestBlocks = chain.filter((b) => b.data?.type === 'HARVEST_CREATED');

  return {
    totalBlocks: chain.length,
    harvestBlocks: harvestBlocks.length,
    isValid: validation.valid,
    brokenAt: validation.brokenAt,
    genesisTime: chain[0]?.timestamp,
    lastBlockTime: chain[chain.length - 1]?.timestamp,
  };
};

export default {
  addBlock,
  getChain,
  validateChain,
  getBlocksForHarvest,
  tamperBlock,
  restoreChain,
  resetChain,
  getChainStats,
  initChain,
};
