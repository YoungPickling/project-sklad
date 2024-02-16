package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lt.project.sklad.services.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/secret/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemservice;
    // TODO ItemController POST, GET, PUT, DELETE

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createItem(
            @PathVariable @NotNull Long companyId,
//            @RequestParam("image") MultipartFile file,
            HttpServletRequest request
    ) {
        return itemservice.createItem(companyId, request);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<?> readItem(
            @PathVariable @NotNull Long itemId,
            HttpServletRequest request
    ) {
        return itemservice.readItem(itemId, request);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateItem(
            @PathVariable @NotNull Long itemId,
            HttpServletRequest request
    ) {
        return itemservice.updateItem(itemId, request);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(
            @PathVariable @NotNull Long itemId,
            HttpServletRequest request
    ) {
        return itemservice.deleteItem(itemId, request);
    }
}
