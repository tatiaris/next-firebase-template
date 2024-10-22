export const sum = (a: number, b: number): number => {
  return a + b;
};

export const getCookie = (c_name: string): string => {
  let c_value = " " + document.cookie;
  let c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_value = "";
  } else {
    c_start = c_value.indexOf("=", c_start) + 1;
    let c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start, c_end));
  }
  return c_value;
};

export const navigatePath = (path: string): void => {
  location.href = path;
};

export const refreshPage = () => {
  location.reload();
};
