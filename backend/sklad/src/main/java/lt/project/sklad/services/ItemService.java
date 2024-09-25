package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.dto_request.AssemleDTO;
import lt.project.sklad.entities.*;
import lt.project.sklad.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

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
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final MessagingUtils msgUtils;
    private final ImageRepository imageRepository;
    private final SupplierRepository supplierRepository;
    private final LocationRepository locationRepository;

    private static Logger logger = LoggerFactory.getLogger(ItemService.class);

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

        if (!company.getUser().contains(token.getUser()))
            return msgUtils.error(FORBIDDEN, "Access denied");

        Image image = null;

        if (item.getImage() != null) {
            Image tempImage = imageRepository.findByHash(item.getImage().getHash()).orElse(null);

            if(tempImage != null && company.getId() == tempImage.getOwnedByCompany().getId()) {
                image = tempImage;
            }
        }

        // Inserting new item

        Item resultItem = itemRepository.save(
                new Item(
                        item.getCode(),
                        item.getName(),
                        image,
                        item.getColor(),
                        item.getDescription(),
                        company
                )
        );

        if (item.getColumns() != null || !item.getColumns().isEmpty()) {
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
        if (itemId == null)
            return ResponseEntity.badRequest().body("Item ID cannot be null");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final Item item = itemRepository.findById(itemId).orElse(null);

        if (item == null)
            return msgUtils.error(NOT_FOUND, "Item not found");

        final User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null)
            return msgUtils.error(NOT_FOUND, "User not found");

        for (Company c: user.getCompany()) {
            if (c.getName().equals( item.getCompany().getName() ))
                return ResponseEntity.ok().body(item);
        }

        return msgUtils.error(NOT_FOUND, "You don't have access to the company");
    }

    @Transactional
    public ResponseEntity<?> updateItem(
            final Long itemId,
            final Item item,
            final HttpServletRequest request
    ) {
        if (itemId == null)
            return ResponseEntity.badRequest().body("Item ID cannot be null");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null) {
            return msgUtils.error(NOT_FOUND, "User not found");
        }

        final Item itemOld = itemRepository.findById(itemId).orElse(null);

        if (itemOld == null)
            return msgUtils.error(NOT_FOUND, "Item not found");

        if (itemOld.getId() != item.getId())
            return msgUtils.error(BAD_REQUEST, "IDs don't match");


        boolean hasAccess = user.getCompany().stream()
                .anyMatch(company -> company.getName().equals(itemOld.getCompany().getName()));

        if (!hasAccess) {
            return msgUtils.error(FORBIDDEN, "You don't have access to the company");
        }

        // Validating Image
        if (item.getImage() != null) {
            Image existingImage = imageRepository.findById(item.getImage().getId()).orElse(null);
            // set new image if it exists in a gallery and owned by a company
            if (existingImage != null &&
                    user.getCompany().stream()
                            .anyMatch(company -> company.getId().equals(existingImage.getOwnedByCompany().getId()))) {
                itemOld.setImage(existingImage);
            } else {
                return msgUtils.error(BAD_REQUEST, "Image not found or not authorized");
            }
        } else {
            // delete image if not provided
            itemOld.setImage(null);
        }

        // clear duplicate columns in both items
        deleteDuplicateColumns(item);
        deleteDuplicateColumns(itemOld);

