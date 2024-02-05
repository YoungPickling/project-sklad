package lt.project.sklad._security.dto_request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the authentication request
 * containing {@link #username} and {@link #password}.
 * This object is sent from the client to the
 * backend for logging into an account.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 4 Aug 2023
 * @author Maksim Pavlenko
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
