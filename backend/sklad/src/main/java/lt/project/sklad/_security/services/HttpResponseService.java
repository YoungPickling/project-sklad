package lt.project.sklad._security.services;

import lombok.RequiredArgsConstructor;
import lt.project.sklad._security.dto_request.RegisterRequest;
import lt.project.sklad._security.dto_response.AbstractResponse;
import lt.project.sklad._security.dto_response.ErrorResponse;
import lt.project.sklad._security.dto_response.MsgResponse;
import lt.project.sklad._security.dto_response.MultiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.validation.annotation.Validated;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;

/**
 * <p>&emsp; General purpose utility service class responsible
 * for generating various types of HTTP responses
 * for security-related operations and endpoints.</p>
 *
 * <p>&emsp; This service provides methods for generating
 * different types of HTTP responses, including
 * error responses {@link #error}
 * and informative responses {@link #msg}.
 * It also includes methods for validating registration requests
 * {@link #regisrationValidation} and
 * checking if usernames and emails are available for
 * registration – {@link #isUsernameTaken}, {@link #isEmailTaken}.</p>
 *
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 9 Aug 2023
 * @author Maksim Pavlenko
 */
@Service
@RequiredArgsConstructor
public class HttpResponseService {
    private final UserService userService;

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
            HttpStatus status, String msg)
    {
        return ResponseEntity.status( status )
                .body(new ErrorResponse( status.value() ,msg));
    }

    /**
     * Generates a response with a success or any other message.
     *
     * @param text The success message to be included in the response.
     * @return A {@link ResponseEntity} containing a {@link MsgResponse} object with the success message.
     * @version 1.0, 11 Aug 2023
     * @author  Maksim Pavlenko
     */
    public ResponseEntity<AbstractResponse> msg(String text) {
        return ResponseEntity.ok(new MsgResponse(text));
    }

    /**
     * Checks if the provided Authorization header contains a valid Bearer token.
     *
     * @param authHeader The Authorization header value to be checked.
     * @return True if the provided header is valid Bearer token, false otherwise.
     * @version 1.0, 11 Aug 2023
     * @author Maksim Pavlenko
     */
    public boolean isBearer(String authHeader) {
        return authHeader == null
                || !authHeader.startsWith("Bearer ");
    }

    /**
     * <p>Validates the registration request and checks if the provided username and email are available for registration.</p>
     *
     * This method performs the following steps:
     * <ol>
     *   <li>Validates the fields in the provided {@link Validated} and {@link RequestBody}
     *       parameters using the given {@link BindingResult}.
     *   <li>Checks if the username and email in the {@link RegisterRequest} are already taken. If the username
     *       is taken or the email is already associated with an existing account, an error response is returned.
     * </ol>
     *
     * @param bindingResult The result of the validation that holds any errors.
     * @param request       The {@link RegisterRequest} object containing the registration information.
     * @return              If validation is successful and both username and email are available, returns null.
     *                      Otherwise, returns a {@link ResponseEntity} containing an
     *                      {@link AbstractResponse} object indicating the error details.
     * @version             1.0, 13 Aug 2023
     * @author              Maksim Pavlenko
     */
    public ResponseEntity<AbstractResponse> regisrationValidation(
            BindingResult bindingResult, RegisterRequest request)
    {
            var error = isRegRequestValid(bindingResult);
            if (error != null)
                return error;

            error = isUsernameTaken(request);
            if (error != null)
                return error;

            error = isEmailTaken(request);
            return error;
    }

    /**
     * Validates the fields in the provided {@link Validated} and
     * {@link RequestBody} parameter using the given
     * {@link BindingResult}.
     *
     * @param bindingResult The result of the validation that holds any errors.
     * @return              If there are validation errors, returns a {@link ResponseEntity} containing a
     *                      {@link MultiErrorResponse} object indicating the error details. If there are no errors,
     *                      returns null.
     * @since 1.0, 13 Aug 2023
     * @author Maksim Pavlenko
     */
    public ResponseEntity<AbstractResponse> isRegRequestValid(BindingResult bindingResult) {
        if (bindingResult.hasFieldErrors() || bindingResult.hasGlobalErrors()) {
            HttpStatus status = NOT_ACCEPTABLE; // status 406
            List<ObjectError> err = bindingResult.getAllErrors();
            Set<String> errorResponse = new HashSet<>();
            for (ObjectError x: err)
                errorResponse.add( x.getDefaultMessage() );
            return ResponseEntity.status( status )
                    .body(new MultiErrorResponse( status.value(), errorResponse.stream().toList() )) ;
        }
        return null;
    }

    /**
     * Checks if the provided email in the {@link RegisterRequest} is already associated with an existing account.
     *
     * @param request The {@link RegisterRequest} object containing the email to be checked.
     * @return        If the email is already taken, returns a {@link ResponseEntity} containing an
     *                {@link ErrorResponse} object indicating the error details. If the email is available, returns null.
     * @version       1.0, 13 Aug 2023
     * @author        Maksim Pavlenko
     */

    public ResponseEntity<AbstractResponse> isEmailTaken(RegisterRequest request) {
        if ( userService.hasUsername( request.getUsername() ) ) {
            HttpStatus status = BAD_REQUEST; // status 400
            return ResponseEntity.status( status )
                    .body(new ErrorResponse( status.value() ,"Username is taken"));
        }
        return null;
    }

    /**
     * Checks if the provided username in the {@link RegisterRequest} is already taken.
     *
     * @param request The {@link RegisterRequest} object containing the username to be checked.
     * @return        If the username is already taken, returns a {@link ResponseEntity} containing an
     *                {@link ErrorResponse} object indicating the error details. If the username is available, returns null.
     * @version     1.0, 13 Aug 2023
     * @author      Maksim Pavlenko
     */

    public ResponseEntity<AbstractResponse> isUsernameTaken(RegisterRequest request) {
        if ( userService.hasEmail( request.getEmail() ) ) {
            HttpStatus status = BAD_REQUEST; // status 400
            return ResponseEntity.status( status )
                    .body(new ErrorResponse( status.value() ,"Email is taken"));
        }
        return null;
    }
}
