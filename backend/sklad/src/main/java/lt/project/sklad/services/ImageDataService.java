package lt.project.sklad.services;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.dto_response.ErrorResponse;
import lt.project.sklad._security.dto_response.MsgResponse;
import lt.project.sklad.entities.ImageData;
import lt.project.sklad.model.BriefErrorResponse;
import lt.project.sklad.model.BriefMsgResponse;
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

            if (existingImageData.isPresent()) {
                filename = ImageUtils.incrementFileName(
                        file.getOriginalFilename(),
                        (x) -> imageDataRepository.findByName(x).isPresent()
                );
            } else {
                filename = file.getOriginalFilename();
            }

            ImageData imageData = imageDataRepository.save(ImageData.builder()
                    .name(filename)
                    .type(file.getContentType())
                    .imageData(ImageUtils.compressImage(file.getBytes())).build());

            if (imageData != null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new BriefMsgResponse("File uploaded successfully", filename));
            }
            final HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status)
                    .body(new ErrorResponse(status.value(), "Failed to save the file"));

        } catch (Exception e) {
            final HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status)
                    .body(new BriefErrorResponse(
                            status.value(),
                            "Error during file upload",
                            e.getMessage()
                    ));
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
        final HttpStatus status = HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status)
                .body(new BriefErrorResponse(
                        status.value(),
                        "Image not found",
                        fileName
                ));
    }

    @Transactional
    public ResponseEntity<?> removeImage(final String fileName) {
        Optional<ImageData> optionalDbImageData = imageDataRepository.findByName(fileName);

        if (optionalDbImageData.isPresent()) {
            imageDataRepository.delete(optionalDbImageData.get());

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new MsgResponse("Removed successfully"));
        }
        final HttpStatus status = HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status)
                .body(new ErrorResponse(
                        status.value(),
                        "Image not found"
                ));
    }
}