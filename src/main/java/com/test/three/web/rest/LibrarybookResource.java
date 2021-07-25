package com.test.three.web.rest;

import com.test.three.domain.Librarybook;
import com.test.three.repository.LibrarybookRepository;
import com.test.three.service.LibrarybookService;
import com.test.three.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.test.three.domain.Librarybook}.
 */
@RestController
@RequestMapping("/api")
public class LibrarybookResource {

    private final Logger log = LoggerFactory.getLogger(LibrarybookResource.class);

    private static final String ENTITY_NAME = "librarybook";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LibrarybookService librarybookService;

    private final LibrarybookRepository librarybookRepository;

    public LibrarybookResource(LibrarybookService librarybookService, LibrarybookRepository librarybookRepository) {
        this.librarybookService = librarybookService;
        this.librarybookRepository = librarybookRepository;
    }

    /**
     * {@code POST  /librarybooks} : Create a new librarybook.
     *
     * @param librarybook the librarybook to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new librarybook, or with status {@code 400 (Bad Request)} if the librarybook has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/librarybooks")
    public ResponseEntity<Librarybook> createLibrarybook(@RequestBody Librarybook librarybook) throws URISyntaxException {
        log.debug("REST request to save Librarybook : {}", librarybook);
        if (librarybook.getId() != null) {
            throw new BadRequestAlertException("A new librarybook cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Librarybook result = librarybookService.save(librarybook);
        return ResponseEntity
            .created(new URI("/api/librarybooks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /librarybooks/:id} : Updates an existing librarybook.
     *
     * @param id the id of the librarybook to save.
     * @param librarybook the librarybook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated librarybook,
     * or with status {@code 400 (Bad Request)} if the librarybook is not valid,
     * or with status {@code 500 (Internal Server Error)} if the librarybook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/librarybooks/{id}")
    public ResponseEntity<Librarybook> updateLibrarybook(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Librarybook librarybook
    ) throws URISyntaxException {
        log.debug("REST request to update Librarybook : {}, {}", id, librarybook);
        if (librarybook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, librarybook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!librarybookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Librarybook result = librarybookService.save(librarybook);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, librarybook.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /librarybooks/:id} : Partial updates given fields of an existing librarybook, field will ignore if it is null
     *
     * @param id the id of the librarybook to save.
     * @param librarybook the librarybook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated librarybook,
     * or with status {@code 400 (Bad Request)} if the librarybook is not valid,
     * or with status {@code 404 (Not Found)} if the librarybook is not found,
     * or with status {@code 500 (Internal Server Error)} if the librarybook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/librarybooks/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Librarybook> partialUpdateLibrarybook(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Librarybook librarybook
    ) throws URISyntaxException {
        log.debug("REST request to partial update Librarybook partially : {}, {}", id, librarybook);
        if (librarybook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, librarybook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!librarybookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Librarybook> result = librarybookService.partialUpdate(librarybook);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, librarybook.getId().toString())
        );
    }

    /**
     * {@code GET  /librarybooks} : get all the librarybooks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of librarybooks in body.
     */
    @GetMapping("/librarybooks")
    public List<Librarybook> getAllLibrarybooks() {
        log.debug("REST request to get all Librarybooks");
        System.out.println("+++++++++++++++++++++++++++");
        return librarybookService.findAll();
    }

    /**
     * {@code GET  /librarybooks/:id} : get the "id" librarybook.
     *
     * @param id the id of the librarybook to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the librarybook, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/librarybooks/{id}")
    public ResponseEntity<Librarybook> getLibrarybook(@PathVariable Long id) {
        log.debug("REST request to get Librarybook : {}", id);
        Optional<Librarybook> librarybook = librarybookService.findOne(id);
        return ResponseUtil.wrapOrNotFound(librarybook);
    }

    /**
     * {@code DELETE  /librarybooks/:id} : delete the "id" librarybook.
     *
     * @param id the id of the librarybook to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/librarybooks/{id}")
    public ResponseEntity<Void> deleteLibrarybook(@PathVariable Long id) {
        log.debug("REST request to delete Librarybook : {}", id);
        librarybookService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
