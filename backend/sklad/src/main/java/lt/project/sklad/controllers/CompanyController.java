package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.dto_request.CreateCompanyRequest;
import lt.project.sklad.services.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secret/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    // TODO CompanyController POST, GET, PUT, DELETE
    @GetMapping("{id}")
    public ResponseEntity<?> createCompany(
            @Valid @RequestParam String id,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
//        return companyService.uploadImage(file);
        return ResponseEntity.badRequest().build();
    }

    @PostMapping
    public ResponseEntity<?> createCompany(
        @Valid @RequestBody CreateCompanyRequest requestBody,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
//        return companyService.uploadImage(file);
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    public ResponseEntity<?> updateCompany(
            @Valid @RequestParam String id,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
//        return companyService.uploadImage(file);
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteCompany(
            @Valid @RequestParam String id,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
//        return companyService.uploadImage(file);
        return ResponseEntity.badRequest().build();
    }
}
