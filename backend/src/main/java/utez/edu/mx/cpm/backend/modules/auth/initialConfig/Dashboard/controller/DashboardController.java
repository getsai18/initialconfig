package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto.DashboardSummaryResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        return dashboardService.summary();
    }
}
