package utez.edu.mx.cpm.backend.kernel.utils;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/version")
public class VersionManager {
    @GetMapping("")
    public String getVersionView() {
        return "version";
    }
}
