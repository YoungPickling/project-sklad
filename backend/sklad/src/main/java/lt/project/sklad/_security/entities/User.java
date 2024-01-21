package lt.project.sklad._security.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * <p>&emsp;Entity class representing a user in the application. This class encapsulates
 * user-related information and implements the {@link UserDetails} interface to
 * integrate with Spring Security.</p>
 *
 * <p>&emsp;This class stores details about a user, including a unique {@link #id},
 * {@link #firstname}, {@link #lastname}, {@link #username}, {@link #email},
 * {@link #password} hash, {@link #role}, {@link #tokens}.</p>
 *
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {
	/**
	 * The unique identifier for the user.
	 */
	@Id
	@GeneratedValue
	@Column(nullable = false, unique = true)
	private Long id;
	/**
	 * The first name of the user.
	 */
	@Column(nullable = false)
	private String firstname;
	/**
	 * The last name of the user.
	 */
	@Column(nullable = false)
	private String lastname;
	/**
	 * The username of the user.
	 */
	@Column(nullable = false)
	private String username;
	/**
	 * The username of the user.
	 */
	private String company;
	/**
	 * The email address of the user.
	 */
	@Column(nullable = false)
	private String email;
	/**
	 * The hashed password of the user.
	 */
	@Column(nullable = false)
	private String password;
	/**
	 * The role of the user within the application.
	 */
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Role role;
	/**
	 * The list of tokens associated with the user.
	 */
	@OneToMany(mappedBy = "user")
	private List<Token> tokens;
	/**
	 * Returns the authorities that are assigned
	 * to the user's role.
	 * @return the collection of granted authorities
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return role.getAuthorities();
	}
	/**
	 * Returns the user's password.
	 * @return the user's password
	 */
	@Override
	public String getPassword() {
		return password;
	}
	/**
	 * Returns the user's username.
	 * @return the user's username
	 */
	@Override
	public String getUsername() {
		return username;
	}
	/**
	 * Checks whether the user's account is non-expired.
	 * @return {@code true} if the account is non-expired, otherwise {@code false}
	 */
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	/**
	 * Checks whether the user's account is non-locked.
	 * @return {@code true} if the account is non-locked,
	 * otherwise {@code false}
	 */
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	/**
	 * Checks whether the user's credentials are non-expired.
	 * @return {@code true} if the credentials are non-expired,
	 * otherwise {@code false}
	 */
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	/**
	 * Checks whether the user's account is enabled.
	 * @return {@code true} if the account is enabled,
	 * otherwise {@code false}
	 */
	@Override
	public boolean isEnabled() {
		return true;
	}
}