package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Location;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.LocationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * {@link Location} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final HttpResponseService responseService;
    private final CompanyRepository companyRepository;
    private final TokenService tokenService;
    private final MessagingUtils msgUtils;
    // TODO LocationService methods

    public ResponseEntity<?> createLocation(
            final Long companyId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
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
