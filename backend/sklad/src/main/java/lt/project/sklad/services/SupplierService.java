package lt.project.sklad.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad.entities.Supplier;
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
    private final SupplierRepository companyRepository;
    private final HttpResponseService responseService;
    // TODO SupplierService methods
}
