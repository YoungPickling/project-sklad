package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Location;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

/**
 * {@link Location} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
public class LocationService {
    private LocationRepository locationRepository;
    private CompanyRepository companyRepository;
    private TokenService tokenService;
    private MessagingUtils msgUtils;

    @Autowired
    public LocationService(
            LocationRepository locationRepository,
            CompanyRepository companyRepository,
            TokenService tokenService,
            MessagingUtils msgUtils
    ) {
        this.locationRepository = locationRepository;
        this.companyRepository = companyRepository;
        this.tokenService = tokenService;
        this.msgUtils = msgUtils;
    }

    @Transactional
    public ResponseEntity<?> createLocation(
            final Long companyId,
            final Location location,
            final HttpServletRequest request
    ) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

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

        Location result = locationRepository.save(Location.builder()
                .name(location.getName())
                .streetAndNumber(location.getStreetAndNumber())
                .cityOrTown(location.getCityOrTown())
                .countryCode(location.getCountryCode())
                .postalCode(location.getPostalCode())
                .phoneNumber(location.getPhoneNumber())
                .phoneNumberTwo(location.getPhoneNumberTwo())
                .description(location.getDescription())
                .owner(company)
                .build()
        );

        company.getLocations().add(result);

        return ResponseEntity.ok().body(result);
    }

    @Transactional
    public ResponseEntity<?> updateLocation(
            final long companyId,
            final Location location,
            final HttpServletRequest request
    ) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

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

        Location existingLocation = locationRepository.findById(location.getId()).orElse(null);

        if(existingLocation == null || existingLocation.getOwner().getId() != companyId)
            return msgUtils.error(FORBIDDEN, "Access denied");

        existingLocation.setName(location.getName());
        existingLocation.setStreetAndNumber(location.getStreetAndNumber());
        existingLocation.setCityOrTown(location.getCityOrTown());
        existingLocation.setCountryCode(location.getCountryCode());
        existingLocation.setPostalCode(location.getPostalCode());
        existingLocation.setPhoneNumber(location.getPhoneNumber());
        existingLocation.setPhoneNumberTwo(location.getPhoneNumberTwo());
        existingLocation.setDescription(location.getDescription());

        locationRepository.save(existingLocation);

        return ResponseEntity.ok().body(existingLocation);
    }

    @Transactional
    public ResponseEntity<?> deleteLocation(
            final long companyId,
            final List<Long> locations,
            final HttpServletRequest request
    ) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(companyId, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        List<Location> foundLocations = locationRepository.findAllById(locations);

        if (foundLocations == null || foundLocations.isEmpty())
            return msgUtils.error(NOT_FOUND, "Location not found");

        boolean wrongCompany = foundLocations.stream().anyMatch(
                x -> x.getOwner().getId() != companyId);

        if(wrongCompany)
            return msgUtils.error(NOT_FOUND, "Alien location in the list");

//        company.getSuppliers().removeAll(foundLocations);
        company.getLocations().removeAll(foundLocations);

        List<Location> postDeleteLocations = locationRepository.findAllById(locations);
        if (!postDeleteLocations.isEmpty()) {
            System.err.println("Locations not deleted: " + postDeleteLocations.stream().map(Location::getId).toList()); // .collect(Collectors.toList())
            return msgUtils.error(INTERNAL_SERVER_ERROR, "Failed to delete some locations");
        }

        return ResponseEntity.ok().body(null);
    }
}
