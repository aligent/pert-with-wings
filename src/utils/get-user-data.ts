export const getUserData = () => {
  return {
    name:
      (
        document.querySelector(
          '[name="ajs-remote-user-fullname"]'
        ) as HTMLMetaElement
      )?.content || '',
    avatar:
      (
        document.querySelector(
          '[data-test-id="ak-spotlight-target-profile-spotlight"] img'
        ) as HTMLImageElement
      )?.src || '',
  };
};
