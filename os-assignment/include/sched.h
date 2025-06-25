#ifndef SCHED_H
#define SCHED_H

#include "common.h"

#ifndef MLQ_SCHED
#define MLQ_SCHED
#endif

#define MAX_PRIO 140

int queue_empty(void);

void init_scheduler(void);
void finish_scheduler(void);

/* Remove a process from the running list with lock */
void remove_proc_from_running_list(struct pcb_t *proc);

/* Get the next process from ready queue */
struct pcb_t *get_proc(void);

/* Put a process back to run queue */
void put_proc(struct pcb_t *proc);

/* Add a new process to ready queue */
void add_proc(struct pcb_t *proc);

/* Mutex lock for the scheduler */
void lock_queue(void);
void unlock_queue(void);

#endif