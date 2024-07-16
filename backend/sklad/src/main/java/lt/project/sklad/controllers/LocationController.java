package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.entities.Location;
import lt.project.sklad.entities.Supplier;
import lt.project.sklad.services.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rest/v1/secret/location")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;
    // TODO LocationController POST, GET, PUT, DELETE

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createLocation(
            @PathVariable @NotNull long companyId,
            @Valid @RequestBody Location location,
            HttpServletRequest request
    ) {
        return locationService.createLocation(companyId, location, request);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateSupplier(
            @PathVariable @NotNull long companyId,
            @Valid @RequestBody Location location,
            HttpServletRequest request
    ) {
        return locationService.updateLocation(companyId, location, request);
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteSupplier(
            @PathVariable @NotNull long companyId,
            @RequestParam("delete") @NotNull List<Long> locations,
            HttpServletRequest request
    ) {
        return locationService.deleteLocation(companyId, locations, request);
    }
}
