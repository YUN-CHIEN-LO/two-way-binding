<template>
    <div class="close" @click.stop="handleClose">
        X
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: 'close'): void
}>()

const handleClose = (event: Event) => {
    event.stopPropagation();
    emit("close")
}
</script>

<style lang="scss" scoped>
.close {
    cursor: pointer;
    margin-left: 4px;
}
</style>