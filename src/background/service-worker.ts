import { PartySocket } from 'partysocket';

const RECONNECT_REASON = 'TICKET_UPDATED';

interface WSPayload {
  type: string;
  payload: any;
}

// This keeps track of websockets from different tabs
const wsData = {};

const closeExistingConnection = (tabId: number) => {
  wsData[tabId]?.close();
  delete wsData[tabId];
};

const handleWSUpdate = (ticketNumber: string, tabId: number) => {
  wsData[tabId].updateProperties({
    room: ticketNumber,
  });
  wsData[tabId].reconnect(undefined, RECONNECT_REASON);
};

const handleWSMessageSend = (tabId: number, message: WSPayload) => {
  wsData[tabId]?.send(JSON.stringify(message));
};

// Listens to any tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // Only send a message once the update has been completed and the tabid is present in the wsData
  // We dont want to send multiple requests
  if (tabId in wsData && changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { tabUpdate: true }).then((ticketNumber) => {
      wsData[tabId] && handleWSUpdate(ticketNumber, tabId);
    });
  }
});

// Listen to tab removal event.
// If the tab is removed and the tabId has a websocket assigned then close the connection
chrome.tabs.onRemoved.addListener((id) => {
  closeExistingConnection(id);
});

// Listen to any message from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.ping) {
    sendResponse({ okay: true });
  }

  //wsm is websocket message that the content script wants to send across
  if (request.wsm) {
    handleWSMessageSend(sender.tab.id, request.payload);
    sendResponse({ success: true });
  }

  if (request.close) {
    closeExistingConnection(sender.tab.id);
  }

  // This is where the websocket initialization happens.
  // this request gets triggered from the content script when for example the poker card loads for the first time.
  // Here we close any existing connection tied to the tabId from where the request is sent and creates and new connection
  if (request.init) {
    const tabId = sender.tab?.id;
    try {
      const ws = new PartySocket({
        host: 'https://pww.thilinaaligent.partykit.dev',
        // import.meta.env.MODE === 'development'
        //   ? 'localhost:1999'
        //   : 'https://pww.thilinaaligent.partykit.dev',
        room: request.ticket,
      });

      closeExistingConnection(tabId);

      wsData[tabId] = ws;
      // Below are the websocket (partykit) methods

      ws.addEventListener('open', () => {
        const data = {
          type: 'add-user',
          payload: {
            ...request.currentUser,
            score: null,
          },
        };
        handleWSMessageSend(tabId, data);
        tabId && chrome.tabs.sendMessage(tabId, { partykit: true, open: true });
      });

      ws.addEventListener('message', (message) => {
        tabId &&
          chrome.tabs.sendMessage(tabId, {
            partykit: true,
            message: true,
            data: message.data,
          });
      });

      ws.addEventListener('close', (close) => {
        // The close event comes in the following format:
        // {...reason: {code: 11, reason: <STRING PASSED WHEN RECONNECTING>}}
        // But the type identified/returned from close event is incorrect
        // it identifies the first reason to be a string but its a json object *sigh*
        // So have done the below. If this is corrected in the furture then below can be removed/changed
        const reasonObj = JSON.parse(JSON.stringify(close.reason));
        if (
          wsData[tabId]?._pk === ws._pk &&
          tabId &&
          reasonObj.reason !== RECONNECT_REASON
        ) {
          chrome.tabs.sendMessage(tabId, { partykit: true, close: true });
          closeExistingConnection(tabId); //cleanup
        }
      });

      ws.addEventListener('error', () => {
        if (wsData[tabId]?._pk === ws._pk && tabId) {
          chrome.tabs.sendMessage(tabId, { partykit: true, close: true });
        }
      });

      ///////////////////////////////////////////////////////////////////// websocket (partykit) methods end
    } catch (ex) {
      console.error('WS Error ', ex);
    }

    // Dummy response to the content script, currently not used for anything
    sendResponse({ message: 'WS initialized' });
  }
});
