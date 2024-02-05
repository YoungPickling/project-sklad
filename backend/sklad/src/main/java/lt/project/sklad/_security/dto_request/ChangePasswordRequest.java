package lt.project.sklad._security.dto_request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "At least 8 symbols for password are required")
    @Size(max = 64, message = "Password is too long")
    @JsonProperty("new_password")
    private String newPassword;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "At least 8 symbols for password are required")
    @Size(max = 64, message = "Password is too long")
    @JsonProperty("confirmation")
    private String oldPassword;
}
