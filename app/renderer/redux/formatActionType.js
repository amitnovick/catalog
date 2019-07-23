const formatActionType = (text, base, file) =>
  `${text} @ ${base.replace('src/', '')}${file}`;

export default formatActionType;
