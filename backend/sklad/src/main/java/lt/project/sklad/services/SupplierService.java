package lt.project.sklad.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Supplier;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.SupplierRepository;
import org.springframework.stereotype.Service;

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
    // TODO SupplierService methods
}
