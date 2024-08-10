import classnames from 'classnames';
// eslint-disable-next-line import/no-named-as-default
import usePartySocket from 'partysocket/react';
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';

import ActionButton from '@/components/ActionButton';
import { getTicketNo, getUserData, safelyParseJson } from '@/utils';

import classes from './PlanningPoker.module.css';

interface User {
  name: string;
  avatar: string;
  score: number | null;
}

interface PlanningPokerProps {
  exit: (arg: boolean) => void;
}

const CARD_BACKGROUNDS = [
  {
    background: `linear-gradient(135deg,#0000 18.75%,#47d3ff 0 31.25%,#0000 0),
repeating-linear-gradient(45deg,#47d3ff -6.25% 6.25%,#474bff 0 18.75%)`,
    backgroundSize: `64px 64px`,
  },
  {
    background: `repeating-conic-gradient(from 45deg, #474bff 0% 25%, #47d3ff 0% 50%)`,
    backgroundSize: `32px 32px`,
    backgroundColor: `#47d3ff`,
  },
  {
    backgroundImage: `repeating-conic-gradient(from 30deg, #474bff 0% 60deg, #47d3ff 0% 120deg)`,
    backgroundSize: `32px 55px`,
    backgroundColor: `#47d3ff`,
  },
  {
    background: `conic-gradient(from 116.56deg at calc(100%/3) 0, #0000 90deg,#47d3ff 0),
    conic-gradient(from -63.44deg at calc(200%/3) 100%, #0000 90deg,#47d3ff 0)
#474bff`,
    backgroundSize: `32px 32px`,
  },
  {
    background: `linear-gradient(135deg, #474bff 25%, transparent 25%) -32px 0, linear-gradient(225deg, #474bff 25%, transparent 25%) -32px 0, linear-gradient(315deg, #474bff 25%, transparent 25%), linear-gradient(45deg, #474bff 25%, transparent 25%)`,
    backgroundSize: `64px 64px`,
    backgroundColor: `#47d3ff`,
  },
];

const CARDS = [1, 2, 3, 5, 8, 13, 21, '☕'] as const;

const PlanningPoker: FC<PlanningPokerProps> = (props) => {
  const { exit } = props;
  const currentUser = getUserData();
  const [party, setParty] = useState<User[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const ws = usePartySocket({
    host:
      import.meta.env.MODE === 'development'
        ? 'localhost:1999'
        : 'https://pww.thilinaaligent.partykit.dev',
    room: getTicketNo(),

    onOpen() {
      setSocketConnected(true);
      ws.send(
        JSON.stringify({
          type: 'add-user',
          payload: {
            ...currentUser,
            score: null,
          },
        })
      );
    },
    onMessage(e) {
      const data = safelyParseJson(e.data);
      if (data.type === 'presence') {
        setParty(data.payload.users.filter(Boolean));
      }

      if (data.type === 'reveal-cards') {
        setCardsRevealed(true);
      }
    },
    onClose() {
      console.log('closed');
      setSocketConnected(false);
    },
    onError() {
      console.log('error');
      setSocketConnected(false);
    },
  });

  const { t } = useTranslation();

  const handleShowChoices = () => {
    ws.send(
      JSON.stringify({
        type: 'set-score',
        payload: {
          ...currentUser,
          score: null,
        },
      })
    );
    setShowCards(true);
  };

  const handleChooseCard = (card: number | string) => {
    ws.send(
      JSON.stringify({
        type: 'set-score',
        payload: {
          ...currentUser,
          score: card,
        },
      })
    );
    setShowCards(false);
  };

  const handleRevealCards = () => {
    ws.send(
      JSON.stringify({
        type: 'reveal-cards',
      })
    );
    setCardsRevealed(true);
  };

  const uniqueParty = useMemo(() => {
    return [...new Map(party.map((item) => [item['name'], item])).values()];
  }, [party]);

  const canRevealCards = useMemo(() => {
    return uniqueParty.length > 1 && uniqueParty.every((user) => user.score);
  }, [uniqueParty]);

  const canChooseCards = useMemo(() => {
    return uniqueParty.length > 1;
  }, [uniqueParty]);

  useEffect(() => {
    if (!currentUser) return;
    console.log(currentUser, getTicketNo(), 'starting');
  }, [ws]);

  useEffect(() => {
    const listenNavigate = () => {
      ws.updateProperties({
        room: getTicketNo(),
      });
      ws.reconnect();
    };

    //@ts-expect-error navigation api not supported yet
    navigation.addEventListener('navigate', listenNavigate);

    return () => {
      //@ts-expect-error navigation api not supported yet
      navigation.removeEventListener('navigate', listenNavigate);
    };
  }, []);

  if (!socketConnected) return null;

  return (
    <div className={classes.planningPoker}>
      <ul className={classes.party}>
        {uniqueParty.map(({ name, avatar, score }, index) => (
          <li className={classes.card} key={name}>
            <button
              className={classnames(classes.player, {
                [classes.playerReady]: score,
                [classes.myCard]: currentUser.name === name,
                [classes.cardFlipped]: cardsRevealed,
              })}
              disabled={
                !canChooseCards || cardsRevealed || currentUser.name !== name
              }
              onClick={handleShowChoices}
            >
              <div className={classes.cardContent}>
                <div className={classes.cardBack}>
                  <div className={classes.score}>{score}</div>
                  <div className={classes.info}>
                    <img src={avatar} alt={name} />
                    <span>{name.split(' ')[0]}</span>
                  </div>
                </div>
                <div
                  className={classes.cardFront}
                  style={{ ...CARD_BACKGROUNDS[index] }}
                >
                  <div className={classes.score}>
                    {currentUser.name === name ? (
                      <>
                        {score ? (
                          '👍'
                        ) : (
                          <small>
                            {canChooseCards
                              ? t('chooseYourCard')
                              : t('waitingForOthers')}
                          </small>
                        )}
                      </>
                    ) : (
                      <>{score ? '👍' : '🤔'}</>
                    )}
                  </div>
                  <div className={classes.info}>
                    <img src={avatar} alt={name} />
                    <span>{name.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </button>
            {currentUser.name === name && (
              <>
                <button
                  className={classes.leave}
                  title={`${t('leavePlanningPoker')}`}
                  onClick={() => exit(false)}
                >
                  <MdClose />
                </button>
                <ul
                  className={classnames(classes.cards, {
                    [classes.cardsShow]: showCards,
                  })}
                >
                  {CARDS.map((card, index) => (
                    <li
                      className={classes.card}
                      style={{ '--index': index + 1 } as CSSProperties}
                      key={card}
                    >
                      <button
                        type="button"
                        onClick={() => handleChooseCard(card)}
                        className={classes.selectableCard}
                      >
                        <div className={classes.cardContent}>
                          <div className={classes.score}>{card}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
        <li>
          <ActionButton
            className={classes.revealButton}
            disabled={!canRevealCards || cardsRevealed}
            clickAction={handleRevealCards}
            actionLabel={<>{t('reveal')}</>}
          />
        </li>
      </ul>
    </div>
  );
};

export default PlanningPoker;
