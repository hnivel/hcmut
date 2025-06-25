#include "uaccess.h"
#include "libmem.h"
#include <stddef.h>

int copy_from_userspace(struct pcb_t *caller, uint32_t memrg, void *dst,
                        size_t maxlen) {
    uint32_t *dest = (uint32_t *)dst;
    uint32_t data;
    size_t i = 0;
    for (; i < maxlen; i++) {
        if (libread(caller, memrg, i, &data) != 0) {
            dest[i] = '\0';
            return -1;
        }

        dest[i] = (uint32_t)data;
    }
    return 0;
}

int copy_to_userspace(struct pcb_t *caller, uint32_t memrg, const void *src,
                      size_t maxlen) {
    const uint32_t *source = (const uint32_t *)src;
    size_t i = 0;
    for (; i < maxlen; i++) {
        if (libwrite(caller, memrg, (uint32_t)source[i], i) != 0) {
            return -1;
        }
    }
    return 0;
}