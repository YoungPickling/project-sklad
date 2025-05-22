package lt.project.sklad.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lt.project.sklad.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/rest/v1/secret/image")
public class ImageController {
    private ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/{companyId}")
    public ResponseEntity<?> uploadImage(
            @PathVariable @NotNull long companyId,
            @RequestParam("image") MultipartFile file,
            HttpServletRequest request
    ) throws IOException {
        return imageService.uploadImage(companyId, file, request);
    }

    @GetMapping("/{fileHash}")
    public ResponseEntity<?> downloadImage(
            @PathVariable String fileHash,
            HttpServletRequest request
    ) {
        return imageService.downloadImage(fileHash, request);
    }

//     For tech demo, has no authentication
//    @GetMapping("/demo/{fileHash}")
//    public ResponseEntity<?> demoGetImage(@PathVariable String fileHash){
//        // TODO create an ImageData service method for tech demos
//        return imageService.downloadImage(fileHash);
//    }

    @DeleteMapping("/{fileHash}")
    public ResponseEntity<?> removeImage(
            @PathVariable @NotNull String fileHash,
            HttpServletRequest request
    ) {
        return imageService.removeImage(fileHash, request);
    }
}
