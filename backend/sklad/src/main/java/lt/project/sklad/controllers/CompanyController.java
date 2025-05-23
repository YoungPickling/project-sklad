package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lt.project.sklad.dto_request.CompanyDTO;
import lt.project.sklad.entities.Company;
import lt.project.sklad.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/rest/v1/secret/company")
public class CompanyController {
    private CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    //@PreAuthorize("")
    public ResponseEntity<?> createCompany(
            @Valid @RequestBody Company company,
            HttpServletRequest request
    ) {
        return companyService.createCompany(company, request);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> readCompany(
            @PathVariable @NotNull Long id,
            HttpServletRequest request
    ) {
        return companyService.getCompanyById(id, request);
    }

    // TODO check
    @GetMapping("/{id}/image")
    public ResponseEntity<?> readCompanyImage(
            @PathVariable @NotNull Long id,
            HttpServletRequest request
    ) {
        return companyService.getCompanyImageById(id, request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyDTO company,
            HttpServletRequest request
    ) {
        return companyService.updateCompany(id, company, request);
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<?> updateCompanyImage(
            @PathVariable @NotNull Long id,
            @RequestParam("image") MultipartFile file,
            HttpServletRequest request
    ) throws MultipartException {
        return companyService.updateCompanyImage(id, file, request);
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<?> deleteCompanyImage(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        return companyService.deleteCompanyImage(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        return companyService.deleteCompany(id, request);
    }
}
