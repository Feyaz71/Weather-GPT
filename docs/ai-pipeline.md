# AI Orchestration & Tool Calling Pipeline

## 1. Intent Extraction Matrix

| User Input | Detected Intent | Location | Target Window | Parameters |
| :--- | :--- | :--- | :--- | :--- |
| "Will it rain tomorrow evening in Delhi?" | `FORECAST` / `RAINFALL` | Delhi | Tomorrow Evening | rain, rain_prob, warnings |
| "कल शाम दिल्ली में बारिश होगी क्या?" | `FORECAST` / `RAINFALL` | Delhi | Tomorrow Evening | rain, rain_prob, warnings |
| "Should I irrigate my wheat crop tomorrow in Ludhiana?" | `AGRICULTURE_ADVISORY` | Ludhiana | Tomorrow | irrigation, crop: wheat |
| "Compare IMD and GFS forecast for Mumbai" | `MODEL_COMPARISON` | Mumbai | Next 24h | model_agreement, variance |
| "What about evening?" (Follow-up) | `FORECAST` | *Inherited from previous turn* | Evening | *Inherited* |

---

## 2. Guardrails Against Hallucination

1. **Deterministic Tool Gating**: The LLM never writes raw weather metrics. Metrics are fetched solely through Python tool executions.
2. **Schema Binding**: Numerical values strictly originate from Pydantic `WeatherObservation` or `ForecastResponse`.
3. **Traceable Factors**: Every recommendation lists its exact contributing meteorological drivers.
