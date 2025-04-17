package edu.cit.mediflow.controller;

import edu.cit.mediflow.entity.UserPatient;
import edu.cit.mediflow.service.UserPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;


import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user-patients")
public class UserPatientController {
    @Autowired
    private UserPatientService userPatientService;

    @GetMapping
    public ResponseEntity<List<UserPatient>> getAllUserPatients() {
        return ResponseEntity.ok(userPatientService.getAllUserPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserPatient> getUserPatientById(@PathVariable String id) {
        Optional<UserPatient> userPatient = userPatientService.getUserPatientById(id);
        return userPatient.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserPatient> createUserPatient(@RequestBody UserPatient userPatient) {
        return ResponseEntity.ok(userPatientService.createUserPatient(userPatient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserPatient> updateUserPatient(@PathVariable String id, @RequestBody UserPatient userPatient) {
        UserPatient updated = userPatientService.updateUserPatient(id, userPatient);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserPatient(@PathVariable String id) {
        userPatientService.deleteUserPatient(id);
        return ResponseEntity.noContent().build();
    }


@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody UserPatient credentials) {
    Optional<UserPatient> user = userPatientService.authenticate(credentials.getUsername(), credentials.getPassword());

    if (user.isPresent()) {
        return ResponseEntity.ok(user.get());
    } else {
        return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

// Removed duplicate method to resolve the compile error

@PostMapping("/upload-profile-picture")
public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
    try {
        // Save the file to a directory (e.g., "uploads/")
        String uploadDir = "uploads/";
        File uploadFile = new File(uploadDir + file.getOriginalFilename());
        file.transferTo(uploadFile);

        // Return the file path or URL
        return ResponseEntity.ok("/uploads/" + file.getName());
    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
    }
}
}

