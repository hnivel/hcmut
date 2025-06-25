#include "common.h"
#include "syscall.h"
#include <stdlib.h>

int __sys_exit(struct pcb_t *caller, struct sc_regs *reg) {
    exit(0);
    return 0;
}