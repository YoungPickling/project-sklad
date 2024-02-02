package lt.project.sklad.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad.entities.Item;
import lt.project.sklad.entities.ItemColumn;
import lt.project.sklad.repositories.ItemColumnRepository;
import lt.project.sklad.repositories.ItemRepository;
import org.springframework.stereotype.Service;

/**
 * {@link Item} and {@link ItemColumn} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final ItemColumnRepository itemColumnRepository;
    private final HttpResponseService responseService;
    // TODO ItemService methods
}
