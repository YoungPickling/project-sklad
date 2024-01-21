package lt.project.sklad._security.dto_request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad._security.entities.Role;

/**
 * DTO representing the registration
 * request containing user details and
 * validation criterias.
 * @since 1.0, 15 Aug 2023
 * @version 1.0, 4 Aug 2023
 * @author Maksim Pavlenko
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Firstname is required")
    @Size(min = 2, message = "Firstname is too short")
    private String firstname;

    @NotBlank(message = "Lastname is required")
    @Size(min = 2, message = "Lastname is too short")
    private String lastname;

    @NotBlank(message = "Username is required")
    @Size(min = 3, message = "Username should contain at least 3 symbols")
    private String username;

    private String company;

    @NotBlank(message = "Email cannot be empty")
    @Email
    @Size(min = 3, message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "At least 8 symbols for password are required")
    @Size(max = 64, message = "Password is too long")
    private String password;

    private Role role;
}
