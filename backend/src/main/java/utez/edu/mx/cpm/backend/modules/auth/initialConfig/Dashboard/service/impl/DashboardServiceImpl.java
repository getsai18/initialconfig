package utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto.DashboardSummaryResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto.OrderSummaryResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.dto.StatsResponse;
import utez.edu.mx.cpm.backend.modules.auth.initialConfig.Dashboard.service.DashboardService;
//import utez.edu.mx.cpm.backend.modules.auth.preproduction.Ordenes.Orden;
//import utez.edu.mx.cpm.backend.modules.auth.preproduction.Ordenes.OrdenRepository;
//import utez.edu.mx.cpm.backend.modules.auth.preproduction.Pedidos.Pedido;

import java.util.List;

/**
 * Reemplaza el stub anterior (siempre 0 / lista vacía) con agregados reales
 * sobre Orden/Pedido, usando el único vocabulario de estado real del dominio
 * (Pedido.EN_PROGRESO/EN_PRODUCCION/TERMINADO) — ver StatsResponse/OrderSummaryResponse.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

//    private final OrdenRepository ordenRepository;

    @Override
    public DashboardSummaryResponse summary() {
        // int enProgreso = (int) ordenRepository.countByStatus(Pedido.EN_PROGRESO);
        // int enProduccion = (int) ordenRepository.countByStatus(Pedido.EN_PRODUCCION);
        // int terminadas = (int) ordenRepository.countByStatus(Pedido.TERMINADO);
        // // Reservado para el futuro módulo de Incidencias — no existe todavía, así
        // // que se devuelve fijo en 0 en vez de aproximarlo con otro dato real.
        // int incidencias = 0;

//        List<OrderSummaryResponse> recientes = ordenRepository.findTop8ByOrderByFechaCreacionDesc().stream()
//                .map(this::toOrderSummary)
//                .toList();
//
//        return new DashboardSummaryResponse(
//                new StatsResponse(enProgreso, enProduccion, terminadas, incidencias),
//                recientes
//        );

        return null;
    }

    private OrderSummaryResponse toOrderSummary(/*Orden orden*/) {
//        Pedido pedido = orden.getPedido();
//        return new OrderSummaryResponse(
//                orden.getId(),
//                pedido.getFecha(),
//                pedido.getFechaLimite(),
//                pedido.getCliente().getNombre(),
//                orden.getStatus()
//        );
        return null;
    }
}
