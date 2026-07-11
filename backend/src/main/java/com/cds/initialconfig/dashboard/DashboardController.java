package com.cds.initialconfig.dashboard;

import com.cds.initialconfig.dashboard.dto.DashboardSummaryResponse;
import com.cds.initialconfig.dashboard.dto.StatsResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** stats/orders reales dependen del módulo de producción (aún no existe).
 *  Devuelve stats en 0 y orders vacío, respetando el contrato de respuesta. */
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @GetMapping("/summary")
    public DashboardSummaryResponse summary() {
        return new DashboardSummaryResponse(new StatsResponse(0, 0, 0, 0), List.of());
    }
}
