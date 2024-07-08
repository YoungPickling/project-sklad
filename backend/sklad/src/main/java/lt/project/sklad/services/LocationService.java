package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Location;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.LocationRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

/**
 * {@link Location} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final CompanyRepository companyRepository;
    private final TokenService tokenService;
    private final MessagingUtils msgUtils;
    // TODO LocationService methods

    @Transactional
    public ResponseEntity<?> createLocation(
            final Long companyId,
            final Location location,
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

    public ResponseEntity<?> readLocation(
            final Long itemId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> updateLocation(
            final Long itemId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> deleteLocation(
            final Long itemId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
    }
}
