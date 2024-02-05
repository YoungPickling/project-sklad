package lt.project.sklad.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.dto_response.ErrorResponse;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad._security.utils.MessagingUtils;
import lt.project.sklad.entities.Image;
import lt.project.sklad.repositories.ImageRepository;
import lt.project.sklad.utils.ImageUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository imageRepository;

    @Transactional
    public ResponseEntity<?> uploadImage(final MultipartFile file) {
        try {
            if (file.isEmpty())
                return MessagingUtils.error(HttpStatus.BAD_REQUEST, "Uploaded file is empty");

            // Check if an ImageData with the same name already exists
            Optional<Image> existingImageData = imageRepository.findByName(file.getOriginalFilename());
            String filename;

            if (existingImageData.isPresent())
                filename = ImageUtils.incrementFileName(
                        file.getOriginalFilename(),
                        (x) -> imageRepository.findByName(x).isPresent() // continue incrementing file name while new name is not occupied
                );
            else
                filename = file.getOriginalFilename();

            byte[] compressedImage = ImageUtils.compressImage(file.getBytes());

            Image image = imageRepository.save(Image.builder()
                    .name(filename)
                    .type(file.getContentType())
                    .size(file.getSize())
                    .imageData(compressedImage)
                    .compressedSize(compressedImage.length)
                    .build());

            if (image != null)
                return MessagingUtils.msg("Upload successful", filename);
            else
                return MessagingUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save the file");

        } catch (Exception e) {
            return MessagingUtils.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error during file upload", e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<?> downloadImage(final String fileName) {
        Optional<Image> optionalImageData = imageRepository.findByName(fileName);

        if (optionalImageData.isPresent()) {
            final Image dbImage = optionalImageData.get();
            byte[] result = ImageUtils.decompressImage(dbImage.getImageData());
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(dbImage.getType()))
                    .body(result);
        }
        return MessagingUtils.error(HttpStatus.NOT_FOUND, "Image not found");
    }

    @Transactional
    public ResponseEntity<?> removeImage(final String fileName) {
        Optional<Image> optionalImageData = imageRepository.findByName(fileName);

        if (optionalImageData.isPresent()) {
            imageRepository.delete(optionalImageData.get());
            return MessagingUtils.msg("Removed successfully");
        }
        return MessagingUtils.error(HttpStatus.NOT_FOUND, "Image not found");
    }

//  TODO update image service

//    @Transactional
//    public ResponseEntity<?> updateImage(final MultipartFile file, final String id) {
//        try {
//            Optional<ImageData> optionalImageData = imageDataRepository.findById(Long.parseLong(id));
//
//            if (optionalImageData.isPresent()) {
//
//                Optional<ImageData> existingImageData = imageDataRepository.findByName(file.getOriginalFilename());
//                String filename;
//
//                if (existingImageData.isPresent())
//                    filename = ImageUtils.incrementFileName(
//                            file.getOriginalFilename(),
//                            (x) -> imageDataRepository.findByName(x).isPresent() // continue incrementing file name while new name is not occupied
//                    );
//                else
//                    filename = file.getOriginalFilename();
//
//
//                ImageData image = optionalImageData.get();
//                image.setName(filename);
//                image.setType(file.getContentType());
//                image.setSize(file.getSize());
//                image.setImageData(compressedImage);
//                image.setCompressedSize(compressedImage.length);
//
//            } else {
//                return responseService.error(HttpStatus.NOT_FOUND, "File not found");
//            }
//
//        } catch (NumberFormatException e) {
//            e.printStackTrace();
//            return responseService.error(HttpStatus.BAD_REQUEST, "id error");
//        }
//    }
}