# Cron Jobs for The Sage

## Daily Macro Oracle

**Schedule:** 8:00 AM SGT daily
**Cron Expression:** `0 0 8 * * Asia/Singapore`

### Trigger Configuration (OpenClaw)

```yaml
agents:
  sage:
    cron:
      - name: "macro-oracle"
        schedule: "0 0 8 * *"
        timezone: "Asia/Singapore"
        action: "web_search"
        params:
          query: "US market news FOMC CPI earnings today"
          location: "Singapore"
```

### Quest Action Sequence

1. **Web Search (Brave):**
   - Query: US + SG market news, FOMC, CPI, PCE, earnings
   - Location: Singapore
   
2. **Process & Analyze:**
   - Filter for portfolio-relevant catalysts
   - Assess impact on: tech, finance, crypto, REITs
   
3. **Post to Discord:**
   - Channel: investing-and-finance (#1497920267723214962)
   - Format: "Macro Impact Statement"
   - Include: catalyst + sector impact + recommendation

## /Portfolio Command

**Trigger:** User types `/portfolio` in Discord

### Action Sequence

1. **Trigger n8n webhook** → `https://n8n.danielpzk.com/webhook/update-equities`
2. **Wait for response** → Equity prices updated in Supabase
3. **Send Discord message:** "Master, equities are updated. Please upload screenshot of your Options positions."
4. **Wait for image upload** → Parse with Vision
5. **Update database** → Greeks (Delta, Gamma, Theta, Vega) + Intrinsic Values
6. **Output:** Full portfolio breakdown with P/L, Greeks summary

## YouTube Scrying Orb

**Schedule:** Every 6 hours (`0 */6 * * *`)
**Workflow:** `state/workflows/youtube-scrying.json`

### Configuration Required in n8n

1. Import `youtube-scrying.json` workflow
2. Add YouTube channel IDs to monitor:
   - Example creators: Financial Diet, The Plain Bagel, etc.
3. Configure OpenAI API key
4. Set Discord webhook channel

---

_Cron configured. The Sage awaits his watch._