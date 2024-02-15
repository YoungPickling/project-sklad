package lt.project.sklad.controllers;

import lombok.RequiredArgsConstructor;
import lt.project.sklad.services.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/secret/image")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image")MultipartFile file) throws IOException {
        return imageService.uploadImage(file);
    }

    @GetMapping("/{fileHash}")
    public ResponseEntity<?> downloadImage(@PathVariable String fileHash){
        return imageService.downloadImage(fileHash);
    }

    // For tech demo, has no authentication
    @GetMapping("demo/{fileHash}")
    public ResponseEntity<?> demoGetImage(@PathVariable String fileHash){
        // TODO create an ImageData service method for tech demos
        return imageService.downloadImage(fileHash);
    }

//    TODO image put endpoint, mostly for profile pictures
//    @PutMapping
//    public ResponseEntity<?> uploadImage(@RequestParam("image")MultipartFile file, @RequestParam String id) throws IOException {
//        return imageDataService.updateImage(file, id);
//    }

    @DeleteMapping("/{fileHash}")
    public ResponseEntity<?> removeImage(@PathVariable String fileHash){
        return imageService.removeImage(fileHash);
    }
}
