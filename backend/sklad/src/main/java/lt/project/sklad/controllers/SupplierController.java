package lt.project.sklad.controllers;

import lombok.RequiredArgsConstructor;
import lt.project.sklad.services.SupplierService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secret/supplier")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    // TODO SupplierController POST, GET, PUT, DELETE
}
