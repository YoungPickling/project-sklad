package lt.project.sklad._security.dto_response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the response containing {@link #accessToken}
 * and user {@link #role} after successful authentication.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 4 Aug 2023
 * @author Maksim Pavlenko
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse implements AbstractResponse{
    @JsonProperty("access_token")
    private String accessToken;
    private String role;
}
