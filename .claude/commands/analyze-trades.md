Analyse les trades récents et donne des recommandations d'optimisation concrètes.

## Instructions

1. Lis tous les fichiers JSON dans `trades/` (format `YYYY-MM-DD.json`)
2. Calcule rapidement : nombre de trades, win rate, PnL total, profit factor, répartition des raisons de sortie
3. Focus principal : **identifier les patterns exploitables pour optimiser le système**

## Logique d'analyse

### Si < 30 trades
- Dis clairement que les données sont insuffisantes pour tirer des conclusions fiables
- Estime combien de jours il faut attendre pour atteindre 30-50 trades (basé sur le rythme actuel)
- Signale uniquement les problèmes ÉVIDENTS (ex: >70% VELOCITY_KILL = le timing d'entrée est cassé)
- Ne recommande PAS de modifier les paramètres sauf si un bug est visible

### Si 30-100 trades
- Analyse les corrélations (score, mcap, liquidity, volume) vs résultat
- Compare les périodes (derniers 3 jours vs reste) pour voir l'effet des ajustements
- Propose 1-3 modifications concrètes avec confiance MOYENNE
- Indique quels paramètres toucher en priorité (filtres WF1 vs exits WF3)

### Si > 100 trades
- Analyse complète avec confiance ÉLEVÉE
- Recommandations chiffrées (ex: "remonter mcap min à 40k réduirait 30% des VELOCITY_KILL")
- Évaluer si le système est prêt pour le live

## Règles
- Ne jamais recommander de passer en live avant 100 trades minimum
- Préférer "attends plus de data" plutôt que de sur-optimiser sur du bruit
- Signaler si l'irrégularité observée est normale (meme coins = streaky par nature) ou anormale

## Format de sortie
Rapport COURT directement dans la conversation (pas de fichier .md). Max 1 tableau récap + quelques bullet points. Être direct et honnête sur le niveau de confiance.
