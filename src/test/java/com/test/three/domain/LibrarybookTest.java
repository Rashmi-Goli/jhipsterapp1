package com.test.three.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.test.three.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LibrarybookTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Librarybook.class);
        Librarybook librarybook1 = new Librarybook();
        librarybook1.setId(1L);
        Librarybook librarybook2 = new Librarybook();
        librarybook2.setId(librarybook1.getId());
        assertThat(librarybook1).isEqualTo(librarybook2);
        librarybook2.setId(2L);
        assertThat(librarybook1).isNotEqualTo(librarybook2);
        librarybook1.setId(null);
        assertThat(librarybook1).isNotEqualTo(librarybook2);
    }
}
