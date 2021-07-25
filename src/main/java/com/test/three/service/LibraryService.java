package com.test.three.service;

import com.test.three.domain.Library;
import com.test.three.repository.LibraryRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Library}.
 */
@Service
@Transactional
public class LibraryService {

    private final Logger log = LoggerFactory.getLogger(LibraryService.class);

    private final LibraryRepository libraryRepository;

    public LibraryService(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    /**
     * Save a library.
     *
     * @param library the entity to save.
     * @return the persisted entity.
     */
    public Library save(Library library) {
        log.debug("Request to save Library : {}", library);
        return libraryRepository.save(library);
    }

    /**
     * Partially update a library.
     *
     * @param library the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Library> partialUpdate(Library library) {
        log.debug("Request to partially update Library : {}", library);

        return libraryRepository
            .findById(library.getId())
            .map(
                existingLibrary -> {
                    if (library.getLibraryname() != null) {
                        existingLibrary.setLibraryname(library.getLibraryname());
                    }
                    if (library.getAddress() != null) {
                        existingLibrary.setAddress(library.getAddress());
                    }

                    return existingLibrary;
                }
            )
            .map(libraryRepository::save);
    }

    /**
     * Get all the libraries.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Library> findAll() {
        log.debug("Request to get all Libraries");
        return libraryRepository.findAll();
    }

    /**
     * Get one library by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Library> findOne(Long id) {
        log.debug("Request to get Library : {}", id);
        return libraryRepository.findById(id);
    }

    /**
     * Delete the library by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Library : {}", id);
        libraryRepository.deleteById(id);
    }
}
