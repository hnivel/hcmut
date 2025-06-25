#include "queue.h"
#include <stdio.h>
#include <stdlib.h>

int empty(struct queue_t *q) {
    if (q == NULL)
        return 1;
    return (q->size == 0);
}

void enqueue(struct queue_t *q, struct pcb_t *proc) {
    /* TODO: put a new process to queue [q] */

    // Implementation
    if (q == NULL || proc == NULL) {
        return;
    }

    if (q->size < MAX_QUEUE_SIZE) {
        q->proc[q->size++] = proc;
    } else {
        // Replace the lowest priority process (?)
        q->proc[q->size - 1] = proc;
    }
    // Implementation
}

struct pcb_t *dequeue(struct queue_t *q) {
    /* TODO: return a pcb whose priority is the highest
     * in the queue [q] and remember to remove it from q
     * */

    // Implementation
    if (q == NULL || q->size == 0) {
        return NULL;
    }

    struct pcb_t *proc = q->proc[0];
    for (unsigned long i = 0; i < q->size - 1; i++) {
        q->proc[i] = q->proc[i + 1];
    }

    q->size--;
    return proc;
    // Implementation
}

// Remove a process from the queue
void remove_proc(struct queue_t *q, struct pcb_t *proc) {
    for (unsigned long i = 0; i < q->size; i++) {
        if (q->proc[i] == proc) {
            for (unsigned long j = i; j < q->size - 1; j++) {
                q->proc[j] = q->proc[j + 1];
            }
            q->size--;
            break;
        }
    }
}