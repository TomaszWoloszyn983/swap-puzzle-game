package com.tomasz.puzzlegame_backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

//    public String uploadImage(File file) throws IOException {
//
//        Map uploadResult = cloudinary.uploader().upload(
//                file,
//                ObjectUtils.asMap(
//                        "folder",
//                        "swap_puzzle",
//                        "public_id",
//                        UUID.randomUUID().toString()
//                )
//        );
//        return uploadResult.get("secure_url").toString();
//    }
    public String uploadImage(File file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file,
                    ObjectUtils.emptyMap()
            );
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed", e);
        }
    }
}
