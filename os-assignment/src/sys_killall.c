/*
 * Copyright (C) 2025 pdnguyen of HCMC University of Technology VNU-HCM
 */

/* Sierra release
 * Source Code License Grant: The authors hereby grant to Licensee
 * personal permission to use and modify the Licensed Source Code
 * for the sole purpose of studying while attending the course CO2018.
 */

#include "common.h"
#include "libmem.h"
#include "queue.h"
#include "stdio.h"
#include "string.h"
#include "syscall.h"
#include "uaccess.h"
#include <sched.h>
#include <stdlib.h>

int __sys_killall(struct pcb_t *caller, struct sc_regs *regs) {
    uint32_t raw_data[100];
    uint32_t memrg = regs->a1;

    if (copy_from_userspace(caller, memrg, raw_data,
                            sizeof(raw_data) / sizeof(raw_data[0])) != 0) {
        printf("Failed to copy process name from user space\n");
        return -1;
    }
    char proc_name[100];
    for (int i = 0; i < sizeof(raw_data) / sizeof(raw_data[0]); i++) {
        if (raw_data[i] == (uint32_t)-1) {
            proc_name[i] = '\0';
            break;
        }
        proc_name[i] = (char)raw_data[i];
    }
    printf("The procname retrieved from memregionid %d is \"%s\"\n", memrg,
           proc_name);

    /* TODO: Traverse proclist to terminate the proc
     *       stcmp to check the process match proc_name
     */
    // caller->running_list
    // caller->mlq_ready_queu

    /* TODO Maching and terminating
     *       all processes with given
     *        name in var proc_name
     */

    // Lock the queue to ensure thread safety
    lock_queue();

    // Traverse the running list and ready queue to kill the process
    // 1. Traverse run_list

    struct queue_t *run_list = caller->running_list;
    int len = run_list->size;
    // Traverse the run_list and kill the process if it matches proc_name
    for (int i = 0; i < len; i++) {
        struct pcb_t *proc = dequeue(run_list);

        // printf("In running list: process PID=%d \"%s\"\n", proc->pid,
        // proc->name);
        if (strcmp(proc->name, proc_name) != 0) {
            enqueue(run_list, proc); // Keep the process if it doesn't match
        } else {
            printf("Killed running process PID=%d \"%s\"\n", proc->pid,
                   proc_name);
            proc->is_killed = true; // Mark the process as killed
        }
    }

    // 2. Traverse mlq_ready_queue
    for (int lv = 0; lv < MAX_PRIO; lv++) {
        struct queue_t *q = &caller->mlq_ready_queue[lv];
        int len = q->size;

        for (int i = 0; i < len; i++) {
            struct pcb_t *proc = dequeue(q);
            // printf("In queue %d: process PID=%d \"%s\"\n", lv, proc->pid,
            // proc->name);
            if (strcmp(proc->name, proc_name) != 0) {
                enqueue(q, proc); // Keep the process if it doesn't match
            } else {
                printf("Killed ready process PID=%d \"%s\"\n", proc->pid,
                       proc_name);
                free_pcb_memphy(proc); // Free the memory of the process
                free(proc);
            }
        }
    }

    // Unlock the queue after the operation is done
    unlock_queue();

    return 0;
}
