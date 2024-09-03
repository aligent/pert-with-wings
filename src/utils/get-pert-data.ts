import { IPertData } from '@/@types/pertData';

import { get, set } from './storage';

export const TICKETS_LIST_DATA = 'pert-with-wings-tickets-list';

export interface pertListType {
  ticketNo: string;
  details: IPertData;
  expiry: number;
}

const now = new Date();
export const currentDate = now.getTime();
export const getExpiryDate = (config: IPertData) =>
  currentDate + 24 * 60 * 60 * 1000 * (config?.expiry_days ?? 7);

/**
 * Retrieve all data from chrome storage
 *
 * @returns { IPertData[] | undefined } ticket list stored in Chrome Storage
 */
export const getPertStoredList = async () => {
  const retrieveTicketDetails = await get<pertListType[]>(TICKETS_LIST_DATA);

  return retrieveTicketDetails;
};

/**
 * If pert-with-wings-tickets-list doesn't exist in Chrome storage, it creates a new list.
 * Otherwise, update/add ticket details to the list
 *
 * @param ticketNo
 * @param pertData
 */
export const updatePertStoredList = async (
  ticketNo: string,
  pertData: IPertData
) => {
  let storelocalData;

  const list: pertListType[] | undefined = await getPertStoredList();

  if (list === undefined) {
    storelocalData = [
      {
        ticketNo: ticketNo,
        details: {
          ...pertData,
        },
        expiry: getExpiryDate(pertData),
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
          expiry: getExpiryDate(pertData),
        },
      ];
    }
  }

  set<pertListType[]>(TICKETS_LIST_DATA, storelocalData);
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
  if (list === undefined) return;

  const newList = list.filter((item) => item.ticketNo !== ticketNo);

  set<pertListType[]>(TICKETS_LIST_DATA, newList);
};
