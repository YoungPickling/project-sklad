package lt.project.sklad.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Image;
import lt.project.sklad.repositories.ImageRepository;
import lt.project.sklad.utils.HashUtils;
import lt.project.sklad.utils.ImageUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository imageRepository;
    private final MessagingUtils msgUtils;
    private final ImageUtils imgUtils;
    private final HashUtils hashUtils;

    @Transactional
    public ResponseEntity<?> uploadImage(final MultipartFile file) {
        try {
            if (file.isEmpty())
                return msgUtils.error(HttpStatus.BAD_REQUEST, "Uploaded file is empty");

            // Check if an ImageData with the same name already exists
            Optional<Image> existingImageData = imageRepository.findByName(file.getOriginalFilename());
            String filename;

            if (existingImageData.isPresent())
                filename = imgUtils.incrementFileName(
                        file.getOriginalFilename(),
                        (x) -> imageRepository.findByName(x).isPresent() // continue incrementing file name while new name is not occupied
                );
            else
                filename = file.getOriginalFilename();

            byte[] compressedImage = imgUtils.compressImage(file.getBytes());
            final String hash = hashUtils.hashString(filename);

            if(hash == null)
                return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to hash file name");

            Image image = imageRepository.save(Image.builder()
                    .name(filename)
                    .hash(hash)
                    .type(file.getContentType())
                    .size(file.getSize())
                    .imageData(compressedImage)
                    .compressedSize(compressedImage.length)
                    .build());

            if (image == null)
                return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save the file");

            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("msg", "Upload successful");
            responseMap.put("name", filename);
            responseMap.put("hash", hash);
            return ResponseEntity.ok().body(responseMap);
        } catch (Exception e) {
            return msgUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error during file upload", e.getMessage());
        }
    }

    public ResponseEntity<?> downloadImage(final String fileHash) {
        Optional<Image> optionalImageData = imageRepository.findByHash(fileHash);

        if (optionalImageData.isPresent()) {
            final Image dbImage = optionalImageData.get();
            byte[] result = imgUtils.decompressImage(dbImage.getImageData());
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(dbImage.getType()))
                    .body(result);
        }
        return msgUtils.error(HttpStatus.NOT_FOUND, "Image not found");
    }

    public ResponseEntity<?> removeImage(final String fileHash) {
        Image image = imageRepository.findByHash(fileHash).orElse(null);

        if (image != null) {
            image.setOwnedByCompany(null);
            imageRepository.delete(image);
            return msgUtils.msg("Removed successfully");
        }
        return msgUtils.error(HttpStatus.NOT_FOUND, "Image not found");
    }

//  TODO update image service

}