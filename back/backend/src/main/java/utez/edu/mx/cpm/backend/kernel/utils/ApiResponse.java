package utez.edu.mx.cpm.backend.kernel.utils;

import lombok.Data;
import org.springframework.boot.logging.log4j2.WhitespaceThrowablePatternConverter;
import org.springframework.http.HttpStatus;


/**
 * ApiResponse es la entidad o el cuerpo con el que responde el backend.
 * Cuenta con una propiedad de mensaje para dar retroalimentación de las operaciones,
 * una propiedad data que es la que almacena la información solicitada, uan propiedad
 * error que indica si la respuesta es un error o no, y una propiedad httpStatus que
 * es la que ayuda a identificar el tipo de respuesta HTTP
 *
 * @author CokerAlcocer
 * @since v1.0.0
 */
@Data
public class ApiResponse {
    private String message;
    private Object data;
    private Boolean error;
    private HttpStatus httpStatus;

    /**
     * Constructor para mandar mensaje con respuesta correcta.
     *
     * @param message Texto de respuesta.
     * @param httpStatus Estado HTTP que irá en el cuerpo.
     * */
    public ApiResponse(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    /**
     * Constructor para mandar mensaje con respuesta correcta o errónea.
     *
     * @param message Texto de respuesta.
     * @param httpStatus Estado HTTP que irá en el cuerpo.
     * @param error Booleano para indicar si es error o no.
     * */
    public ApiResponse(String message, HttpStatus httpStatus, Boolean error) {
        this.message = message;
        this.httpStatus = httpStatus;
        this.error = error;
    }

    /**
     * Constructor con cuerpo y respuesta correcta.
     *
     * @param message Texto de respuesta.
     * @param data Cuerpo o información a devolver, puede ser de cualquier tipo.
     * @param httpStatus Estado HTTP que irá en el cuerpo
     * */
    public ApiResponse(String message, Object data, HttpStatus httpStatus) {
        this.message = message;
        this.data = data;// what is your question?
        this.httpStatus = httpStatus;
    }

    /**
     * Constructor con cuerpo y respuesta correcta o errónea.
     *
     * @param message Texto de respuesta.
     * @param data Cuerpo o información a devolver, puede ser de cualquier tipo.
     * @param error Booleano para indicar si es error o no.
     * @param httpStatus Estado HTTP que irá en el cuerpo.
     * */
    public ApiResponse(String message, Object data, Boolean error, HttpStatus httpStatus) {
        this.message = message;
        this.data = data;
        this.error = error;
        this.httpStatus = httpStatus;
    }
}
