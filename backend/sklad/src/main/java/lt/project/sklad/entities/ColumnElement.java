package lt.project.sklad.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "column_element")
public class ColumnElement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "column_element_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    private String value;

    // metadata

    @Column(name = "column_color", nullable = false)
    private Integer columnColor;
}
