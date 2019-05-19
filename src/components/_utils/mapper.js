/**
 * 根据value返回label
 * @param {*} mapperArray   数组 [ { value: "xxx", label: "xxx" }, ... ]
 * @param {*} value         value值
 * @param {*} defaultLabel  默认的label
 */
const Mapper = (mapperArray, value, defaultLabel = "未知") => {
  let label = defaultLabel;
  if (mapperArray instanceof Array) {
    // console.log("mapper --> ", mapper, " | value --> ", value);
    mapperArray.forEach(item => {
      if (item && (item.value === value || `${item.value}` === `${value}`)) {
        label = item.label;
      }
    });
  } else if (mapperArray[value]) {
    label = mapperArray[value].label;
  }
  return label;
}

export {
  Mapper,
};
