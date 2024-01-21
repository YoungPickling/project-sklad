package lt.project.sklad._security.dto_response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a response containing
 * one simple message.
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 9 Aug 2023
 * @author Maksim Pavlenko
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MsgResponse implements AbstractResponse {
    private String msg;
}
