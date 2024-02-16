package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.services.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secret/location")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;
    // TODO LocationController POST, GET, PUT, DELETE

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createLocation(
            @PathVariable @NotNull Long companyId,
//            @RequestParam("image") MultipartFile file,
            HttpServletRequest request
    ) {
        return locationService.createLocation(companyId, request);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<?> readLocation(
            @PathVariable @NotNull Long companyId,
            HttpServletRequest request
    ) {
        return locationService.readLocation(companyId, request);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateLocation(
            @PathVariable @NotNull Long companyId,
            HttpServletRequest request
    ) {
        return locationService.updateLocation(companyId, request);
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteLocation(
            @PathVariable @NotNull Long companyId,
            HttpServletRequest request
    ) {
        return locationService.deleteLocation(companyId, request);
    }
}
