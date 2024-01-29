package lt.project.sklad.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.dto_response.ErrorResponse;
import lt.project.sklad._security.dto_response.MsgResponse;
import lt.project.sklad._security.services.HttpResponseService;
import lt.project.sklad.entities.ImageData;
import lt.project.sklad._security.dto_response.BriefErrorResponse;
import lt.project.sklad._security.dto_response.BriefMsgResponse;
import lt.project.sklad.repositories.ImageDataRepository;
import lt.project.sklad.utils.ImageUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageDataService {
    private final ImageDataRepository imageDataRepository;
    private final HttpResponseService responseService;

    @Transactional
    public ResponseEntity<?> uploadImage(final MultipartFile file) {
        try {
            if (file.isEmpty()) {
                final HttpStatus status = HttpStatus.BAD_REQUEST;
                return ResponseEntity.status(status)
                        .body(new ErrorResponse(status.value(), "Uploaded file is empty"));
            }

            // Check if an ImageData with the same name already exists
            Optional<ImageData> existingImageData = imageDataRepository.findByName(file.getOriginalFilename());
            String filename;

            if (existingImageData.isPresent())
                filename = ImageUtils.incrementFileName(
                        file.getOriginalFilename(),
                        (x) -> imageDataRepository.findByName(x).isPresent() // continue incrementing file name while new name is not occupied
                );
            else
                filename = file.getOriginalFilename();

            byte[] compressedImage = ImageUtils.compressImage(file.getBytes());

            ImageData imageData = imageDataRepository.save(ImageData.builder()
                    .name(filename)
                    .type(file.getContentType())
                    .size(file.getSize())
                    .imageData(compressedImage)
                    .compressedSize(compressedImage.length)
                    .build());

            if (imageData != null)
                return responseService.msg("Error during file upload", filename);

            return responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save the file");

        } catch (Exception e) {
            return responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, "Error during file upload", e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<?> downloadImage(final String fileName) {
        Optional<ImageData> optionalDbImageData = imageDataRepository.findByName(fileName);

        if (optionalDbImageData.isPresent()) {
            final ImageData dbImageData = optionalDbImageData.get();
            byte[] result = ImageUtils.decompressImage(dbImageData.getImageData());
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(dbImageData.getType()))
                    .body(result);
        }
        return responseService.error(HttpStatus.NOT_FOUND, "Image not found");
    }

    @Transactional
    public ResponseEntity<?> removeImage(final String fileName) {
        Optional<ImageData> optionalDbImageData = imageDataRepository.findByName(fileName);

        if (optionalDbImageData.isPresent()) {
            imageDataRepository.delete(optionalDbImageData.get());
            return responseService.msg("Removed successfully");
        }
        return responseService.error(HttpStatus.NOT_FOUND, "Image not found");
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