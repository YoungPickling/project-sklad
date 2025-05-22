package lt.project.sklad._security.utils;

import junitparams.JUnitParamsRunner;
import junitparams.Parameters;
import lt.project.sklad._security.dto_response.AbstractResponse;
import lt.project.sklad._security.dto_response.BriefErrorResponse;
import lt.project.sklad._security.dto_response.ErrorResponse;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RunWith(JUnitParamsRunner.class)
public class MessagingUtilsTests {

    private MessagingUtils messagingUtils;

    private static Object[] parametersForIsNotBearer() {
        return new Object[]{
                new Object[]{null, true},
                new Object[]{"", true},
                new Object[]{"Bearer ", false}
        };
    }

    @Before
    public void setup() {
        messagingUtils = new MessagingUtils();
    }

    @Test
    @Parameters
    public void isNotBearer(String authHeader, boolean expectedValue) throws ClassCastException{
        // Act
        boolean result = messagingUtils.isNotBearer(authHeader);

        // Assert
        Assert.assertEquals(result, expectedValue);
    }

    public void errorOne() {
        // Arrange
        HttpStatus status = HttpStatus.OK;
        String msg = "Hello";

        // Act
        ResponseEntity<AbstractResponse> temp = messagingUtils.error(status, msg);
        // Assert
        Assert.assertNotNull(temp);
        Assert.assertEquals(temp.getStatusCode(), status);
        Assert.assertTrue(temp.getBody() instanceof ErrorResponse);

        // Act
        ErrorResponse result = (ErrorResponse) temp.getBody();

        // Assert
        Assert.assertNotNull(result);
        Assert.assertEquals(result.getStatus().intValue(), status.value());
        Assert.assertEquals(result.getError(), msg);
    }

    public void errorTwo() {
        // Arrange
        HttpStatus status = HttpStatus.OK;
        String msg = "Hello";
        String details = "details";

        // Act
        ResponseEntity<AbstractResponse> temp = messagingUtils.error(status, msg, details);

        // Assert
        Assert.assertNotNull(temp);
        Assert.assertEquals(temp.getStatusCode(), status);
        Assert.assertTrue(temp.getBody() instanceof BriefErrorResponse);

        // Act
        BriefErrorResponse result = (BriefErrorResponse) temp.getBody();

        // Assert
        Assert.assertNotNull(result);
        Assert.assertEquals(result.getStatus().intValue(), status.value());
        Assert.assertEquals(result.getError(), msg);
        Assert.assertEquals(result.getDetails(), details);
    }
}
