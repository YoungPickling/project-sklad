package lt.project.sklad.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad.entities.Location;
import lt.project.sklad.repositories.LocationRepository;
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
    // TODO LocationService methods
}
