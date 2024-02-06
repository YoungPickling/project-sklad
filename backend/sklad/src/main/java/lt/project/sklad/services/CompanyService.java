package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.utils.UserUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

import static org.springframework.http.HttpStatus.*;

/**
 * {@link Company} service
 * @since 1.0, 29 Jan 2024
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final HttpResponseService responseService;
    // TODO CompanyService methods

    @Transactional
    public ResponseEntity<?> createCompany(
            final Company company,
            final HttpServletRequest request
    ) {
//        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//
//        if (MessagingUtils.isBearer(authHeader))
//            return MessagingUtils.error(UNAUTHORIZED,"Bad credentials");
//
//        final String jwt = authHeader.substring(7);
//        final Token token = tokenService.findByToken(jwt).orElse(null);
//
//        if (token == null)
//            return MessagingUtils.error(UNAUTHORIZED,"Token not found");
//
//        final Long userId = token.getUser().getId();
        User user;

        try {
            user = UserUtils.getGuthenticatedId(tokenService, request);
        } catch (NullPointerException e) {
            if (e.getMessage().equals("1"))
                return MessagingUtils.error(UNAUTHORIZED,"Bad credentials");
            else if (e.getMessage().equals("2"))
                return MessagingUtils.error(UNAUTHORIZED,"Token not found");
            else
                return MessagingUtils.error(INTERNAL_SERVER_ERROR,"Something went wrong");
        }

        final Company result = companyRepository.save(
                Company.builder()
                        .name(company.getName())
                        .description(company.getDescription())
                        .user(Set.of(user))
                        .build()
        );

        if(result == null)
            return MessagingUtils.error(HttpStatus.BAD_REQUEST, "Failed to save the Company");

        return ResponseEntity.ok().body(result);
    }

    @Transactional
    public ResponseEntity<?> getCompanyById(
            final Long id,
            final HttpServletRequest request
    ) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (MessagingUtils.isBearer(authHeader))
            return MessagingUtils.error(UNAUTHORIZED,"Bad credentials");

        final String jwt = authHeader.substring(7);
        final Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return MessagingUtils.error(UNAUTHORIZED,"Token not found");

        final Long userId = token.getUser().getId();

        if (id == null)
            return ResponseEntity.badRequest().body("ID cannot be null");

        Company company = companyRepository.findById(id).orElse(null);

        if(company == null)
            return MessagingUtils.error(HttpStatus.BAD_REQUEST, "Failed to save the Company");

        return ResponseEntity.ok().body(null);
    }
}
