package com.test.three.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.test.three.IntegrationTest;
import com.test.three.domain.Librarybook;
import com.test.three.repository.LibrarybookRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LibrarybookResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LibrarybookResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_PUBLISHER = "AAAAAAAAAA";
    private static final String UPDATED_PUBLISHER = "BBBBBBBBBB";

    private static final Boolean DEFAULT_INSTOCK = false;
    private static final Boolean UPDATED_INSTOCK = true;

    private static final String ENTITY_API_URL = "/api/librarybooks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LibrarybookRepository librarybookRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLibrarybookMockMvc;

    private Librarybook librarybook;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Librarybook createEntity(EntityManager em) {
        Librarybook librarybook = new Librarybook()
            .name(DEFAULT_NAME)
            .author(DEFAULT_AUTHOR)
            .publisher(DEFAULT_PUBLISHER)
            .instock(DEFAULT_INSTOCK);
        return librarybook;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Librarybook createUpdatedEntity(EntityManager em) {
        Librarybook librarybook = new Librarybook()
            .name(UPDATED_NAME)
            .author(UPDATED_AUTHOR)
            .publisher(UPDATED_PUBLISHER)
            .instock(UPDATED_INSTOCK);
        return librarybook;
    }

    @BeforeEach
    public void initTest() {
        librarybook = createEntity(em);
    }

    @Test
    @Transactional
    void createLibrarybook() throws Exception {
        int databaseSizeBeforeCreate = librarybookRepository.findAll().size();
        // Create the Librarybook
        restLibrarybookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(librarybook)))
            .andExpect(status().isCreated());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeCreate + 1);
        Librarybook testLibrarybook = librarybookList.get(librarybookList.size() - 1);
        assertThat(testLibrarybook.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLibrarybook.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testLibrarybook.getPublisher()).isEqualTo(DEFAULT_PUBLISHER);
        assertThat(testLibrarybook.getInstock()).isEqualTo(DEFAULT_INSTOCK);
    }

    @Test
    @Transactional
    void createLibrarybookWithExistingId() throws Exception {
        // Create the Librarybook with an existing ID
        librarybook.setId(1L);

        int databaseSizeBeforeCreate = librarybookRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLibrarybookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(librarybook)))
            .andExpect(status().isBadRequest());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLibrarybooks() throws Exception {
        // Initialize the database
        librarybookRepository.saveAndFlush(librarybook);

        // Get all the librarybookList
        restLibrarybookMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(librarybook.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].publisher").value(hasItem(DEFAULT_PUBLISHER)))
            .andExpect(jsonPath("$.[*].instock").value(hasItem(DEFAULT_INSTOCK.booleanValue())));
    }

    @Test
    @Transactional
    void getLibrarybook() throws Exception {
        // Initialize the database
        librarybookRepository.saveAndFlush(librarybook);

        // Get the librarybook
        restLibrarybookMockMvc
            .perform(get(ENTITY_API_URL_ID, librarybook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(librarybook.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR))
            .andExpect(jsonPath("$.publisher").value(DEFAULT_PUBLISHER))
            .andExpect(jsonPath("$.instock").value(DEFAULT_INSTOCK.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingLibrarybook() throws Exception {
        // Get the librarybook
        restLibrarybookMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLibrarybook() throws Exception {
        // Initialize the database
        librarybookRepository.saveAndFlush(librarybook);

        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();

        // Update the librarybook
        Librarybook updatedLibrarybook = librarybookRepository.findById(librarybook.getId()).get();
        // Disconnect from session so that the updates on updatedLibrarybook are not directly saved in db
        em.detach(updatedLibrarybook);
        updatedLibrarybook.name(UPDATED_NAME).author(UPDATED_AUTHOR).publisher(UPDATED_PUBLISHER).instock(UPDATED_INSTOCK);

        restLibrarybookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLibrarybook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLibrarybook))
            )
            .andExpect(status().isOk());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
        Librarybook testLibrarybook = librarybookList.get(librarybookList.size() - 1);
        assertThat(testLibrarybook.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLibrarybook.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testLibrarybook.getPublisher()).isEqualTo(UPDATED_PUBLISHER);
        assertThat(testLibrarybook.getInstock()).isEqualTo(UPDATED_INSTOCK);
    }

    @Test
    @Transactional
    void putNonExistingLibrarybook() throws Exception {
        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();
        librarybook.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLibrarybookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, librarybook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(librarybook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLibrarybook() throws Exception {
        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();
        librarybook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLibrarybookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(librarybook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLibrarybook() throws Exception {
        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();
        librarybook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLibrarybookMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(librarybook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLibrarybookWithPatch() throws Exception {
        // Initialize the database
        librarybookRepository.saveAndFlush(librarybook);

        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();

        // Update the librarybook using partial update
        Librarybook partialUpdatedLibrarybook = new Librarybook();
        partialUpdatedLibrarybook.setId(librarybook.getId());

        partialUpdatedLibrarybook.name(UPDATED_NAME).author(UPDATED_AUTHOR).instock(UPDATED_INSTOCK);

        restLibrarybookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLibrarybook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLibrarybook))
            )
            .andExpect(status().isOk());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
        Librarybook testLibrarybook = librarybookList.get(librarybookList.size() - 1);
        assertThat(testLibrarybook.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLibrarybook.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testLibrarybook.getPublisher()).isEqualTo(DEFAULT_PUBLISHER);
        assertThat(testLibrarybook.getInstock()).isEqualTo(UPDATED_INSTOCK);
    }

    @Test
    @Transactional
    void fullUpdateLibrarybookWithPatch() throws Exception {
        // Initialize the database
        librarybookRepository.saveAndFlush(librarybook);

        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();

        // Update the librarybook using partial update
        Librarybook partialUpdatedLibrarybook = new Librarybook();
        partialUpdatedLibrarybook.setId(librarybook.getId());

        partialUpdatedLibrarybook.name(UPDATED_NAME).author(UPDATED_AUTHOR).publisher(UPDATED_PUBLISHER).instock(UPDATED_INSTOCK);

        restLibrarybookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLibrarybook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLibrarybook))
            )
            .andExpect(status().isOk());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
        Librarybook testLibrarybook = librarybookList.get(librarybookList.size() - 1);
        assertThat(testLibrarybook.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLibrarybook.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testLibrarybook.getPublisher()).isEqualTo(UPDATED_PUBLISHER);
        assertThat(testLibrarybook.getInstock()).isEqualTo(UPDATED_INSTOCK);
    }

    @Test
    @Transactional
    void patchNonExistingLibrarybook() throws Exception {
        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();
        librarybook.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLibrarybookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, librarybook.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(librarybook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLibrarybook() throws Exception {
        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();
        librarybook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLibrarybookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(librarybook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLibrarybook() throws Exception {
        int databaseSizeBeforeUpdate = librarybookRepository.findAll().size();
        librarybook.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLibrarybookMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(librarybook))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Librarybook in the database
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLibrarybook() throws Exception {
        // Initialize the database
        librarybookRepository.saveAndFlush(librarybook);

        int databaseSizeBeforeDelete = librarybookRepository.findAll().size();

        // Delete the librarybook
        restLibrarybookMockMvc
            .perform(delete(ENTITY_API_URL_ID, librarybook.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Librarybook> librarybookList = librarybookRepository.findAll();
        assertThat(librarybookList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
