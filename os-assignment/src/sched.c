
#include "sched.h"
#include "queue.h"
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
static struct queue_t ready_queue;
static struct queue_t run_queue;
pthread_mutex_t queue_lock;

static struct queue_t running_list;
#ifdef MLQ_SCHED
static struct queue_t mlq_ready_queue[MAX_PRIO];
static int slot[MAX_PRIO];
#endif

static inline int min(int a, int b) { return (a < b) ? a : b; }

static inline int max(int a, int b) { return (a > b) ? a : b; }

int queue_empty(void) {
    int result;
    pthread_mutex_lock(&queue_lock);
#ifdef MLQ_SCHED
    unsigned long prio;
    for (prio = 0; prio < MAX_PRIO; prio++)
        if (!empty(&mlq_ready_queue[prio])) {
            pthread_mutex_unlock(&queue_lock);
            return -1;
        }
#endif
    result = (empty(&ready_queue) && empty(&run_queue));
    pthread_mutex_unlock(&queue_lock);
    return result;
}

void init_scheduler(void) {
#ifdef MLQ_SCHED
    int i;

    for (i = 0; i < MAX_PRIO; i++) {
        mlq_ready_queue[i].size = 0;
        slot[i] = MAX_PRIO - i;
    }
#endif
    ready_queue.size = 0;
    run_queue.size = 0;
    pthread_mutex_init(&queue_lock, NULL);
}

#ifdef MLQ_SCHED

/* Remove a process from the running list with lock */
void remove_proc_from_running_list(struct pcb_t *proc) {
    pthread_mutex_lock(&queue_lock);
    remove_proc(&running_list, proc);
    pthread_mutex_unlock(&queue_lock);
}

void lock_queue() { pthread_mutex_lock(&queue_lock); }

void unlock_queue() { pthread_mutex_unlock(&queue_lock); }

/*
 *  Stateful design for routine calling
 *  based on the priority and our MLQ policy
 *  We implement stateful here using transition technique
 *  State representation   prio = 0 .. MAX_PRIO, curr_slot = 0..(MAX_PRIO -
 * prio)
 */
struct pcb_t *get_mlq_proc(void) {
    struct pcb_t *proc = NULL;
    /*TODO: get a process from PRIORITY [ready_queue].
     * Remember to use lock to protect the queue.
     * */

    // Implementation
    pthread_mutex_lock(&queue_lock);
    extern int get_time_slot(void);
    int time_slot = get_time_slot();
    int is_available = 0;
    for (unsigned long prio = 0; prio < MAX_PRIO; prio++) {
        if (slot[prio] > 0 && !empty(&mlq_ready_queue[prio])) {
            is_available = 1;
            break;
        }
    }

    if (is_available == 0) {
        // Reset slots and dequeue from the highest priority queue
        for (unsigned long prio = 0; prio < MAX_PRIO; prio++) {
            slot[prio] = MAX_PRIO - prio;
            if (proc == NULL && !empty(&mlq_ready_queue[prio])) {
                proc = dequeue(&mlq_ready_queue[prio]);
                int running_time = min(time_slot, proc->code->size - proc->pc);
                slot[prio] = max(0, slot[prio] - running_time);
            }
        }
    } else {
        // Dequeue from the highest priority queue
        for (unsigned long prio = 0; prio < MAX_PRIO; prio++) {
            if (!empty(&mlq_ready_queue[prio]) && slot[prio] > 0) {
                proc = dequeue(&mlq_ready_queue[prio]);
                int running_time = min(time_slot, proc->code->size - proc->pc);
                slot[prio] = max(0, slot[prio] - running_time);
                break;
            }
        }
    }

    pthread_mutex_unlock(&queue_lock);
    return proc;
    // Implementation
}

void put_mlq_proc(struct pcb_t *proc) {
    pthread_mutex_lock(&queue_lock);
    enqueue(&mlq_ready_queue[proc->prio], proc);
    pthread_mutex_unlock(&queue_lock);
}

void add_mlq_proc(struct pcb_t *proc) {
    pthread_mutex_lock(&queue_lock);
    enqueue(&mlq_ready_queue[proc->prio], proc);
    pthread_mutex_unlock(&queue_lock);
}

struct pcb_t *get_proc(void) {
    struct pcb_t *proc = get_mlq_proc();
    if (proc != NULL) {
        proc->running_list = &running_list;

        pthread_mutex_lock(&queue_lock);
        enqueue(&running_list, proc);
        pthread_mutex_unlock(&queue_lock);
    }
    return proc;
}

void put_proc(struct pcb_t *proc) {
    proc->ready_queue = &ready_queue;
    proc->mlq_ready_queue = mlq_ready_queue;
    proc->running_list = &running_list;

    remove_proc_from_running_list(proc);

    return put_mlq_proc(proc);
}

void add_proc(struct pcb_t *proc) {
    proc->ready_queue = &ready_queue;
    proc->mlq_ready_queue = mlq_ready_queue;
    proc->running_list = &running_list;
    return add_mlq_proc(proc);
}

#else
struct pcb_t *get_proc(void) {
    struct pcb_t *proc = NULL;
    /*TODO: get a process from [ready_queue].
     * Remember to use lock to protect the queue.
     * */

    // Implementation
    pthread_mutex_lock(&queue_lock);
    proc = dequeue(&ready_queue);
    pthread_mutex_unlock(&queue_lock);
    // Implementation

    return proc;
}

void put_proc(struct pcb_t *proc) {
    proc->ready_queue = &ready_queue;
    proc->running_list = &running_list;

    /* TODO: put running proc to running_list */

    // Implementation
    pthread_mutex_lock(&queue_lock);
    enqueue(&running_list, proc);
    enqueue(&ready_queue, proc);
    pthread_mutex_unlock(&queue_lock);
    // Implementation
}

void add_proc(struct pcb_t *proc) {
    proc->ready_queue = &ready_queue;
    proc->running_list = &running_list;

    /* TODO: put running proc to running_list */

    // Implementation
    pthread_mutex_lock(&queue_lock);
    enqueue(&running_list, proc);
    enqueue(&ready_queue, proc);
    pthread_mutex_unlock(&queue_lock);
    // Implementation
}
#endif