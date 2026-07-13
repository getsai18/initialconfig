package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto;

import java.util.List;

public record DashboardSummaryResponse(
        StatsResponse stats,
        List<OrderSummaryResponse> orders
) {
}
