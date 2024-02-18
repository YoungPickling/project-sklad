package lt.project.sklad.dto_request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO {
    private String code;
    private String name;
    private Integer color;
    private ItemColumnDto columns;

}
