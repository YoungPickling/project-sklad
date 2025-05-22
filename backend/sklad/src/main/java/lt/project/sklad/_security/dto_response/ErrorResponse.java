package lt.project.sklad._security.dto_response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing an {@link #error} response
 * with HTTP {@link #status} code and error message.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 4 Aug 2023
 * @author Maksim Pavlenko
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse implements AbstractResponse {
    private Integer status; // http status code
    private String error; // error message

    public Integer getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }
}
