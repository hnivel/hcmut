#include "common.h"
#include "stdio.h"
#include "syscall.h"

int __sys_hello(struct pcb_t *caller, struct sc_regs *reg) {
    printf("Hello World!\n");
    return 0;
}