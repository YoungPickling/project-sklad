package lt.project.sklad._security.utils;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.dto_response.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@RequiredArgsConstructor
public class MessagingUtils {
    /**
     * Checks if the provided Authorization header contains a valid Bearer token.
     *
     * @param authHeader The Authorization header value to be checked.
     * @return True if the provided header is valid Bearer token, false otherwise.
     * @version 1.0, 11 Aug 2023
     * @author Maksim Pavlenko
     */
    public boolean isBearer(final String authHeader) {
        return authHeader == null
                || !authHeader.startsWith("Bearer ");
    }
    /**
     * Generates an error response with the given HTTP status code and message.
     *
     * @param status The HTTP status code of the error response.
     * @param msg    The error message associated with the response.
     * @return A {@link ResponseEntity} containing an {@link ErrorResponse} object indicating the error details.
     * @version 1.0, 11 Aug 2023
     * @author  Maksim Pavlenko
     */
    public ResponseEntity<AbstractResponse> error(
            final HttpStatus status, final String msg
    ) {
        return ResponseEntity.status( status )
                .body(new ErrorResponse( status.value() ,msg));
    }

    public ResponseEntity<AbstractResponse> error(
            final HttpStatus status, final String msg, final String details
    ) {
        return ResponseEntity.status( status )
                .body(new BriefErrorResponse( status.value(), msg, details));
    }

    /**
     * Generates a response with a success or any other message.
     *
     * @param text The success message to be included in the response.
     * @return A {@link ResponseEntity} containing a {@link MsgResponse} object with the success message.
     * @version 1.0, 11 Aug 2023
     * @author  Maksim Pavlenko
     */
    public ResponseEntity<AbstractResponse> msg(final String text) {
        return ResponseEntity.ok(new MsgResponse(text));
    }

    public ResponseEntity<AbstractResponse> msg(final String text, final String details) {
        return ResponseEntity.ok(new BriefMsgResponse(text, details));
    }
}
