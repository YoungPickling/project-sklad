    package lt.project.sklad.controllers;

    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.validation.Valid;
    import jakarta.validation.constraints.NotNull;
    import lombok.RequiredArgsConstructor;
    import lt.project.sklad.dto_request.AssemleDTO;
    import lt.project.sklad.entities.Item;
    import lt.project.sklad.services.ItemService;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.HashMap;
    import java.util.List;



    @RestController
    @RequestMapping("/api/rest/v1/secret/item")
    @RequiredArgsConstructor
    public class ItemController {
        private final ItemService itemService;
        private static Logger logger = LoggerFactory.getLogger(ItemController.class);
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
                @Valid @RequestBody Item item,
                HttpServletRequest request
        ) {
            return itemService.updateItem(itemId, item, request);
        }

        @DeleteMapping()
        public ResponseEntity<?> deleteItem(
                @RequestParam("delete") @NotNull List<Long> items,
                HttpServletRequest request
        ) {
            return itemService.deleteItem(items, request);
        }

        @PostMapping("/suppliers/{itemId}")
        public ResponseEntity<?> setItemSuppliers(
                @PathVariable @NotNull long itemId,
                @RequestParam(name = "s", required = false) List<Long> suppliers,
                HttpServletRequest request
        ) {
            return itemService.addItemSupplier(itemId, suppliers, request);
        }

        @PutMapping("/location/{itemId}/{locationId}")
        public ResponseEntity<?> updateItemStock(
                @PathVariable @NotNull long itemId,
                @PathVariable @NotNull long locationId,
                @RequestBody String quantity,
                HttpServletRequest request
        ) {
            return itemService.putItemLocation(itemId, locationId, quantity, request);
        }

        @PutMapping("/parents/{itemId}")
        public ResponseEntity<?> updateItemParents(
                @PathVariable @NotNull Long itemId,
                @RequestBody HashMap<Long, Long> quantity,
                HttpServletRequest request
        ) {
            return itemService.putItemParents(itemId, quantity, request);
        }

        @PutMapping("/{itemId}/status/{companyId}")
        public ResponseEntity<?> updateProductStatus(
                @PathVariable @NotNull Long itemId,
                @PathVariable @NotNull Long companyId,
                HttpServletRequest request
        ) {
            return itemService.updateProductStatus(itemId, companyId, request);
        }

        @PostMapping("/assemble/{itemId}")
        public ResponseEntity<?> updateItemParents(
                @PathVariable @NotNull Long itemId,
                @RequestBody AssemleDTO body,
                HttpServletRequest request
        ) {
            return itemService.assembleItem(itemId, body, request);
        }
    }
