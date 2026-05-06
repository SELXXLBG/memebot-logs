const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'trades.md'), 'utf8');

// Split by trade separator
const blocks = raw.split(/>\s*Solana trader:\s*/g).filter(b => b.trim().length > 0);

const tradesByDate = {};

for (const block of blocks) {
  const get = (key) => {
    const m = block.match(new RegExp(key + ':\\s*([^\r\n]+)'));
    return m ? m[1].trim() : null;
  };

  const status = get('Status');
  const token = get('Token');
  const entry = get('Entry');
  const exit = get('Exit');
  const pnl = get('PnL');
  const reason = get('Reason');
  const logged = get('Logged');

  if (!token || !logged) continue;

  const trade = {
    status: status ? `[${status}]` : '[SIMULATION]',
    timestamp: new Date(logged + 'T12:00:00Z').toISOString(),
    token: null,
    symbol: token,
    entryPrice: parseFloat(entry) || 0,
    exitPrice: parseFloat(exit) || 0,
    profitSOL: parseFloat(pnl) || 0,
    profitLamports: Math.round((parseFloat(pnl) || 0) * 1e9),
    pnlPct: 0,
    reason: reason || 'UNKNOWN',
    buyTxid: null,
    sellTxid: 'DRY_RUN_SELL',
    sweepTxid: null,
    isDryRun: true
  };

  // Compute pnlPct
  if (trade.entryPrice > 0) {
    trade.pnlPct = ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100;
  }

  if (!tradesByDate[logged]) tradesByDate[logged] = [];
  tradesByDate[logged].push(trade);
}

// Write one JSON file per date
const tradesDir = path.join(__dirname, 'trades');
if (!fs.existsSync(tradesDir)) fs.mkdirSync(tradesDir);

for (const [date, trades] of Object.entries(tradesByDate)) {
  const filePath = path.join(tradesDir, `${date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(trades, null, 2), 'utf8');
  console.log(`✅ Written ${trades.length} trades → trades/${date}.json`);
}

// Print quick stats
const all = Object.values(tradesByDate).flat();
const wins = all.filter(t => t.profitSOL > 0).length;
const totalPnl = all.reduce((s, t) => s + t.profitSOL, 0);
console.log(`\n📊 Total: ${all.length} trades | Wins: ${wins} (${Math.round(wins/all.length*100)}%) | PnL: ${totalPnl.toFixed(4)} SOL`);
