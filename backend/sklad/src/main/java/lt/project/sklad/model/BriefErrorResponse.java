package lt.project.sklad.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing an {@link #error} response
 * with HTTP {@link #status} code, error message and details.
 * @version 1.0, 24 Jan 2024
 * @since 1.0, 24 Jan 2024
 * @author Maksim Pavlenko
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BriefErrorResponse {
    private Integer status; // http status code
    private String error; // short error message
    private String details; // long error message
}
