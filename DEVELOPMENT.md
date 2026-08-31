# WeatherGPT Developer Guidelines

## 1. Code Standards
- **Python**: Python 3.12, PEP 8, Pydantic v2 strict models, async/await I/O for network calls.
- **Frontend**: TypeScript strict mode, functional components, React Context, Tailwind utility classes.
- **Safety**: Never allow the LLM to hallucinate meteorological values or official warnings.
- **Explainability**: Every intelligence engine decision must output traceable `factors` and `sources`.

## 2. Adding a New Meteorological Data Provider
1. Inherit from `BaseWeatherProvider`, `BaseForecastProvider`, or `BaseNWPProvider` in `backend/app/providers/base.py`.
2. Implement your provider in `backend/app/providers/<provider_name>/provider.py`.
3. Normalize provider output into `WeatherObservation` or `ForecastResponse`.
4. Register the provider in `backend/app/ai/tools.py`.

## 3. Adding a New Risk Engine
1. Create `backend/app/intelligence/risk/<engine_name>.py`.
2. Implement the static `analyze()` method taking `(obs, forecast, warnings)`.
3. Return a `WeatherRiskAnalysis` with explicit mathematical/meteorological thresholds.
4. Add unit test coverage in `backend/tests/test_risk_engines.py`.
