package lt.project.sklad.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.Deflater;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import java.util.zip.Inflater;

public class ImageUtils {
    private static final String FILE_NAME_PATTERN = "( \\(\\d+\\))";
    private static final Pattern PATTERN_CONSTANT = Pattern.compile(FILE_NAME_PATTERN);

    public static byte[] compressImage(byte[] data) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Deflater deflater = new Deflater();
            deflater.setLevel(Deflater.BEST_COMPRESSION);
            deflater.setInput(data);
            deflater.finish();

            byte[] buffer = new byte[4 * 1024];
            while (!deflater.finished()) {
                int size = deflater.deflate(buffer);
                outputStream.write(buffer, 0, size);
            }
            deflater.end();
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace(); // Handle exception appropriately
            return new byte[0]; // Return empty byte array if compression fails
        }
    }

    public static byte[] decompressImage(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
            outputStream.close();
            inflater.end();
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace(); // Handle exception appropriately
            return new byte[0]; // Return empty byte array if decompression fails
        }
    }

    public static String incrementFileName(
            final String fileName,
            final Predicate<String> isFileNamePresent)
    {
        // Extract file name and extension
        String nameWithoutExtension, extension;
        int lastDotIndex = fileName.indexOf('.');

        if (lastDotIndex != -1) {
            nameWithoutExtension = fileName.substring(0, lastDotIndex);
            extension = fileName.substring(lastDotIndex);
        } else {
            nameWithoutExtension = fileName;
            extension = "";
        }

        // Compile the pattern for finding increments
        Matcher matcher = PATTERN_CONSTANT.matcher(nameWithoutExtension);

        // Check for existing increment
        int currentIncrement = 0;
        if (matcher.find()) {
            try {
                String incrementGroup = matcher.group(1);
                currentIncrement = Integer.parseInt(incrementGroup.substring(2, incrementGroup.length() - 1));
                nameWithoutExtension = nameWithoutExtension.replaceFirst(FILE_NAME_PATTERN, "");
            } catch (NumberFormatException e) {
                // Ignore if the increment cannot be parsed
            }
        }

        // Increment and create new file name
        String newFileName;
        do {
            currentIncrement++;
            newFileName = nameWithoutExtension + String.format(" (%d)", currentIncrement) + extension;
        } while (isFileNamePresent.test(newFileName));

        return newFileName;
    }
}
