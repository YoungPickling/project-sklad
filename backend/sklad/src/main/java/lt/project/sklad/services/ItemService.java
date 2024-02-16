package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Item;
import lt.project.sklad.entities.ItemColumn;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.ItemColumnRepository;
import lt.project.sklad.repositories.ItemRepository;
import org.springframework.http.ResponseEntity;
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
    private final CompanyRepository companyRepository;
    private final TokenService tokenService;
    private final MessagingUtils msgUtils;
    private final HttpResponseService responseService;
    // TODO ItemService methods

    public ResponseEntity<?> createItem(
            final Long companyId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> readItem(
            final Long itemId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> updateItem(
            final Long itemId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> deleteItem(
            final Long itemId,
            final HttpServletRequest request
    ) {
        return ResponseEntity.noContent().build();
    }
}
