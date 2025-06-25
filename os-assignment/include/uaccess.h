#ifndef UACCESS_H
#define UACCESS_H
#include "common.h"
#include <stddef.h>

int copy_from_userspace(struct pcb_t *caller, uint32_t memrg, void *dst,
                        size_t maxlen);
int copy_to_userspace(struct pcb_t *caller, uint32_t memrg, const void *src,
                      size_t maxlen);
#endif // UACCESS_H
