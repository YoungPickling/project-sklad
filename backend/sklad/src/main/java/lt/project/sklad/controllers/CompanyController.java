package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.dto_request.CompanyRequest;
import lt.project.sklad.services.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secret/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    // TODO CompanyController POST, GET, PUT, DELETE
    @PostMapping
    public ResponseEntity<?> createCompany(
            @Valid @RequestBody CompanyRequest requestBody,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
//        return companyService.createCompany(file);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> readCompany(
            @PathVariable String id,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
//        return companyService.readCompany(file);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(
            @PathVariable String id,
            @Valid @RequestBody CompanyRequest requestBody,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
//        return companyService.updateCompany(file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(
            @PathVariable String id,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
//        return companyService.deleteCompany(file);
        return ResponseEntity.ok().build();
    }
}
