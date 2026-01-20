
/**
 * 转换成小驼峰
 * @param property
 * @return {*}
 */
const hyphenToCamelCase = property => {
  return property.replace(/-([a-z])/g, function (match, group) {
    return group.toUpperCase();
  });
};

const toStr = v => `'${v}'`;

const blackList = ['font-family'];

const convert = text => {
  const res = text.split(';').reduce((acc, item) => {
    if (!item) {
      return acc;
    }
    const add = (k, v) => (acc += `${k}: ${v},\n`);

    let [key, value] = item.split(':');
    key = key.trim();
    value = value.trim();
    // console.log(key,'value:', value)

    if (blackList.includes(key)) {
      return acc;
    }
    switch (key) {
      case 'background': {
        add('backgroundColor', toStr(value));
        break;
      }
      case 'color': {
        add('color', toStr(value));
        break;
      }
      case 'font-weight': {
        if (value === '400') {
          break;
        }
        add('fontWeight', toStr(value));
        break;
      }
      case 'border': {
        const [borderWidth, borderStyle, borderColor] = value.split(' ');
        add('borderWidth', parseInt(borderWidth));
        if (borderStyle !== 'solid') {
          add('borderStyle', toStr(borderStyle));
        }
        add('borderColor', toStr(borderColor));

        break;
      }
      case 'box-shadow': {
        // box-shadow: 0px 3px 6px 0px #FFE3CD;
        // for RN@0.76
        const [offsetX,offsetY,blurRadius,spreadRadius,color] = value.split(' ');
        add(
          'boxShadow',
          `'${parseInt(offsetX)} ${parseInt(offsetY)} ${parseInt(blurRadius)} ${parseInt(spreadRadius)} ${color}'`
        )
        break;
      }
      default: {
        add(hyphenToCamelCase(key), parseInt(value));
        break;
      }
    }
    return acc;
  }, '');
  console.log(`====== res ======\n`, res);
  return res;
};

function app() {
  document.addEventListener('copy', async e => {
    console.log('====copy', e.target);

    try {
      const text = await navigator.clipboard.readText();
      console.log(text);
      const style = convert(text);
      if (style) {
        await navigator.clipboard.writeText(style);
      }
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
  });
}

app();
