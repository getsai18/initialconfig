package com.cds.initialconfig.dashboard.dto;

import java.util.List;

public record DashboardSummaryResponse(
    StatsResponse stats,
    List<OrderSummaryResponse> orders
) {}
