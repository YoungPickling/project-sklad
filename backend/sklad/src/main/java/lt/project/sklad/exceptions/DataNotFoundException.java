package lt.project.sklad.exceptions;

import java.io.Serial;

public class DataNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = -7139516213801294160L;

    public DataNotFoundException() {
        super("EXPIRED_JWT_TOKEN");
    }
}
