package lt.project.sklad.utils;

import lombok.NoArgsConstructor;
import org.bouncycastle.util.Arrays;

import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@NoArgsConstructor
public class HashUtils {
    private static final byte[] SALT = {
            (byte) 0xda, (byte) 0x6e, (byte) 0xec, (byte) 0x16,
            (byte) 0x53, (byte) 0x5e, (byte) 0x97, (byte) 0x7d,
            (byte) 0x3a, (byte) 0x63, (byte) 0xa2, (byte) 0x65,
            (byte) 0xe1, (byte) 0x3a, (byte) 0xb3, (byte) 0x8b,
            (byte) 0x6c, (byte) 0x51, (byte) 0xf9, (byte) 0x01,
            (byte) 0x8b, (byte) 0x9b, (byte) 0x5d, (byte) 0x0e,
            (byte) 0xe0, (byte) 0x3f, (byte) 0x5d, (byte) 0x47,
            (byte) 0x6e, (byte) 0x30, (byte) 0x19, (byte) 0xc0
    };

    public String hashString(final String input) {
        try {
            // Create MessageDigest instance for SHA-256
            MessageDigest md = MessageDigest.getInstance("SHA-256");

            // compute the hash of the input string
            byte[] hash = md.digest(Arrays.concatenate(input.getBytes(), longToBytes(System.currentTimeMillis()), SALT));

            // convert the hash to a base64 string
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    public byte[] longToBytes(final long x) {
        ByteBuffer buffer = ByteBuffer.allocate(Long.BYTES);
        buffer.putLong(x);
        return buffer.array();
    }
}
