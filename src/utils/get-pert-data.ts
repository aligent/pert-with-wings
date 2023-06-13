import { IPertData } from '@/@types/pertData';
import { getConfig } from '@/utils/get-config';

export const TICKETS_LIST_DATA = 'pert-with-wings-tickets-list';

export interface pertListType {
  ticketNo: string;
  details: IPertData;
  expiry: number;
}

const now = new Date();
export const currentDate = now.getTime();
export const expiryDate =
  currentDate + 24 * 60 * 60 * 1000 * (getConfig()?.expiry_days ?? 7);

/**
 * Retrieve all data from localstorage
 *
 * @returns { IPertData[] | null } ticket list stored in Local Storage
 */
export const getPertStoredList = () => {
  const retrieveTicketDetails = localStorage.getItem(TICKETS_LIST_DATA);

  if (retrieveTicketDetails !== null) return JSON.parse(retrieveTicketDetails);

  return null;
};

/**
 * If pert-with-wings-tickets-list doesn't exist in Local Storage, it creates a new list.
 * Otherwise, update/add ticket details to the list
 *
 * @param ticketNo
 * @param pertData
 */
export const updatePertStoredList = (ticketNo: string, pertData: IPertData) => {
  let storelocalData;

  const list: pertListType[] | null = getPertStoredList();

  if (list === null) {
    storelocalData = [
      {
        ticketNo: ticketNo,
        details: {
          ...pertData,
        },
        expiry: expiryDate,
      },
    ];
  } else {
    const listItem = list.find((item) => item.ticketNo === ticketNo);

    if (listItem !== undefined) {
      storelocalData = list.map((item) => {
        if (item.ticketNo === listItem.ticketNo)
          return {
            ...item,
            details: { ...listItem.details, ...pertData },
          };

        return item;
      });
    } else {
      storelocalData = [
        ...list,
        {
          ticketNo: ticketNo,
          details: {
            ...pertData,
          },
          expiry: expiryDate,
        },
      ];
    }
  }

  localStorage.setItem(TICKETS_LIST_DATA, JSON.stringify(storelocalData));
};

/**
 * Remove item from pert-with-wings-tickets-list, if estimation is expired
 *
 * @param ticketNo
 * @param list
 */
export const removePertTicketFromList = (
  ticketNo: string,
  list: pertListType[]
) => {
  if (list === null) return;

  const newList = list.filter((item) => item.ticketNo !== ticketNo);

  localStorage.setItem(TICKETS_LIST_DATA, JSON.stringify(newList));
};
