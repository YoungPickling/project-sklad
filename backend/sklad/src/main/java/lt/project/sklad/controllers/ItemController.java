package lt.project.sklad.controllers;

import lombok.RequiredArgsConstructor;
import lt.project.sklad.services.ItemService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secret/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemservice;
    // TODO ItemController POST, GET, PUT, DELETE
}
