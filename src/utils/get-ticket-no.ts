export const IS_JIRA =
  window.location.hostname.includes('atlassian.net') ||
  window.location.pathname.startsWith('/browse/');

export const getTicketNo = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const azureParam = urlParams.get('workitem');

  const ticket = 'DEFAULT';

  if (IS_JIRA) {
    const jiraNo = window.location.href.match(/[A-Z]{2,}-\d+/);

    if (jiraNo !== null) return jiraNo[0];
  } else {
    if (azureParam !== null) return `AZURE-${azureParam}`;

    const azureNo = window.location.href.match(/edit\/(?<ticket>\d+)/);

    if (azureNo !== null) return `AZURE-${azureNo.groups?.ticket}`;
  }

  return ticket;
};
