---
title: Mission Control API Endpoints
created: 2026-04-30T11:20:00Z

## Supabase Endpoints (Working)
Base URL: https://aigwegrqrxquqbjfjcyg.supabase.co

### NLV History
GET /rest/v1/net_liquidation_history?select=date,net_liquidation_value,capital_invested&order=date.desc&limit=10

### Transactions
GET /rest/v1/transactions?select=*&order=transaction_date.desc&limit=10

### Valuations
GET /rest/v1/valuations?select=*

### Portfolio
GET /rest/v1/portfolio?select=*

### Watchlist
GET /rest/v1/watchlist?select=*

## n8n Workflows (Working)
Base URL: https://n8n.danielpzk.com
Header: X-N8N-API-KEY: [key]

### Active Workflows
- Knowledge Base Processor (OxcxBYeowpkf6rASjgjYr)
- Portfolio Agent (VAe_qk-w526v8W7OLybAX)
- Supa-Orchestrator (YIWGXouHgXZDodopGvxtK)
- Valuation Agent (BAUvfY12Tt25jjyas4A6D)
- Librarian (0F9vQH3k9OQ3FNeaj0dJA)

## Dashboard Integration Notes
- Use Recharts for NLV line chart
- Use real-time polling for workflow status (every 30s)
- Cache Supabase queries for 60s to reduce load
---
