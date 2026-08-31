import math
from typing import Dict, Any, List
from app.schemas.weather import (
    LocationInfo,
    ModelAgreement,
    ModelComparisonResponse
)


class ModelAgreementEngine:
    """
    Multi-Model Forecast Fusion & Agreement Engine.
    Statistically compares authoritative IMD forecast, NOAA GFS, and regional WRF predictions.
    Computes an agreement score (0.0 to 1.0) and evaluates forecast uncertainty transparently.
    """
    @staticmethod
    def compare_models(
        location: LocationInfo,
        imd_data: Dict[str, Any],
        gfs_data: Dict[str, Any],
        wrf_data: Dict[str, Any],
        target_time: str = "Next 24 Hours"
    ) -> ModelComparisonResponse:
        parameters_eval: List[ModelAgreement] = []
        agreement_points = 0
        total_evals = 3  # Temp, Rain Amount, Rain Probability

        # 1. Temperature Comparison
        imd_t = imd_data.get("temp_c", 33.0)
        gfs_t = gfs_data.get("forecast_temp_c", 32.8)
        wrf_t = wrf_data.get("forecast_temp_c", 33.1)

        temp_diff = max(abs(imd_t - gfs_t), abs(imd_t - wrf_t))
        if temp_diff <= 1.5:
            t_agree = "HIGH"
            agreement_points += 1.0
            t_exp = f"All models converge tightly within {temp_diff:.1f}°C (IMD: {imd_t}°C, GFS: {gfs_t}°C, WRF: {wrf_t}°C)."
        elif temp_diff <= 3.5:
            t_agree = "MEDIUM"
            agreement_points += 0.5
            t_exp = f"Moderate thermal variance of {temp_diff:.1f}°C between global and regional mesoscale grids."
        else:
            t_agree = "LOW"
            t_exp = f"High divergence of {temp_diff:.1f}°C across NWP model initializations."

        parameters_eval.append(ModelAgreement(
            parameter="Temperature (°C)",
            imd_value=f"{imd_t}°C",
            gfs_value=f"{gfs_t}°C",
            wrf_value=f"{wrf_t}°C",
            agreement_level=t_agree,
            variance_explanation=t_exp
        ))

        # 2. Rain Probability Comparison
        imd_p = imd_data.get("rain_prob_pct", 80)
        gfs_p = gfs_data.get("max_rain_prob_pct", 75)
        wrf_p = wrf_data.get("max_rain_prob_pct", 82)

        p_diff = max(abs(imd_p - gfs_p), abs(imd_p - wrf_p))
        if p_diff <= 15:
            p_agree = "HIGH"
            agreement_points += 1.0
            p_exp = f"Consensus on precipitation occurrence (IMD: {imd_p}%, GFS: {gfs_p}%, WRF: {wrf_p}%)."
        elif p_diff <= 30:
            p_agree = "MEDIUM"
            agreement_points += 0.5
            p_exp = f"Moderate timing or spatial displacement in convective precipitation fields ({p_diff}% variance)."
        else:
            p_agree = "LOW"
            p_exp = f"High disagreement on precipitation probability ({p_diff}% spread)."

        parameters_eval.append(ModelAgreement(
            parameter="Precipitation Probability (%)",
            imd_value=f"{imd_p}%",
            gfs_value=f"{gfs_p}%",
            wrf_value=f"{wrf_p}%",
            agreement_level=p_agree,
            variance_explanation=p_exp
        ))

        # 3. Rain Accumulation Amount
        imd_r = imd_data.get("rain_mm", 38.0)
        gfs_r = gfs_data.get("expected_rain_24h_mm", 32.0)
        wrf_r = wrf_data.get("expected_rain_24h_mm", 41.5)

        r_diff = max(abs(imd_r - gfs_r), abs(imd_r - wrf_r))
        if r_diff <= 10.0 or (imd_r == 0 and gfs_r == 0 and wrf_r == 0):
            r_agree = "HIGH"
            agreement_points += 1.0
            r_exp = f"Quantitative precipitation forecast (QPF) shows strong spatial consensus."
        elif r_diff <= 25.0:
            r_agree = "MEDIUM"
            agreement_points += 0.5
            r_exp = f"Mesoscale WRF indicates higher localized convective accumulation (+{r_diff:.1f} mm)."
        else:
            r_agree = "LOW"
            r_exp = f"High divergence in QPF totals across model physics schemes."

        parameters_eval.append(ModelAgreement(
            parameter="24h Rainfall Accumulation (mm)",
            imd_value=f"{imd_r} mm",
            gfs_value=f"{gfs_r} mm",
            wrf_value=f"{wrf_r} mm",
            agreement_level=r_agree,
            variance_explanation=r_exp
        ))

        score = round(agreement_points / total_evals, 2)
        if score >= 0.8:
            overall_level = "HIGH"
            uncertainty = "LOW"
            synthesis = "IMD, GFS, and WRF models show strong consensus on weather parameters. High forecast confidence."
        elif score >= 0.5:
            overall_level = "MEDIUM"
            uncertainty = "MODERATE"
            synthesis = "General agreement on atmospheric pattern, but slight variance in localized rainfall timing/amounts."
        else:
            overall_level = "LOW"
            uncertainty = "HIGH"
            synthesis = "Significant divergence between global and regional mesoscale models. Forecast uncertainty is elevated."

        return ModelComparisonResponse(
            location=location,
            target_time=target_time,
            models_evaluated=["IMD Ensemble/City", "NOAA GFS (0.25°)", "WRF-ARW (3km)"],
            agreement_score=score,
            agreement_level=overall_level,
            parameters=parameters_eval,
            synthesis=synthesis,
            uncertainty_index=uncertainty
        )


model_agreement_engine = ModelAgreementEngine()
