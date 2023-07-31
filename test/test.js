import TwoWayBinding from "../dist/index.js";
import expect from "expect.js";

const objs = Array(10)
  .fill(0)
  .reduce(
    (accumulator, item, index) =>
      Object.assign(accumulator, {
        [`obj${index + 1}`]: {
          key: `obj${index + 1}`,
          value: `this is ${index + 1}`,
        },
      }),
    {}
  );

const myBinder = new TwoWayBinding("key", Object.values(objs));

function fa(arr) {
  return arr.sort().join(",");
}

describe("basic methods", () => {
  it("register is a function", function () {
    expect(myBinder.register).to.be.a("function");
  });
  it("register obj1", function () {
    const { obj1 } = objs;

    expect(myBinder.getObjByKey(obj1.key).key).to.be(obj1.key);
  });

  it("make obj1 rely obj2, obj3", function () {
    const { obj1, obj2, obj3 } = objs;

    myBinder.make(obj1.key).rely(obj2.key);
    myBinder.make(obj1.key).rely(obj3.key);

    expect(fa(myBinder.make(obj1.key).listRelyOn())).to.be(
      fa([obj2.key, obj3.key])
    );
    expect(fa(myBinder.make(obj2.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj3.key).listEffectOn())).to.be(fa([obj1.key]));
  });

  it("make obj1 effect obj4", function () {
    const { obj1, obj2, obj3, obj4 } = objs;

    myBinder.make(obj1.key).effect(obj4.key);

    expect(fa(myBinder.make(obj1.key).listRelyOn())).to.be(
      fa([obj2.key, obj3.key])
    );
    expect(fa(myBinder.make(obj1.key).listEffectOn())).to.be(fa([obj4.key]));
    expect(fa(myBinder.make(obj2.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj3.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj4.key).listRelyOn())).to.be(fa([obj1.key]));
  });

  it("make obj3 effect obj1", function () {
    const { obj1, obj2, obj3, obj4 } = objs;

    myBinder.make(obj3.key).effect(obj1.key);

    expect(fa(myBinder.make(obj1.key).listRelyOn())).to.be(
      fa([obj2.key, obj3.key])
    );
    expect(fa(myBinder.make(obj1.key).listEffectOn())).to.be(fa([obj4.key]));
    expect(fa(myBinder.make(obj2.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj3.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj4.key).listRelyOn())).to.be(fa([obj1.key]));
  });

  it("make obj1 remove rely obj2", function () {
    const { obj1, obj2, obj3, obj4 } = objs;

    myBinder.make(obj1.key).removeRely(obj2.key);

    expect(fa(myBinder.make(obj1.key).listRelyOn())).to.be(fa([obj3.key]));
    expect(fa(myBinder.make(obj1.key).listEffectOn())).to.be(fa([obj4.key]));
    expect(fa(myBinder.make(obj2.key).listEffectOn())).to.be(fa([]));
    expect(fa(myBinder.make(obj3.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj4.key).listRelyOn())).to.be(fa([obj1.key]));
  });

  it("make obj3 remove effect obj1", function () {
    const { obj1, obj2, obj3, obj4 } = objs;

    myBinder.make(obj3.key).removeEffect(obj1.key);

    expect(fa(myBinder.make(obj1.key).listRelyOn())).to.be(fa([]));
    expect(fa(myBinder.make(obj1.key).listEffectOn())).to.be(fa([obj4.key]));
    expect(fa(myBinder.make(obj2.key).listEffectOn())).to.be(fa([]));
    expect(fa(myBinder.make(obj3.key).listEffectOn())).to.be(fa([]));
    expect(fa(myBinder.make(obj4.key).listRelyOn())).to.be(fa([obj1.key]));
  });


  it("make obj1 destroy", function () {
    const { obj1, obj2, obj3, obj4 } = objs;

    myBinder.make(obj1.key).rely(obj2.key);
    myBinder.make(obj1.key).rely(obj3.key);

    
    expect(fa(myBinder.make(obj1.key).listRelyOn())).to.be(fa([obj2.key, obj3.key]));
    expect(fa(myBinder.make(obj1.key).listEffectOn())).to.be(fa([obj4.key]));
    expect(fa(myBinder.make(obj2.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj3.key).listEffectOn())).to.be(fa([obj1.key]));
    expect(fa(myBinder.make(obj4.key).listRelyOn())).to.be(fa([obj1.key]));

    myBinder.make(obj1.key).destroy();

    expect(myBinder.getObjByKey(obj1.key)).to.not.be.ok();
    expect(fa(myBinder.make(obj2.key).listEffectOn())).to.be(fa([]));
    expect(fa(myBinder.make(obj3.key).listEffectOn())).to.be(fa([]));
    expect(fa(myBinder.make(obj4.key).listRelyOn())).to.be(fa([]));
  });

});
