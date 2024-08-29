export const getElem = <T>(elem: string): T => {
  return document.querySelector(elem) as T
}

export type ElemProps = {
  type: string
  id?: string
  className?: string
  innerValue?: string
}

export const createElem = <T extends HTMLElement>(props: ElemProps): T => {
  let elem = document.createElement(props.type);
  if (props.id) elem.id = props.id;
  if (props.className) elem.className = props.className;
  if (props.innerValue) elem.innerText = props.innerValue;
  return elem as T;
}
