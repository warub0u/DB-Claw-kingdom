# Sage Portfolio Skill

## Triggers
- `/portfolio` - Run portfolio reconciliation
- "update portfolio" - Run portfolio reconciliation
- "portfolio breakdown" - Run portfolio reconciliation

## What this does

The Sage's Ledger Reconciliation - a two-step process:

1. **Trigger equity price update**
   - Call n8n webhook to update standard equity ticker prices in Supabase
   - Webhook: `https://n8n.danielpzk.com/webhook/update-equities`

2. **Request options screenshot**
   - Send message to Discord: "Master, equities are updated. Please upload the screenshot of your current Options positions so I can update the Greeks and Intrinsic Values."

3. **Parse and update** (when user uploads image)
   - Use Vision capabilities to parse the options screenshot
   - Extract: ticker, strike, expiration, premium, contract size
   - Calculate Greeks (Delta, Gamma, Theta, Vega) and Intrinsic Value
   - Update the `options` table in Supabase

4. **Output portfolio breakdown**
   - Fetch all positions from Supabase
   - Calculate total Net Liquidation Value (NLV)
   - Output: equity positions + options positions + Greeks summary

## Supabase Config
- Project: aigwegrqrxquqbjfjcyg
- Host: db.aigwegrqrxquqbjfjcyg.supabase.co
- Tables: equities, options, net_liquidation_history

## n8n Webhooks
- `update-equities` - Updates ticker prices
- Location: https://n8n.danielpzk.com

## Output Format

```
📊 **Portfolio Breakdown**

**Net Liquidation Value:** $XXX,XXX.XX

**Equities:**
| Ticker | Shares | Current Price | Value | P/L |
|--------|--------|---------------|-------|-----|
| AAPL   | 100    | $175.50       | $17,550| +$XXX |

**Options:**
| Ticker | Strike | Exp | Premium | Delta | Gamma | Theta | Vega | Intrinsic |
|--------|--------|-----|---------|-------|-------|-------|------|-----------|
| SPY 450C May | 450 | May 16 | $12.50 | 0.65 | 0.02 | -8.50 | 15.20 | $5,200 |

**Summary:**
- Total Equity: $XXX,XXX
- Total Options: $XX,XXX
- Cash: $XX,XXX
```
