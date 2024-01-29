package lt.project.sklad.exceptions;

import lombok.Data;

@Data
public class DataNotFoundException extends NullPointerException {
    public DataNotFoundException(String message) {
        super(message);
    }
}
