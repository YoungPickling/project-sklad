package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Item;
import lt.project.sklad.entities.Supplier;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.ItemRepository;
import lt.project.sklad.repositories.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

/**
 * {@link Supplier} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
public class SupplierService {
    private SupplierRepository supplierRepository;
    private CompanyRepository companyRepository;
    private ItemRepository itemRepository;
    private TokenService tokenService;
    private MessagingUtils msgUtils;

    @Autowired
    public SupplierService(
            SupplierRepository supplierRepository,
            CompanyRepository companyRepository,
            ItemRepository itemRepository,
            TokenService tokenService,
            MessagingUtils msgUtils
    ) {
        this.supplierRepository = supplierRepository;
        this.companyRepository = companyRepository;
        this.itemRepository = itemRepository;
        this.tokenService = tokenService;
        this.msgUtils = msgUtils;
    }

    @Transactional
    public ResponseEntity<?> createSupplier(
            final long companyId,
            final Supplier supplier,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
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

    @Transactional
    public ResponseEntity<?> updateSupplier(
            final long companyId,
            final Supplier supplier,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
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

        Supplier existingSupplier = supplierRepository.findById(supplier.getId()).orElse(null);

        if(existingSupplier == null || existingSupplier.getOwner().getId() != companyId)
            return msgUtils.error(FORBIDDEN, "Access denied");

        existingSupplier.setName(supplier.getName());
        existingSupplier.setStreetAndNumber(supplier.getStreetAndNumber());
        existingSupplier.setCityOrTown(supplier.getCityOrTown());
        existingSupplier.setCountryCode(supplier.getCountryCode());
        existingSupplier.setPostalCode(supplier.getPostalCode());
        existingSupplier.setPhoneNumber(supplier.getPhoneNumber());
        existingSupplier.setPhoneNumberTwo(supplier.getPhoneNumberTwo());
        existingSupplier.setWebsite(supplier.getWebsite());
        existingSupplier.setDescription(supplier.getDescription());

        supplierRepository.save(existingSupplier);

        return ResponseEntity.ok().body(existingSupplier);
    }

    @Transactional
    public ResponseEntity<?> deleteSuppliers(
            final long companyId,
            final List<Long> suppliers,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(companyId, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        List<Supplier> foundSuppliers = supplierRepository.findAllById(suppliers);

        if (foundSuppliers == null || foundSuppliers.isEmpty())
            return msgUtils.error(NOT_FOUND, "Suppliers not found");

        boolean wrongCompany = foundSuppliers.stream().anyMatch(
                x -> x.getOwner().getId() != companyId);

        if(wrongCompany) {
            return msgUtils.error(NOT_FOUND, "Alien supplier in the list");
        }

        List<Item> items = itemRepository.findAllByCompanyId(companyId);

        if(items == null || items.isEmpty()) {
            return msgUtils.error(NOT_FOUND, "No items found");
        }

        // Remove supplier associations from items
        for (Item item : items) {
            for (Supplier supplier : foundSuppliers) {
                if (item.getSuppliers().contains(supplier)) {
                    item.getSuppliers().remove(supplier);
                    itemRepository.save(item); // Save the item after modifying its suppliers
                }
            }
        }

        company.getSuppliers().removeAll(foundSuppliers);
        supplierRepository.deleteAll(foundSuppliers);

        // Verify if suppliers are deleted
        List<Supplier> postDeleteSuppliers = supplierRepository.findAllById(suppliers);
        if (!postDeleteSuppliers.isEmpty()) {
            System.err.println("Suppliers not deleted: " + postDeleteSuppliers.stream().map(Supplier::getId).collect(Collectors.toList()));
            return msgUtils.error(INTERNAL_SERVER_ERROR, "Failed to delete some suppliers");
        }

        return ResponseEntity.ok().body(null);
    }
}
