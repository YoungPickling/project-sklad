package lt.project.sklad.dto_request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssemleDTO {
    private Long add;
    private Long build;
    private Long locationId;
}
