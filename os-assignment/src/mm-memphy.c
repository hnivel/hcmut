// #ifdef MM_PAGING
/*
 * PAGING based Memory Management
 * Memory physical module mm/mm-memphy.c
 */

#include "mm.h"
#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

pthread_mutex_t fp_lock = PTHREAD_MUTEX_INITIALIZER;
sem_t rw_lock;
sem_t read_lock;
int read_count = 0;
/*
 *  MEMPHY_mv_csr - move MEMPHY cursor
 *  @mp: memphy struct
 *  @offset: offset
 */
int MEMPHY_mv_csr(struct memphy_struct *mp, int offset) {
    int numstep = 0;

    mp->cursor = 0;
    while (numstep < offset && numstep < mp->maxsz) {
        /* Traverse sequentially */
        mp->cursor = (mp->cursor + 1) % mp->maxsz;
        numstep++;
    }

    return 0;
}

/*
 *  MEMPHY_seq_read - read MEMPHY device
 *  @mp: memphy struct
 *  @addr: address
 *  @value: obtained value
 */
int MEMPHY_seq_read(struct memphy_struct *mp, int addr, BYTE *value) {
    if (mp == NULL)
        return -1;

    if (!mp->rdmflg)
        return -1; /* Not compatible mode for sequential read */

    MEMPHY_mv_csr(mp, addr);
    *value = (BYTE)mp->storage[addr];

    return 0;
}

/*
 *  MEMPHY_read read MEMPHY device
 *  @mp: memphy struct
 *  @addr: address
 *  @value: obtained value
 */
int MEMPHY_read(struct memphy_struct *mp, int addr, BYTE *value) {
    if (mp == NULL)
        return -1;

    if (mp->rdmflg) {
        /* Synchronization with rw_lock */
        sem_wait(&read_lock); // lock for updating read_count
        read_count++;
        if (read_count == 1) {
            sem_wait(&rw_lock);
        }
        sem_post(&read_lock);

        *value = mp->storage[addr]; // perfom reading

        sem_wait(&read_lock); // lock for updating read_count
        read_count--;
        if (read_count == 0) {
            sem_post(&rw_lock);
        }
        sem_post(&read_lock);
    } else /* Sequential access device */
        return MEMPHY_seq_read(mp, addr, value);
    return 0;
}

/*
 *  MEMPHY_seq_write - write MEMPHY device
 *  @mp: memphy struct
 *  @addr: address
 *  @data: written data
 */
int MEMPHY_seq_write(struct memphy_struct *mp, int addr, BYTE value) {

    if (mp == NULL)
        return -1;

    if (!mp->rdmflg)
        return -1; /* Not compatible mode for sequential read */

    MEMPHY_mv_csr(mp, addr);
    mp->storage[addr] = value;

    return 0;
}

/*
 *  MEMPHY_write-write MEMPHY device
 *  @mp: memphy struct
 *  @addr: address
 *  @data: written data
 */
int MEMPHY_write(struct memphy_struct *mp, int addr, BYTE data) {
    if (mp == NULL)
        return -1;

    if (mp->rdmflg) {
        /* Synchronization with IO_lock */
        sem_wait(&rw_lock);
        mp->storage[addr] = data;
        sem_post(&rw_lock);
    } else /* Sequential access device */
        return MEMPHY_seq_write(mp, addr, data);

    return 0;
}

/*
 *  MEMPHY_format-format MEMPHY device
 *  @mp: memphy struct
 */
int MEMPHY_format(struct memphy_struct *mp, int pagesz) {
    /* This setting come with fixed constant PAGESZ */
    int numfp = mp->maxsz / pagesz;
    struct framephy_struct *newfst, *fst;
    int iter = 0;

    if (numfp <= 0)
        return -1;

    /* Init head of free framephy list */
    fst = malloc(sizeof(struct framephy_struct));
    fst->fpn = iter;
    mp->free_fp_list = fst;

    /* We have list with first element, fill in the rest num-1 element member*/
    for (iter = 1; iter < numfp; iter++) {
        newfst = malloc(sizeof(struct framephy_struct));
        newfst->fpn = iter;
        newfst->fp_next = NULL;
        fst->fp_next = newfst;
        fst = newfst;
    }

    return 0;
}

int MEMPHY_get_freefp(struct memphy_struct *mp, int *retfpn) {
    pthread_mutex_lock(&fp_lock);
    struct framephy_struct *fp = mp->free_fp_list;

    if (fp == NULL) {
        pthread_mutex_unlock(&fp_lock);
        return -1;
    }

    *retfpn = fp->fpn;
    mp->free_fp_list = fp->fp_next;

    /* MEMPHY is iteratively used up until its exhausted
     * No garbage collector acting then it not been released
     */

    free(fp);
    pthread_mutex_unlock(&fp_lock);
    return 0;
}

int MEMPHY_dump(struct memphy_struct *mp) {
    /*TODO dump memphy contnt mp->storage
     *     for tracing the memory content
     */
    //////////////////////////////// TODO <--------------------------------//
    printf("===== PHYSICAL MEMORY DUMP =====\n");

    for (int i = 0; i < mp->maxsz; i++) {
        if (mp->storage[i] != 0x00) { // chỉ in những ô nhớ đã được ghi
            printf("BYTE %08x: %d\n", i, mp->storage[i]);
        }
    }

    printf("===== PHYSICAL MEMORY END-DUMP =====\n");
    //--------------------------------> TODO ////////////////////////////////
    return 0;
}

int MEMPHY_put_freefp(struct memphy_struct *mp, int fpn) {
    pthread_mutex_lock(&fp_lock);
    struct framephy_struct *fp = mp->free_fp_list;
    struct framephy_struct *newnode = malloc(sizeof(struct framephy_struct));

    /* Create new node with value fpn */
    newnode->fpn = fpn;
    newnode->fp_next = fp;
    mp->free_fp_list = newnode;
    pthread_mutex_unlock(&fp_lock);
    return 0;
}

/*
 *  Init MEMPHY struct
 */
int init_memphy(struct memphy_struct *mp, int max_size, int randomflg) {
    mp->storage = (BYTE *)malloc(max_size * sizeof(BYTE));
    mp->maxsz = max_size;
    memset(mp->storage, 0, max_size * sizeof(BYTE));

    MEMPHY_format(mp, PAGING_PAGESZ);

    mp->rdmflg = (randomflg != 0) ? 1 : 0;

    if (!mp->rdmflg) /* Not Ramdom acess device, then it serial device*/
        mp->cursor = 0;

    // Initialize semaphores
    sem_init(&rw_lock, 0, 1);   // binary semaphore for read/write lock
    sem_init(&read_lock, 0, 1); // binary semaphore for read lock

    return 0;
}

// #endif
