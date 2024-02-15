package lt.project.sklad.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.dto_request.CompanyRequest;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Image;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.ImageRepository;
import lt.project.sklad.utils.HashUtils;
import lt.project.sklad.utils.ImageUtils;
import org.hibernate.Transaction;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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
    private final ImageRepository imageRepository;
    private final ImageUtils imgUtils;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final MessagingUtils msgUtils;
    private final HashUtils hashUtils;
    // TODO CompanyService methods

    @Transactional
        public ResponseEntity<?> createCompany(
            final Company company,
            final HttpServletRequest request
    ) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final User user = token.getUser();

        // Associate the company with the user
        company.setUser(Set.of(user));

        // Save the company
        final Company result = companyRepository.save(company);

        if(result == null)
            return msgUtils.error(HttpStatus.BAD_REQUEST, "Failed to save the Company");

        // Save the user
        final User savedUser = userRepository.save(user);

        if(savedUser == null)
            return msgUtils.error(HttpStatus.BAD_REQUEST, "Failed to save the User");

        return ResponseEntity.ok().body(result);
    }

    @Transactional // solves Lob errors: "Large Objects may not be used in auto-commit mode."
    public ResponseEntity<?> getCompanyById(
            final Long id,
            final HttpServletRequest request
    ) {
        if (id == null)
            return ResponseEntity.badRequest().body("Company ID cannot be null");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        final Company company = companyRepository.findByIdAndUserId(id, token.getUser().getId()).orElse(null);

        if(company == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok().body(company);
    }

    @Transactional
    public ResponseEntity<?> updateCompany(
            final Long id,
            final CompanyRequest updatedCompany,
            final HttpServletRequest request
    ) {
        if (id == null)
            return ResponseEntity.badRequest().body("Company ID cannot be null");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(id, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        // Update company fields with the new values
        if (updatedCompany.getName() != null && !updatedCompany.getName().isBlank())
            company.setName(updatedCompany.getName());

        if (updatedCompany.getDescription() != null && !updatedCompany.getDescription().isBlank())
            company.setDescription(updatedCompany.getDescription());
        // Update other fields as needed...

        // Save the updated company
        Company updatedCompanyResult = companyRepository.save(company);
        if (updatedCompanyResult == null)
            return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update the Company");

        return ResponseEntity.ok().body(updatedCompanyResult);
    }

    @Transactional
    public ResponseEntity<?> updateCompanyImage(
            final Long companyId,
            final MultipartFile file,
            final HttpServletRequest request
    ) {
        if (companyId == null)
            return ResponseEntity.badRequest().body("Company ID cannot be null");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        if (file == null || file.isEmpty())
            return msgUtils.error(HttpStatus.BAD_REQUEST, "File is empty");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(companyId, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        final String hash = hashUtils.hashString(file.getOriginalFilename());

        try {
            byte[] compressedImage = imgUtils.compressImage(file.getBytes());

            if(company.getImage() == null) {
                Image image = imageRepository.save(Image.builder()
                        .name(file.getOriginalFilename())
                        .hash(hash)
                        .type(file.getContentType())
                        .size(file.getSize())
                        .imageData(compressedImage)
                        .compressedSize(compressedImage.length)
                        .build());

                if (image == null)
                    return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save the image");

                company.setImage(image);

                Map<String, String> responseMap = new HashMap<>();
                responseMap.put("msg", "Upload successful");
                responseMap.put("name", file.getOriginalFilename());
                responseMap.put("hash", hash);
                return ResponseEntity.ok().body(responseMap);

            } else {
                Optional<Image> imageOptional = imageRepository.findById(company.getImage().getId());

                if (imageOptional.isEmpty())
                    return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to load existing image");

                Image image = imageOptional.get();

                image.setName(file.getOriginalFilename());
                image.setHash(hash);
                image.setType(file.getContentType());
                image.setSize(file.getSize());
                image.setImageData(compressedImage);
                image.setCompressedSize(compressedImage.length);

                Map<String, String> responseMap = new HashMap<>();
                responseMap.put("msg", "Update successful");
                responseMap.put("name", file.getOriginalFilename());
                responseMap.put("hash", hash);
                return ResponseEntity.ok().body(responseMap);
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ResponseEntity<?> deleteCompanyImage(
            final Long id,
            final HttpServletRequest request
    ) {
        if (id == null)
            return ResponseEntity.badRequest().body("Company ID cannot be null");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(id, token.getUser().getId()).orElse(null);

        if (company == null)
            return msgUtils.error(INTERNAL_SERVER_ERROR, "Company not found");

        if (company.getImage() == null)
            return msgUtils.error(INTERNAL_SERVER_ERROR, "Image is empty");

        Image image = company.getImage();

        company.setImage(null);
        image.setOwnedByCompany(null);
        companyRepository.save(company);

        return ResponseEntity.ok().build();
    }

    @Transactional
    public ResponseEntity<?> deleteCompany(
            final Long id,
            final HttpServletRequest request
    ) {
        if (id == null)
            return ResponseEntity.badRequest().body("Company ID cannot be null");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(id, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        companyRepository.delete(company);

        return ResponseEntity.ok().build();
    }
}
