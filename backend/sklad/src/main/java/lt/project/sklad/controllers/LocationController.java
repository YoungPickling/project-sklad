package lt.project.sklad.controllers;

import lombok.RequiredArgsConstructor;
import lt.project.sklad.services.LocationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secret/location")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;
    // TODO LocationController POST, GET, PUT, DELETE
}
