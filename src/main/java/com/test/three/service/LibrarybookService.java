package com.test.three.service;

import com.test.three.domain.Librarybook;
import com.test.three.repository.LibrarybookRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Librarybook}.
 */
@Service
@Transactional
public class LibrarybookService {

    private final Logger log = LoggerFactory.getLogger(LibrarybookService.class);

    private final LibrarybookRepository librarybookRepository;

    public LibrarybookService(LibrarybookRepository librarybookRepository) {
        this.librarybookRepository = librarybookRepository;
    }

    /**
     * Save a librarybook.
     *
     * @param librarybook the entity to save.
     * @return the persisted entity.
     */
    public Librarybook save(Librarybook librarybook) {
        log.debug("Request to save Librarybook : {}", librarybook);
        return librarybookRepository.save(librarybook);
    }

    /**
     * Partially update a librarybook.
     *
     * @param librarybook the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Librarybook> partialUpdate(Librarybook librarybook) {
        log.debug("Request to partially update Librarybook : {}", librarybook);

        return librarybookRepository
            .findById(librarybook.getId())
            .map(
                existingLibrarybook -> {
                    if (librarybook.getName() != null) {
                        existingLibrarybook.setName(librarybook.getName());
                    }
                    if (librarybook.getAuthor() != null) {
                        existingLibrarybook.setAuthor(librarybook.getAuthor());
                    }
                    if (librarybook.getPublisher() != null) {
                        existingLibrarybook.setPublisher(librarybook.getPublisher());
                    }
                    if (librarybook.getInstock() != null) {
                        existingLibrarybook.setInstock(librarybook.getInstock());
                    }

                    return existingLibrarybook;
                }
            )
            .map(librarybookRepository::save);
    }

    /**
     * Get all the librarybooks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Librarybook> findAll() {
        log.debug("Request to get all Librarybooks");
        return librarybookRepository.findAll();
    }

    /**
     * Get one librarybook by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Librarybook> findOne(Long id) {
        log.debug("Request to get Librarybook : {}", id);
        return librarybookRepository.findById(id);
    }

    /**
     * Delete the librarybook by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Librarybook : {}", id);
        librarybookRepository.deleteById(id);
    }
}
