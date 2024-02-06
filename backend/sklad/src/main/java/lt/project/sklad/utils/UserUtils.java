package lt.project.sklad.utils;

import jakarta.servlet.http.HttpServletRequest;
import lt.project.sklad._security.entities.Token;
import lt.project.sklad._security.entities.User;
import lt.project.sklad._security.services.TokenService;
import lt.project.sklad._security.utils.MessagingUtils;
import org.springframework.http.HttpHeaders;

public class UserUtils {
    public static User getGuthenticatedId(
            final TokenService tokenService,
            final HttpServletRequest request
    ) throws NullPointerException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (MessagingUtils.isBearer(authHeader))
            throw new NullPointerException("1");

        final String jwt = authHeader.substring(7);
        final Token token = tokenService.findByToken(jwt).orElse(null);

        if (token == null)
            throw new NullPointerException("2");

        return token.getUser();
    }
}
