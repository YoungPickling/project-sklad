package lt.project.sklad.controllers;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.dto_response.MsgResponse;
import lt.project.sklad.entities.ImageData;
import lt.project.sklad.services.ImageDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/secret/image")
@RequiredArgsConstructor
public class ImageDataController {
    private final ImageDataService imageDataService;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image")MultipartFile file) throws IOException {
        return imageDataService.uploadImage(file);
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<?> downloadImage(@PathVariable String fileName){
        return imageDataService.downloadImage(fileName);
    }

//    TODO image put mapping
//    @PutMapping
//    public ResponseEntity<?> uploadImage(@RequestParam("image")MultipartFile file, @RequestParam String id) throws IOException {
//        return imageDataService.updateImage(file, id);
//    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<?> removeImage(@PathVariable String fileName){
        return imageDataService.removeImage(fileName);
    }
}
