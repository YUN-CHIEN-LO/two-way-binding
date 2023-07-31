import { EventEmitter } from "events";

type DataObj = { [key: string]: any };

type BindStore = {
  [key: string]: BindObj;
};

class BindObj extends EventEmitter {
  data: DataObj;
  key: string;
  relyOn: Set<string>;
  effectOn: Set<string>;

  constructor(data: DataObj, key: string) {
    super();
    this.data = data;
    this.key = key;
    this.relyOn = new Set([]);
    this.effectOn = new Set([]);
  }

  listRelyOn() {
    if (!this.relyOn) return [];
    return Array.from(this.relyOn);
  }

  listEffectOn() {
    if (!this.effectOn) return [];
    return Array.from(this.effectOn);
  }

  rely(key: string, bubble: boolean = false) {
    this.relyOn.add(key);
    if (bubble) return;
    this.emit("rely", key);
  }

  effect(key: string, bubble: boolean = false) {
    this.effectOn.add(key);
    if (bubble) return;
    this.emit("effect", key);
  }

  removeRely(key: string, bubble: boolean = false) {
    this.relyOn.delete(key);
    if (bubble) return;
    this.emit("removeRely", key);
  }

  removeEffect(key: string, bubble: boolean = false) {
    this.effectOn.delete(key);
    if (bubble) return;
    this.emit("removeEffect", key);
  }

  reset() {
    this.relyOn.forEach((rely) => {
      this.removeRely(rely);
    });
    this.effectOn.forEach((effect) => {
      this.removeEffect(effect);
    });
  }

  destroy() {
    this.reset();
    this.emit("destroy");
  }
}

class TwoWayBinding {
  key: string;
  store: BindStore;
  counter: number;

  constructor(key: string, objList?: DataObj[]) {
    this.key = key;
    this.counter = 0;
    this.store = {} as BindStore;
    objList?.forEach((obj) => {
      this.register(obj);
    });
  }

  log() {
    console.log(this.store);
  }

  getObjByKey(key: string) {
    return this.store[key]?.data;
  }

  make(key: string) {
    return this.store[key];
  }

  register(obj: { [key: string]: any }) {
    const registerKey = obj[this.key] ?? `key-${this.counter++}`;
    const registerObj = new BindObj(obj, registerKey);

    registerObj.on("rely", (key: string) => {
      this.make(key)?.effect(registerKey, true);
    });

    registerObj.on("effect", (key: string) => {
      this.make(key)?.rely(registerKey, true);
    });

    registerObj.on("removeRely", (key: string) => {
      this.make(key)?.removeEffect(registerKey, true);
    });

    registerObj.on("removeEffect", (key: string) => {
      this.make(key)?.removeRely(registerKey, true);
    });

    registerObj.on("destroy", () => {
      delete this.store[registerKey];
    });

    this.store[registerKey] = registerObj;
    return registerObj;
  }
}

export default TwoWayBinding;