//        List<Long> columns = new ArrayList<>();
//        for(ItemColumn oldColumn : itemOld.getColumns()) {
        Iterator<ItemColumn> oldColumnIterator = itemOld.getColumns().iterator();

        while (oldColumnIterator.hasNext()) {
            ItemColumn oldColumn = oldColumnIterator.next();
            boolean contains = false;
            for(ItemColumn newColumn : item.getColumns()) {
                if (newColumn.getName().equals(oldColumn.getName())) {
                    contains = true;
                    break;
                }
            }
            oldColumnIterator.remove();
        }

        if (itemOld == null)
            return msgUtils.error(NOT_FOUND, "Error in updating items");

        // Validating custom columns
        if (item.getColumns() != null) {
            if (itemOld.getColumns() == null) {
                for (int i = 0; i < item.getColumns().size(); i++) {
                    ItemColumn itemColumn = itemColumnRepository.save(
                            new ItemColumn(
                                    item.getColumns().get(i).getName(),
                                    itemOld,
                                    item.getColumns().get(i).getValue(),
                                    item.getColumns().get(i).getColor(),
                                    item.getColumns().get(i).getWidth()
                            )
                    );
                    itemOld.getColumns().add(itemColumn);
                }
            } else {
                for (ItemColumn newItemColumn : item.getColumns()) {
                    boolean isUpdated = false;
                    Iterator<ItemColumn> existingIterator = itemOld.getColumns().iterator();

                    while (existingIterator.hasNext()) {
                        ItemColumn existingColumn = existingIterator.next();
                        if (existingColumn.getName().equals(newItemColumn.getName())) {
                            if (!newItemColumn.getValue().isBlank()) {
                                existingColumn.setValue(newItemColumn.getValue());
                                existingColumn.setColor(newItemColumn.getColor());
                                existingColumn.setWidth(newItemColumn.getWidth());
                            } else {
                                existingIterator.remove();
                                logger.info("Removed - " + existingColumn.getName());
                            }
                            isUpdated = true;
                            break;
                        }
                    }
                    if (!isUpdated) {
                        ItemColumn savedColumn = itemColumnRepository.save(
                                new ItemColumn(
                                        newItemColumn.getName(),
                                        itemOld,
                                        newItemColumn.getValue(),
                                        newItemColumn.getColor(),
                                        newItemColumn.getWidth()
                                )
                        );
                        itemOld.getColumns().add(savedColumn);
                    }
                }
            }
        } else {
            itemOld.getColumns().clear();
        }

        itemOld.setCode(item.getCode());
        itemOld.setName(item.getName());
        itemOld.setDescription(item.getDescription());

        itemRepository.save(itemOld);

        return ResponseEntity.ok().body(itemOld);
    }

    @Transactional
    public ResponseEntity<?> deleteItem(
            final List<Long> items,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null) {
            return msgUtils.error(NOT_FOUND, "User not found");
        }

        List<Item> foundItems = itemRepository.findAllById(items);

        if (foundItems == null || foundItems.isEmpty())
            return msgUtils.error(NOT_FOUND, "Items not found");

        boolean hasAccess = user.getCompany().stream()
                .anyMatch(userCompany ->
                        foundItems.stream()
                                .anyMatch(item -> item.getCompany().getId().equals(userCompany.getId()))
                );

        if (!hasAccess) {
            return msgUtils.error(FORBIDDEN, "You don't have access to a company or one of the items");
        }

        HashSet<Long> companyIds = new HashSet<>();

        for (Item item : foundItems) {
            companyIds.add(item.getCompany().getId());
        }

        List<Company> companies = companyRepository.findAllById(companyIds);

        // Remove items from the companies' item lists
        for (Item item : foundItems) {
            Company company = item.getCompany();
            company.getItems().remove(item);
        }

        itemRepository.deleteAll(foundItems);

        List<Item> postDeleteItems = itemRepository.findAllById(items);
        if (!postDeleteItems.isEmpty()) {
            System.err.println("Items not deleted: " + postDeleteItems.stream().map(Item::getId).collect(Collectors.toList()));
            return msgUtils.error(INTERNAL_SERVER_ERROR, "Failed to delete some items");
        }

        return ResponseEntity.ok().body(items);
    }

    @Transactional
    public ResponseEntity<?> addItemSupplier(
        final Long itemId,
        final List<Long> suppliers,
        final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null) {
            return msgUtils.error(NOT_FOUND, "User not found");
        }

        Item item = itemRepository.findById(itemId).orElse(null);

        if (item == null )
            return msgUtils.error(NOT_FOUND, "Items not found");

        if (user.getCompany().stream().noneMatch(c -> c.getId().equals(item.getCompany().getId()))) {
            return msgUtils.error(FORBIDDEN, "Access to the item denied");
        }

        if(suppliers != null && !suppliers.isEmpty()) {
            List<Supplier> foundsuppliers = supplierRepository.findAllById(suppliers);

            if (foundsuppliers.isEmpty())
                return msgUtils.error(NOT_FOUND, "Suppliers not found");

            boolean hasAccess = foundsuppliers.stream().anyMatch(
                    s -> s.getOwner().getId().equals(item.getCompany().getId())
            );

            if (!hasAccess)
                return msgUtils.error(FORBIDDEN, "Access to the suppliers denied");

            item.setSuppliers(foundsuppliers);
            return ResponseEntity.ok().body(foundsuppliers);
        }

        item.setSuppliers(null);

        return ResponseEntity.ok().build();
    }

    @Transactional
    public ResponseEntity<?> putItemLocation(
            final long itemId,
            final long locationId,
            final String quantity,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null) {
            return msgUtils.error(NOT_FOUND, "User not found");
        }

        Item item = itemRepository.findById(itemId).orElse(null);

        if (item == null )
            return msgUtils.error(NOT_FOUND, "Items not found");

        if (user.getCompany().stream().noneMatch(c -> c.getId().equals(item.getCompany().getId()))) {
            return msgUtils.error(FORBIDDEN, "Access to the item denied");
        }

        Location location = locationRepository.findById(locationId).orElse(null);

        if (location == null )
            return msgUtils.error(NOT_FOUND, "Location not found");

        if (user.getCompany().stream().noneMatch(c -> c.getId().equals(location.getOwner().getId()))) {
            return msgUtils.error(FORBIDDEN, "Access to the location denied");
        }

        Long quantityNumber;
        try {
            quantityNumber = Long.parseLong(quantity);
        } catch (NumberFormatException e) {
            item.getQuantity().remove(location.getId());
            return ResponseEntity.ok().body(quantity);
        }

        if(quantityNumber < 0) {
            item.getQuantity().remove(location.getId());
        } else {
            item.getQuantity().put(location.getId(), quantityNumber);
        }

        itemRepository.save(item);

        return ResponseEntity.ok().body(quantity);
    }

    @Transactional
    public ResponseEntity<?> putItemParents(
            final Long itemId,
            final Map<Long,Long> parents,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null) {
            return msgUtils.error(NOT_FOUND, "User not found");
        }

        Item item = itemRepository.findById(itemId).orElse(null);

        if (item == null )
            return msgUtils.error(NOT_FOUND, "Items not found");

        if (user.getCompany().stream().noneMatch(c -> c.getId().equals(item.getCompany().getId())))
            return msgUtils.error(FORBIDDEN, "Access to the item denied");

        List<Item> toEdit = itemRepository.findAllById(parents.keySet());

        if(parents.isEmpty()) {
            item.setParents(new HashMap<>());
            itemRepository.save(item);
            return ResponseEntity.ok().body(parents);
        } else if(toEdit.stream().anyMatch(x -> !x.getCompany().getId().equals(item.getCompany().getId())) ) {
            return msgUtils.error(FORBIDDEN, "Items must be from the same company");
        }

        item.setParents(parents);
        itemRepository.save(item);
        return ResponseEntity.ok().body(parents);
    }

    private void deleteDuplicateColumns(final Item item) {
        Iterator<ItemColumn> iterator = item.getColumns().iterator();
        List<String> names = new ArrayList<>();

        while (iterator.hasNext()) {
            ItemColumn existingColumn = iterator.next();
            if (names.contains(existingColumn.getName()) || existingColumn.getValue().isBlank()) {
                iterator.remove();
            } else {
                names.add(existingColumn.getName());
            }
        }
    }

    @Transactional
    public ResponseEntity<?> assembleItem(
            final Long itemId,
            final AssemleDTO body,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null) {
            return msgUtils.error(NOT_FOUND, "User not found");
        }

        Item item = itemRepository.findById(itemId).orElse(null);

        if (item == null)
            return msgUtils.error(NOT_FOUND, "Items not found");

        if (user.getCompany().stream().noneMatch(c -> c.getId().equals(item.getCompany().getId())))
            return msgUtils.error(FORBIDDEN, "Access to the item denied");

        item.getQuantity().put(
                body.getLocationId(),
                item.getQuantity().getOrDefault(body.getLocationId(), 0L) + body.getAdd() + body.getBuild()
        );

        if(body.getBuild() != 0L) {
            List<Item> parentItems = itemRepository.findAllById(item.getParents().keySet());
            for (Item x : parentItems) {
                x.getQuantity().put(
                        body.getLocationId(),
                        x.getQuantity().getOrDefault(body.getLocationId(), 0L) -
                                item.getParents().get(x.getId()) *
                                        body.getBuild()
                );
            }
            parentItems.add(item);
            itemRepository.saveAll(parentItems);
        } else {
            itemRepository.save(item);
        }

        return ResponseEntity.ok().body(body);
    }
}