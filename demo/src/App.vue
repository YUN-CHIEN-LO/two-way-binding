<script setup lang="ts">
import { ref, reactive, } from "vue"
import BindItem from "./components/BindItem.vue"
import BindTag from "./components/BindTag.vue"
import TwoWayBinding from "./../../dist"


const objs = {} as { [key: string]: any };
const counter = ref(1)

const addItem = () => {
  Object.assign(objs, {
    [`obj${counter.value}`]: {
      key: `obj${counter.value}`,
      value: `This is ${counter.value++}.`,
    },
  })
}


Array(5)
  .fill(0).forEach(() => {
    addItem()
  })

const isActive = ref("blank")

const myBinder = reactive(new TwoWayBinding("key", Object.values(objs)));




const handleChoose = (key: string) => {
  if (key === isActive.value) {
    isActive.value = "blank"
  }
  else if (isActive.value !== "blank" && key !== "blank") {
    myBinder.make(isActive.value)?.rely(key)
    isActive.value = "blank"
  } else {
    isActive.value = key
  }
}

const handleRemoveRely = (target: string, rely: string) => {
  myBinder.make(target)?.removeRely(rely);
  isActive.value = target;
}

const handleRemoveEffect = (target: string, rely: string) => {
  myBinder.make(target)?.removeEffect(rely);
  isActive.value = target;
}



const handleDestroy = (target: string,) => {
  console.log("handleDestroy")
  myBinder.make(target)?.destroy()
  console.log(objs, target)
  delete objs[target]
}

</script>

<template>
  <div class="container" @click.stop="handleChoose('blank')">
    {{ isActive }}
    <bind-item v-for="obj in objs" :key="obj.key" :value="obj.value" :active="isActive === obj.key"
      @choose="handleChoose(obj.key)" @close="handleDestroy(obj.key)">
      <template #rely>
        <BindTag v-for="tag in myBinder.make(obj.key)?.listRelyOn()" :key="tag" :tag="tag" type="rely"
          @close="handleRemoveRely(obj.key, tag)" />
      </template>
      <template #effect>
        <BindTag v-for="tag in myBinder.make(obj.key)?.listEffectOn()" :key="tag" :tag="tag" type="effect"
          @close="handleRemoveEffect(obj.key, tag)" />
      </template>
    </bind-item>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
