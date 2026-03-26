package com.srfab.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Upload an image to Cloudinary.
     * @param file the image file
     * @param folder subfolder under sr-fab/ (e.g. "products", "categories")
     * @return the secure URL of the uploaded image
     */
    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file, String folder) {
        try {
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "sr-fab/" + folder,
                    "resource_type", "image"
                ));
            String url = (String) result.get("secure_url");
            log.info("Image uploaded to Cloudinary: {}", url);
            return url;
        } catch (IOException e) {
            log.error("Cloudinary upload failed: {}", e.getMessage());
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    /**
     * Delete an image from Cloudinary by its public ID.
     */
    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted from Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("Cloudinary delete failed: {}", e.getMessage());
        }
    }

    /**
     * Upload a generated 3D model to Cloudinary as a raw asset.
     * Supports remote URL and base64 data URI inputs.
     */
    public String uploadGeneratedModel(String source, String folder) {
        // Use "image" resource type for GLB models to allow sizes up to 25MB and get thumbnail support
        return uploadGeneratedInternal(source, folder, "image");
    }

    /**
     * Upload a generated image to Cloudinary.
     */
    @SuppressWarnings("unchecked")
    public String uploadGeneratedImage(String source, String folder) {
        return uploadGeneratedInternal(source, folder, "image");
    }

    @SuppressWarnings("unchecked")
    private String uploadGeneratedInternal(String source, String folder, String resourceType) {
        if (source == null || source.isBlank()) {
            throw new RuntimeException("Generated source is empty");
        }

        String normalizedFolder = (folder == null || folder.isBlank())
            ? "sr-fab/generated"
            : "sr-fab/" + folder;

        try {
            Map<String, Object> result;
            if (source.startsWith("data:")) {
                byte[] bytes = decodeDataUri(source);
                result = cloudinary.uploader().upload(bytes,
                    ObjectUtils.asMap(
                        "folder", normalizedFolder,
                        "resource_type", resourceType,
                        "public_id", "gen-" + UUID.randomUUID()
                    ));
            } else {
                byte[] bytes = restTemplate.getForObject(source, byte[].class);
                if (bytes == null || bytes.length == 0) {
                    throw new RuntimeException("Failed to download generated content from source URL");
                }

                if (bytes.length > 10 * 1024 * 1024 || "image".equals(resourceType)) {
                    // Use uploadLarge for chunked upload to bypass the 10MB limit
                    java.io.InputStream inputStream = new java.io.ByteArrayInputStream(bytes);
                    result = cloudinary.uploader().uploadLarge(inputStream,
                        ObjectUtils.asMap(
                            "folder", normalizedFolder,
                            "resource_type", resourceType,
                            "public_id", "gen-" + UUID.randomUUID(),
                            "chunk_size", 6000000 // 6MB chunks
                        ));
                } else {
                    result = cloudinary.uploader().upload(bytes,
                        ObjectUtils.asMap(
                            "folder", normalizedFolder,
                            "resource_type", resourceType,
                            "public_id", "gen-" + UUID.randomUUID()
                        ));
                }
            }

            String url = (String) result.get("secure_url");
            if (url == null || url.isBlank()) {
                throw new RuntimeException("Cloudinary did not return secure_url");
            }
            log.info("Generated {} uploaded to Cloudinary: {}", resourceType, url);
            return url;
        } catch (Exception ex) {
            log.error("Cloudinary upload failed: {}", ex.getMessage());
            throw new RuntimeException("Generated content upload failed: " + ex.getMessage());
        }
    }

    private byte[] decodeDataUri(String dataUri) {
        int comma = dataUri.indexOf(',');
        if (comma < 0 || comma == dataUri.length() - 1) {
            throw new RuntimeException("Invalid data URI for generated model");
        }
        String encoded = dataUri.substring(comma + 1);
        return Base64.getDecoder().decode(encoded);
    }
}
