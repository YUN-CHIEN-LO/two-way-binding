<template>
    <div class="item" :class="[{ 'is-active': props.active }]" @click="handleChoose">
        <div>{{ props.value }}</div>
        <div class="item__wrapper">
            <div class="item__row">
                Rely On: <slot name="rely"></slot>
            </div>
            <div class="item__row">
                Effect On: <slot name="effect"></slot>
            </div>
        </div>
        <CloseButton @close="handleClose" />
    </div>
</template>

<script setup lang="ts">
import CloseButton from "./CloseButton.vue"

const props = defineProps({
    key: {
        type: String,
        default: ""
    },
    value: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: false
    },

})


const emit = defineEmits<{
    (e: 'choose'): void
    (e: 'close'): void
}>()

const handleChoose = (event: Event) => {
    event.stopPropagation();
    emit("choose")
}

const handleClose = () => {
    emit("close")
}
</script>

<style lang="scss" scoped>
.item {
    border: solid 1px #404040;
    min-height: 32px;
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4px;

    &.is-active {
        background-color: moccasin;
    }
}
</style>
