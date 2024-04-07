package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.entities.Item;
import lt.project.sklad.services.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secret/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    // TODO ItemController POST, GET, PUT, DELETE

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createItem(
            @PathVariable @NotNull long companyId,
            @Valid @RequestBody Item item,
            HttpServletRequest request
    ) {
        return itemService.createItem(companyId, item, request);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<?> readItem(
            @PathVariable @NotNull long itemId,
            HttpServletRequest request
    ) {
        return itemService.readItem(itemId, request);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateItem(
            @PathVariable @NotNull long itemId,
            HttpServletRequest request
    ) {
        return itemService.updateItem(itemId, request);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(
            @PathVariable @NotNull long itemId,
            HttpServletRequest request
    ) {
        return itemService.deleteItem(itemId, request);
    }
}
