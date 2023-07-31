<template>
    <div :class="['tag', `is-${type}`]">
        <span>{{ props.tag }}</span>
        <CloseButton @close="handleClose" />
    </div>
</template>

<script setup lang="ts">
import CloseButton from "./CloseButton.vue"

const props = defineProps({
    tag: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    }
})

const emit = defineEmits<{
    (e: 'close'): void
}>()

const handleClose = () => {
    emit("close")
}
</script>

<style lang="scss" scoped>
.tag {
    min-height: 24px;
    min-width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4px;

    &.is-rely {
        background-color: greenyellow;
    }

    &.is-effect {
        background-color: orange;
    }
}
</style>