export const IS_JIRA =
  window.location.hostname.includes('atlassian.net') ||
  window.location.pathname.startsWith('/browse/');

export const getTicketNo = () => {
  const ticket = 'DEFAULT';

  if (IS_JIRA) {
    const jiraNo = window.location.href.match(/[A-Z]{2,}-\d+/);

    if (jiraNo !== null) return jiraNo[0];
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const azureParam = urlParams.get('workitem');

    const project = window.location.href.match(
      /azure.com\/(?<project>[A-Za-z]{2,})/
    );

    if (azureParam !== null) return `${project?.groups?.project}-${azureParam}`;

    const azureNo = window.location.href.match(/edit\/(?<ticket>\d+)/);

    if (azureNo !== null)
      return `${project?.groups?.project}-${azureNo.groups?.ticket}`;
  }

  return ticket;
};
