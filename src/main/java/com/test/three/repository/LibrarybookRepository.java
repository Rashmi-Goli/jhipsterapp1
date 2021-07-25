package com.test.three.repository;

import com.test.three.domain.Librarybook;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Librarybook entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LibrarybookRepository extends JpaRepository<Librarybook, Long> {}
