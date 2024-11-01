package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.entities.ItemGroup;
import lt.project.sklad.services.ItemGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rest/v1/secret/group")
@RequiredArgsConstructor
public class GroupController {
    private final ItemGroupService itemGroupService;
    // TODO LocationController POST, GET, PUT, DELETE

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createLocation(
            @PathVariable @NotNull long companyId,
            @Valid @RequestBody ItemGroup itemGroup,
            HttpServletRequest request
    ) {
        return itemGroupService.createGroup(companyId, itemGroup, request);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateSupplier(
            @PathVariable @NotNull long companyId,
            @Valid @RequestBody ItemGroup itemGroup,
            HttpServletRequest request
    ) {
        return itemGroupService.updateGroup(companyId, itemGroup, request);
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteSupplier(
            @PathVariable @NotNull long companyId,
            @RequestParam("delete") @NotNull List<Long> groups,
            HttpServletRequest request
    ) {
        return itemGroupService.deleteGroup(companyId, groups, request);
    }
}