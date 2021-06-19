import SortedMap from "./SortedMap";

describe("SortedMap testing", () => {

  let sortedMap: SortedMap<any>;

  beforeEach(() => {
    sortedMap = new SortedMap<any>();
  });

  it("should return the added value", function () {

    const obj = {key: "value"};

    sortedMap.set(1, obj);

    expect(sortedMap.get(1)).toBe(obj);

  });

  it("should return undefined", () => {
    expect(sortedMap.get(1)).toBeUndefined();
  });

  it("should return an array", () => {
    const sortedArray = Array.from(Array(10).keys());
    const unsortedArray = Array.from(Array(10).keys()).sort(() => Math.random() - 0.5);

    unsortedArray.forEach(value => {
      sortedMap.set(value, {key: "value" + value});
    });

    sortedMap.toArray(true)
        .map(value => value[0])
        .forEach((value, i) => {
          expect(value).toBe(sortedArray[i]);
        });

  });

  it("should return the new values", () => {

    sortedMap.set(1, {key: "value1"});

    sortedMap.map((value: any, key: number, sortedMap: SortedMap) => {
      return {key: "value2"};
    }).toArray()
        .forEach(value => {
          expect(value).toEqual({key: "value2"});
        });

  });

  it.only("simple test", () => {
    const unsortedArray = Array.from(Array(10).keys()).sort(() => Math.random() - 0.5);

    unsortedArray.forEach(value => {
      sortedMap.set(value, {key: "value" + value});
    });

    for (const a of sortedMap) {
      console.log(a);
    }

  });

});
