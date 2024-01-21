package lt.project.sklad._security.dto_response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO representing an error response with HTTP status code
 * and a <i><u>list of error messages</u></i>.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 4 Aug 2023
 * @author Maksim Pavlenko
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MultiErrorResponse implements AbstractResponse {
    private Integer status; // http status code
    private List<String> errors; // error messages
}
