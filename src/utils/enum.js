// import { formatMessage } from 'umi/locale';

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

// // 状态 1启用 0未启用
// const StatusArray = [
//   { value: '0', label: formatMessage({ id: 'enum.StatusArray.0.label' }) },
//   { value: '1', label: formatMessage({ id: 'enum.StatusArray.1.label' }) },
// ];

// 排序
const SorterOrderArray = [
  { value: "descend", label: "DESC" },
  { value: "ascend", label: "ASC" },
];

export {
  Mapper,
  SorterOrderArray,
};
