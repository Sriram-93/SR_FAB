package com.srfab.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {
    
    // In production, use external storage or configured path
    private final String UPLOAD_DIR = "uploads/";

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }
        
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        // Keep original name if possible to match legacy, but ideally UUID
        // Legacy used submittedFileName directly.
        // We'll try to use original to minimize breakage if data relies on it, 
        // but robust systems use UUID.
        // I'll stick to original for now to match legacy behavior described in analysis.
        String fileName = originalFilename; 
        
        // Prevent path traversal
        if (fileName.contains("..")) {
            throw new IOException("Invalid filename");
        }
        
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.write(path, file.getBytes());
        return fileName;
    }
}
