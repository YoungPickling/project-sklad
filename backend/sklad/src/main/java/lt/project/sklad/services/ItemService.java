package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Item;
import lt.project.sklad.entities.ItemColumn;
import lt.project.sklad.entities.Location;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.ItemColumnRepository;
import lt.project.sklad.repositories.ItemRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

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
    private final CompanyRepository companyRepository;
    private final TokenService tokenService;
    private final MessagingUtils msgUtils;
    // TODO ItemService methods

    @Transactional
    public ResponseEntity<?> createItem(
            final long companyId,
            final Item item,
            final HttpServletRequest request
    ) {
        // Authorization
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(companyId, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        if(!company.getUser().contains(token.getUser()))
            return msgUtils.error(FORBIDDEN, "Access denied");

        // Inserting new item

        Item resultItem = itemRepository.save(
                new Item(
                        item.getCode(),
                        item.getName(),
                        item.getColor(),
                        item.getDescription(),
                        company
                )
        );

        if(item.getColumns() != null || !item.getColumns().isEmpty()) {
            for (int i = 0; i < item.getColumns().size(); i++) {
                ItemColumn itemColumn = itemColumnRepository.save(
                        new ItemColumn(
                                item.getColumns().get(i).getName(),
                                resultItem,
                                item.getColumns().get(i).getValue(),
                                item.getColumns().get(i).getColor(),
                                item.getColumns().get(i).getWidth()
                        )
                );
                resultItem.getColumns().add(itemColumn);
            }
        }

        company.getItems().add(resultItem);

        return ResponseEntity.ok().body(resultItem);
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
