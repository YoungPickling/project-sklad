package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Item;
import lt.project.sklad.entities.ItemGroup;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.ItemGroupRepository;
import lt.project.sklad.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
public class ItemGroupService {
    private ItemGroupRepository itemGroupRepository;
    private ItemRepository itemRepository;
    private CompanyRepository companyRepository;
    private TokenService tokenService;
    private MessagingUtils msgUtils;

    @Autowired
    public ItemGroupService(
            ItemGroupRepository itemGroupRepository,
            ItemRepository itemRepository,
            CompanyRepository companyRepository,
            TokenService tokenService,
            MessagingUtils msgUtils
    ) {
        this.itemGroupRepository = itemGroupRepository;
        this.itemRepository = itemRepository;
        this.companyRepository = companyRepository;
        this.tokenService = tokenService;
        this.msgUtils = msgUtils;
    }

    @Transactional
    public ResponseEntity<?> createGroup(
            final Long companyId,
            final ItemGroup itemGroup,
            final HttpServletRequest request
    ) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
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

        ItemGroup result = itemGroupRepository.save(new ItemGroup(itemGroup.getName(),company));

        company.getItemGroups().add(result);

        return ResponseEntity.ok().body(result);
    }

    @Transactional
    public ResponseEntity<?> updateGroup(
            final long companyId,
            final ItemGroup itemGroup,
            final HttpServletRequest request
    ) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
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

        ItemGroup existingItemGroup = itemGroupRepository.findById(itemGroup.getId()).orElse(null);

        if(existingItemGroup == null || existingItemGroup.getOwnedByCompany().getId() != companyId)
            return msgUtils.error(FORBIDDEN, "Access denied");

        existingItemGroup.setName(itemGroup.getName());

        itemGroupRepository.save(existingItemGroup);

        return ResponseEntity.ok().body(existingItemGroup);
    }

    @Transactional
    public ResponseEntity<?> deleteGroup(
            final long companyId,
            final List<Long> groups,
            final HttpServletRequest request
    ) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isNotBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(companyId, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        List<ItemGroup> foundItemGroups = itemGroupRepository.findAllById(groups);

        if (foundItemGroups == null || foundItemGroups.isEmpty())
            return msgUtils.error(NOT_FOUND, "Groups not found");

        boolean wrongCompany = foundItemGroups.stream().anyMatch(
                x -> x.getOwnedByCompany().getId() != companyId);

        if (wrongCompany)
            return msgUtils.error(NOT_FOUND, "Alien group in the list");

        // Removing groups
        company.getItemGroups().removeAll(foundItemGroups);

        List<ItemGroup> postDeleteItemGroups = itemGroupRepository.findAllById(groups);
        if (!postDeleteItemGroups.isEmpty()) {
            System.err.println("Groups not deleted: " + postDeleteItemGroups.stream().map(ItemGroup::getId).toList()); // .collect(Collectors.toList())
            return msgUtils.error(INTERNAL_SERVER_ERROR, "Failed to delete some of the groups");
        }

        List<Item> itemsInvolved = itemRepository.findAllByItemGroupsId(companyId, groups);

        if(!itemsInvolved.isEmpty()) {
            for (Item x : itemsInvolved) {
                x.setItemGroups(x.getItemGroups().stream().filter(y -> !groups.contains(y)).toList());
            }
        }

        itemRepository.saveAll(itemsInvolved);

        return ResponseEntity.ok().body(groups);
    }
}
