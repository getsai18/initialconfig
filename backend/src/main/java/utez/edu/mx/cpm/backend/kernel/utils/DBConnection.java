package utez.edu.mx.cpm.backend.kernel.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;

@Configuration
public class DBConnection {
    @Value("${db.host}")
    private String HOST;

    @Value("${db.port}")
    private String PORT;

    @Value("${db.name}")
    private String NAME;

    @Value("${db.username}")
    private String USERNAME;

    @Value("${db.password}")
    private String PASSWORD;

    @Bean
    public DataSource getConnection() {
        DriverManagerDataSource src = new DriverManagerDataSource();
        if (!StringUtils.hasText(HOST) || !StringUtils.hasText(PORT) || !StringUtils.hasText(NAME)) {
            src.setDriverClassName("org.h2.Driver");
            src.setUrl("jdbc:h2:mem:cpmanager;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE");
            src.setUsername("sa");
            src.setPassword("");
            return src;
        }

        src.setDriverClassName("com.mysql.cj.jdbc.Driver");
        src.setUrl(String.format("jdbc:mysql://%s:%s/%s", HOST, PORT, NAME));
        src.setUsername(USERNAME);
        src.setPassword(PASSWORD);

        return src;
    }
}
