package lt.project.sklad.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad.entities.Company;
import lt.project.sklad.repositories.CompanyRepository;
import org.springframework.stereotype.Service;

/**
 * {@link Company} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final HttpResponseService responseService;
    // TODO CompanyService methods
}
