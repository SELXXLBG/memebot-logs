# 🤖 MemeBot — Solana Meme Coin Scalping Bot

## Overview
Automated Solana meme coin scalping system built on n8n, hosted on a personal VPS.
Partnership project: investor provides capital, builder provides infrastructure & automation.

## Deal Structure
- **Capital**: $100 working capital (constant, never compounded)
- **Split**: 50/50 on profits
- **Losses**: absorbed by investor (capital provider)
- **Confidentiality**: private project, NDA agreed

---

## Architecture (Production VPS)

### Stack
- **Automation**: n8n (Dockerized on Hostinger VPS `31.97.197.149`)
- **Network**: Solana Mainnet
- **Data source**: Dexscreener API (Real-time token monitoring)
- **Execution**: Jupiter API v6 (Swaps) + Solana web3.js (Signatures)
- **Shared State**: Fichier physique `/tmp/memebot_position.json` pour synchroniser l'état entre les workflows.
- **Security**: Secrets sortis des exports JSON. Utiliser les variables d'environnement n8n/Docker (`GITHUB_TOKEN`) ou des credentials n8n.

### Wallet Setup
- **Trading wallet**: `C39XubwzreN3NfV52WGsaPwB6AQCfqpsTAS5XemkzbMc` (Clés dérivées via script sécurisé sur VPS).
- **Profit wallet**: `B12z9uHALwceTy1vdeEs2XBQfa79fvsWMM6sJGyPCKyQ`
  - Les profits sont transférés ici après chaque vente réussie.
  - Le capital initial ($100) reste dans le trading wallet.

---

## Trading Logic

### Entry Criteria
| Parameter | Value |
|-----------|-------|
| Market Cap | $30,000 – $100,000 |
| Min Liquidity | ≥ $10,000 |
| Token Age | < 1 hour (catch early) |
| Network | Solana only |

### Exit Criteria
| Condition | Action |
|-----------|--------|
| +10% gain | Sell 100%, sweep profit to profit wallet |
| -15% loss | Stop-loss, sell to preserve capital |
| Token age > 12h | Force exit (rug risk increases) |

---

## Simulation & Testing (Dry Run)
- **Mode Simulation** : Activé via la variable `DRY_RUN=true` dans le code.
- **Fonctionnement** : Le bot détecte de vrais tokens, simule l'achat et la vente au prix du marché, et logue les résultats sur GitHub sans dépenser de SOL réels.
- **Activation Réelle** : Ne pas passer live tant que la signature Solana, le broadcast RPC et la gestion des clés privées ne sont pas implémentés proprement.

---

## n8n Workflow Structure

### WF1 — Token Scanner
- **Trigger**: Cron toutes les 2 min.
- **Action**: Fetch les nouveaux tokens Solana via Dexscreener.
- **Filtre**: Applique les critères d'entrée (MCAP, Liquidity).

### WF2 — Trade Executor
- **Trigger**: Webhook du WF1.
- **Action**: Simulation d'achat via Jupiter.
- **Stockage** : Écrit l'état de la position dans `/tmp/memebot_position.json`.

### WF3 — Price Monitor & Exit
- **Trigger**: Cron toutes les 30s.
- **Action**: Compare le prix actuel (Dexscreener) au prix d'entrée stocké.
- **Condition de vente** : Déclenche WF4 si TP (+10%) ou SL (-15%) atteint.

### WF4 — Profit Sweeper & Logger
- **Trigger**: Webhook du WF3.
- **Action** : Logue le trade dans le repo GitHub (format JSON).
- **Nettoyage** : Supprime le fichier d'état pour autoriser le prochain trade.

---

## Current Deployment Status (2026-05-02)
- [x] VPS Hostinger configuré (Docker + n8n)
- [x] Workflows n8n déployés et corrigés (Vrai marché + Simulation)
- [x] Partage d'état via fichier physique opérationnel
- [x] Clés Solana dérivées et intégrées sécuritairement
- [x] Mode Simulation (Dry Run) testé avec succès (mUSDC)
- [x] Scanner basculé sur les vrais jetons du marché
- [ ] Premier profit réel logué sur GitHub
- [ ] Passage en mode production (Live Trading)
