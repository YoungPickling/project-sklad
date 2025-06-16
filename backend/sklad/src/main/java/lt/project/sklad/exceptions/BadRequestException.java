package lt.project.sklad.exceptions;

import java.io.Serial;

public class BadRequestException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = -7139516213801294160L;

    public BadRequestException(String string) {
            super(string);
        }
}
