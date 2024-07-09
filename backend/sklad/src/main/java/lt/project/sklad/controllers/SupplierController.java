package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.entities.Supplier;
import lt.project.sklad.services.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rest/v1/secret/supplier")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    // TODO SupplierController POST, GET, PUT, DELETE

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createSupplier(
            @PathVariable @NotNull long companyId,
            @Valid @RequestBody Supplier supplier,
            HttpServletRequest request
    ) {
        return supplierService.createSupplier(companyId, supplier, request);
    }
    
    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateSupplier(
            @PathVariable @NotNull long companyId,
            @Valid @RequestBody Supplier supplier,
            HttpServletRequest request
    ) {
        return supplierService.updateSupplier(companyId, supplier, request);
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteSupplier(
            @PathVariable @NotNull long companyId,
            @RequestParam("delete") @NotNull List<Long> suppliers,
            HttpServletRequest request
    ) {
        return supplierService.deleteSupplier(companyId, suppliers, request);
    }
}
