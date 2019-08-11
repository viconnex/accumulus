export const fetchRequest = async (url, method, body) => {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
};

export const random = (min, max) => {
  if (max == null) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
};
