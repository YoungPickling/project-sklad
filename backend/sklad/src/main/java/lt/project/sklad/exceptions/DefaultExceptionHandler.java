package lt.project.sklad.exceptions;

import lt.project.sklad._security.dto_response.ErrorResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * CentralExceptionHandler is a global exception handler for handling specific exceptions
 * in a centralized manner.
 */

@RestControllerAdvice
public class DefaultExceptionHandler extends ResponseEntityExceptionHandler {
    /**
     * Handles DataNotFoundException and returns a ResponseEntity with a predefined
     * error message and status code.
     *
     * @param exception The DataNotFoundException to be handled.
     * @param request   The WebRequest associated with the exception.
     * @return ResponseEntity containing an ErrorModel with a specific error message and status code.
     */

    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<Object> handleDataNotFoundException(DataNotFoundException exception, WebRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND; // status 404

        return handleExceptionInternal(
                exception,
                new ErrorResponse(status.value(), exception.getMessage()),
                new HttpHeaders(),
                status,
                request);
    }

//    @ExceptionHandler(MaxUploadSizeExceededException.class)
//    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException ex) {
//        return ResponseEntity
//                .status(HttpStatus.PAYLOAD_TOO_LARGE)
//                .body("max file size exceeded! Maximum allowed size is 5MB.");
//    }

//    @ExceptionHandler(MaxUploadSizeExceededException.class)
//    public ResponseEntity<?> maxUploadSizeExceeded(MaxUploadSizeExceededException exception, WebRequest request) {
//        HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
//
//        return handleExceptionInternal(
//                exception,
//                new ErrorResponse(status.value(), exception.getMessage()),
//                new HttpHeaders(),
//                status,
//                request);
//        //return "max file size exceeded";
//    }

//    /**
//     * Handles InputValidationException and returns a ResponseEntity with a predefined
//     * error message and status code.
//     *
//     * @param exception The InputValidationException to be handled.
//     * @param request   The WebRequest associated with the exception.
//     * @return ResponseEntity containing an ErrorModel with a specific error message and status code.
//     */

//    @ExceptionHandler(InputValidationException.class)
//    public ResponseEntity<Object> handleInvalidInput(final Exception exception, final WebRequest request) {
//        HttpStatus status = HttpStatus.PRECONDITION_FAILED; // Error 412
//
//        return handleExceptionInternal(
//                exception,
//                new ErrorResponse("invalid characters", status.value()),
//                new HttpHeaders(),
//                status,
//                request);
//    }
}
