package lt.project.sklad.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.repositories.UserRepository;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Image;
import lt.project.sklad.repositories.CompanyRepository;
import lt.project.sklad.repositories.ImageRepository;
import lt.project.sklad.utils.HashUtils;
import lt.project.sklad.utils.ImageUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static org.springframework.http.HttpStatus.*;

@Service
public class ImageService {
    @Autowired private ImageRepository imageRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private TokenService tokenService;
    @Autowired private MessagingUtils msgUtils;
    @Autowired private ImageUtils imgUtils;
    @Autowired private HashUtils hashUtils;

    Logger logger = LoggerFactory.getLogger(ImageService.class);

    @Transactional
    public ResponseEntity<?> uploadImage(
            final Long companyId,
            final MultipartFile file,
            final HttpServletRequest request
    ) {
        if (companyId == null)
            return ResponseEntity.badRequest().body("Company ID cannot be null");

        if (file == null || file.isEmpty())
            return msgUtils.error(HttpStatus.BAD_REQUEST, "File is empty");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        final String jwt = authHeader.substring(7);
        final Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        Company company = companyRepository.findByIdAndUserId(companyId, token.getUser().getId()).orElse(null);

        if (company == null)
            return ResponseEntity.notFound().build();

        String hash = hashUtils.hashString(file.getOriginalFilename());
        int i = 0;

        if(hash == null)
            return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to hash file name");

        while(imageRepository.findByHash(hash).isPresent()) {
            hash = hashUtils.hashString(file.getOriginalFilename() + i);
            i++;
        }

        try {
            Optional<Image> existingImageData = imageRepository.findByNameAndOwnedByCompany(file.getOriginalFilename(), company);
            String filename;

            if (existingImageData.isPresent())
                // continue incrementing file name while new name is not occupied in database company
                filename = imgUtils.incrementFileName(
                        file.getOriginalFilename(),
                        (x) -> imageRepository.findByNameAndOwnedByCompany(x, company).isPresent()
                );
            else
                filename = file.getOriginalFilename();

            final byte[] compressedImage = imgUtils.compressImage(file.getBytes());

            Image image = imageRepository.save(Image.builder()
                    .name(filename)
                    .hash(hash)
                    .type(file.getContentType())
                    .size(file.getSize())
                    .imageData(compressedImage)
                    .compressedSize(compressedImage.length)
                    .ownedByCompany(company)
                    .build());

            if (image == null)
                return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save the file");

            List<Image> imageData = company.getImageData();

            if(imageData == null) {
                company.setImageData(List.of(image));
            } else {
                imageData.add(image);
                company.setImageData(imageData);
            }

            Map<String, String> response = new HashMap<>();
            response.put("msg", "Upload successful");
            response.put("name", filename);
            response.put("hash", hash);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error during file upload", e.getMessage());
        }
    }

    public ResponseEntity<?> downloadImage(
            final String fileHash,
            final HttpServletRequest request
    ) {
        Image image = imageRepository.findByHash(fileHash).orElse(null);

        if (image == null)
            return msgUtils.error(NOT_FOUND, "Image not found");

//        Company company = image.getOwnedByCompany();
//
//        if (company != null) {
//            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//
//            if (msgUtils.isBearer(authHeader))
//                return msgUtils.error(UNAUTHORIZED, "Bad credentials");
//
//            String jwt = authHeader.substring(7);
//            Token token = tokenService.findByToken(jwt).orElse(null);
//
//            if (token == null)
//                return msgUtils.error(UNAUTHORIZED, "Token not found");
//
//            final User user = userRepository.findById(token.getUser().getId()).orElse(null);
//
//            if (user == null) {
//                return msgUtils.error(NOT_FOUND, "User not found");
//            }
//
//            if ( user.getCompany().stream().noneMatch(c -> c.getId().equals( company.getId() )) )
//                return msgUtils.error(UNAUTHORIZED, "Access denied");
//        }

        byte[] result = imgUtils.decompressImage(image.getImageData());
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf(image.getType()))
                .body(result);
    }

    @Transactional
    public ResponseEntity<?> removeImage(
            final String linkHash,
            final HttpServletRequest request
    ) {
        if (linkHash == null)
            return ResponseEntity.badRequest().build();

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (msgUtils.isBearer(authHeader))
            return msgUtils.error(UNAUTHORIZED, "Bad credentials");

        String jwt = authHeader.substring(7);
        Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            return msgUtils.error(UNAUTHORIZED, "Token not found");

        User user = userRepository.findById(token.getUser().getId()).orElse(null);

        if (user == null)
            return msgUtils.error(UNAUTHORIZED, "User not found");

        Image image = imageRepository.findByHash(linkHash).orElse(null);

        if(image == null)
            return msgUtils.error(NOT_FOUND, "Image not found");

        if(!user.getCompany().contains(image.getOwnedByCompany()))
            return msgUtils.error(FORBIDDEN, "Access denied");

        Company company = companyRepository.findById(image.getOwnedByCompany().getId()).orElse(null);

        if(company == null)
            return msgUtils.error(FORBIDDEN, "Company not found");

        company.getImageData().remove(image);
        imageRepository.delete(image);
        return msgUtils.msg("Removed successfully");
    }

//  TODO update image service

}