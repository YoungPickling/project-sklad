package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Supplier;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.SupplierRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

/**
 * {@link Supplier} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final HttpResponseService responseService;
    private final CompanyRepository companyRepository;
    private final TokenService tokenService;
    private final MessagingUtils msgUtils;

    @Transactional
    public ResponseEntity<?> createSupplier(
            final long companyId,
            final Supplier supplier,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(companyId, token.getUser().getId()).orElse(null);
        
        if (company == null)
            return ResponseEntity.notFound().build();

        if(!company.getUser().contains(token.getUser()))
            return msgUtils.error(FORBIDDEN, "Access denied");

        Supplier result = supplierRepository.save(Supplier.builder()
                .name(supplier.getName())
                .streetAndNumber(supplier.getStreetAndNumber())
                .cityOrTown(supplier.getCityOrTown())
                .countryCode(supplier.getCountryCode())
                .postalCode(supplier.getPostalCode())
                .phoneNumber(supplier.getPhoneNumber())
                .phoneNumberTwo(supplier.getPhoneNumberTwo())
                .website(supplier.getWebsite())
                .description(supplier.getDescription())
                .owner(company)
                .build()
        );
        company.getSuppliers().add(result);

        return ResponseEntity.ok().body(result);
    }
    // TODO SupplierService methods
}
