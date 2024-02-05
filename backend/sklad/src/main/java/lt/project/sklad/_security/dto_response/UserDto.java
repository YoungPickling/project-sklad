package lt.project.sklad._security.dto_response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad.entities.Image;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String firstname;
    private String lastname;
    @JsonProperty("image_link")
//    private String imageLink;
    private String username;
    private String email;
    private String role;
    @JsonProperty("reg_date")
    private String registrationDate;
}
