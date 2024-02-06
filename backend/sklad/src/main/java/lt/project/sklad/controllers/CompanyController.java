package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.dto_request.CompanyRequest;
import lt.project.sklad.entities.Company;
import lt.project.sklad.services.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secret/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    // TODO CompanyController PUT, DELETE
    @PostMapping
    public ResponseEntity<?> createCompany(
            @Valid @RequestBody Company company,
            HttpServletRequest request
    ) {
        return companyService.createCompany(company, request);
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> readCompany(
            @PathVariable @NotNull Long id,
            HttpServletRequest request
    ) {
        return companyService.getCompanyById(id, request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(
            @PathVariable String id,
            @Valid @RequestBody CompanyRequest requestBody,
            HttpServletRequest request
    ) {
//        return companyService.updateCompany(file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(
            @PathVariable String id,
            HttpServletRequest request
    ) {
//        return companyService.deleteCompany(file);
        return ResponseEntity.ok().build();
    }
}
