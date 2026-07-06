# 📓 MemeBot — Journal de Bord & Changelog

> Fichier de suivi des périodes de test, modifications apportées aux workflows, et résultats observés.

---

## 📅 Périodes de Test

### 🔴 Période 1 — v1 à v5 (Filtres initiaux)
**Dates :** 2026-05-25 → 2026-06-10  
**Dossier GitHub :** `trades/archives/2026-05-25_2026-06-10_v1-v5/`  
**Statut :** Archivée ✅

| Métrique | Valeur |
|---|---|
| Trades | ~40+ |
| Win Rate | ~30% estimé |
| Résultat | Négatif — filtres trop laxistes |
| Principal problème | Entrées sur tokens déjà pompés, VELOCITY_KILL massif |

**Résumé :** Première phase de test avec des filtres d'entrée très permissifs (v1–v5). Beaucoup de trades sur des tokens en phase de dump. Les sorties VELOCITY_KILL dominaient (~50%+).

---

### 🟡 Période 2 — v6 (Filtres relâchés "réalité du marché boosted")
**Dates :** 2026-07-02 → 2026-07-06  
**Dossier GitHub :** `trades/archives/2026-07-02_2026-07-06_v6/`  
**Statut :** Archivée ✅ (remplacée par v7)

| Métrique | Valeur |
|---|---|
| Trades | 22 |
| Win Rate | ~32% |
| PnL cumulé | -0.24 SOL |
| Max Drawdown | ~0.58 SOL |
| Profit Factor | ~0.68 |
| Lose Streak max | 6 |
| Sorties VELOCITY_KILL | ~52% 🔴 |
| Sorties TRAILINGSTOP | ~21% |
| Sorties TAKEPROFIT20P | ~10% |

**Résumé :** La v6 avait relâché les filtres (FOMO 5m à 20%, buySellRatio à 1.0). Résultat : trop d'entrées sur des tokens ayant déjà pumpé → sorties VELOCITY_KILL massives.

---

### 🟢 Période 3 — v7 (Filtres durcis)
**Dates :** 2026-07-06 → En cours  
**Dossier GitHub :** `trades/` (actif)  
**Statut :** 🔄 En cours de test

**Objectif :** Réduire les VELOCITY_KILL en entrant plus tôt et avec plus de sélectivité.

---

## 🔧 Changelog des Workflows n8n

### 2026-07-06 — **WF1 v7** ⬅️ Actuel
**Fichier :** `WF1 Token Scanner.json`  
**Modifié par :** Antigravity AI

| Filtre | Avant (v6) | Après (v7) | Raison |
|---|---|---|---|
| `notFomo5m` | ≤ 20% | **≤ 10%** | Évite les entrées sur tokens ayant déjà pumpé |
| `buySellRatio5m` | ≥ 1.0 | **≥ 1.2** | Exige une pression acheteurs plus forte |
| `buySellRatio1h` | ≥ 0.8 | **≥ 0.9** | Trend 1h plus solide |
| `momentum1hOk` | > -10% | **> -5%** | Rejette les tokens en tendance baissière 1h |
| `vol5mRatioOk` | ❌ absent | **≥ 3% de la liq.** | S'assure que le marché est actif en ce moment |

### 2026-07-06 — **WF2 v2** ⬅️ Actuel
**Fichier :** `WF2 Trade Executor.json`  
**Modifié par :** Antigravity AI

| Changement | Avant | Après | Raison |
|---|---|---|---|
| Montant de mise | Hardcodé `700000000` | `process.env.TRADE_AMOUNT_LAMPORTS \|\| 700000000` | Permet d'ajuster la mise sans toucher au code |

> **À configurer dans n8n :** Ajouter la variable d'env `TRADE_AMOUNT_LAMPORTS` dans Settings → Environment Variables pour changer la mise (en lamports : 1 SOL = 1,000,000,000 lamports).

---

### Historique des modifications (avant-v7)

| Date | WF | Changement clé |
|---|---|---|
| 2026-05-02 | Tous | Déploiement initial sur VPS Hostinger |
| ~2026-05-xx | WF1 | v2 : ajout filtre age token (3min-6h) |
| ~2026-05-xx | WF3 | v3 : trailing stop activé à +8%, trail 5% depuis peak |
| ~2026-06-03 | WF1 | v6 : filtres relâchés pour coller aux tokens boostés DexScreener |
| ~2026-06-03 | WF3 | v6 : HARDSTOP à -15%, VELOCITY_KILL si -2%/min et <-3% |
| 2026-07-06 | WF1 | **v7 : filtres durcis (voir tableau ci-dessus)** |
| 2026-07-06 | WF2 | **v2 : mise configurable via env var** |

---

## 📁 Organisation des Trades sur GitHub

```
trades/
├── archives/
│   ├── 2026-05-25_2026-06-10_v1-v5/   ← Anciens trades (ancienne période)
│   │   ├── 2026-05-25.json
│   │   └── ...
│   └── 2026-07-02_2026-07-06_v6/      ← Période v6 (avant les modifs du 06/07)
│       ├── 2026-07-02.json
│       └── ...
└── [fichiers actifs du test en cours]  ← v7 (à partir du 2026-07-06)
    ├── 2026-07-06.json
    └── ...
```

---

## 🎯 Prochaines Étapes

- [ ] Observer ~30 trades en v7 avant de tirer des conclusions
- [ ] Si VELOCITY_KILL > 40% → remonter encore les filtres (notFomo5m à 8%, buySellRatio5m à 1.3)
- [ ] Si win rate > 40% sur 50 trades → envisager passage en live
- [ ] Configurer `TRADE_AMOUNT_LAMPORTS` dans n8n pour tester avec capital dynamique
- [ ] Implémenter signature Solana réelle avant passage en production

---

## 🏗️ Architecture Actuelle

| Composant | Valeur |
|---|---|
| VPS | Hostinger `31.97.197.149` |
| n8n | Docker, port 5678 |
| Trading wallet | `C39XubwzreN3NfV52WGsaPwB6AQCfqpsTAS5XemkzbMc` |
| Profit wallet | `B12z9uHALwceTy1vdeEs2XBQfa79fvsWMM6sJGyPCKyQ` |
| Logs | GitHub repo `SELXXLBG/memebot-logs` |
| Mode | 🟡 SIMULATION (Dry Run) |
| Mise par trade | 0.7 SOL (configurable via `TRADE_AMOUNT_LAMPORTS`) |
