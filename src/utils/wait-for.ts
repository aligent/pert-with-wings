export const waitFor = (waitTime = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, waitTime);
  });
