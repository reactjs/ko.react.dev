/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import cn from 'classnames';
import {useState, useRef, useEffect} from 'react';
import {IconChevron} from 'components/Icon/IconChevron';

import {SandpackCodeViewer, useSandpack} from '@codesandbox/sandpack-react';
import type {SandpackMessageConsoleMethods} from '@codesandbox/sandpack-client';

const getType = (
  message: SandpackMessageConsoleMethods
): 'info' | 'warning' | 'error' => {
  if (message === 'log' || message === 'info') {
    return 'info';
  }

  if (message === 'warn') {
    return 'warning';
  }

  return 'error';
};

type ConsoleData = Array<{
  data: Array<string | Record<string, string>>;
  id: string;
  method: SandpackMessageConsoleMethods;
}>;

const MAX_MESSAGE_COUNT = 100;

export const SandpackConsole = ({visible}: {visible: boolean}) => {
  const {listen} = useSandpack();
  const [logs, setLogs] = useState<ConsoleData>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;
    const unsubscribe = listen((message) => {
      if (!isActive) {
        console.warn('Received an unexpected log from Sandpack.');
        return;
      }
      if (
        (message.type === 'start' && message.firstLoad) ||
        message.type === 'refresh'
      ) {
        setLogs([]);
      }
      if (message.type === 'console' && message.codesandbox) {
        setLogs((prev) => {
<<<<<<< HEAD
          const newLogs = message.log.filter(({method}) => method === 'log');
=======
          const newLogs = message.log
            .filter((consoleData) => {
              if (
                typeof consoleData.data[0] === 'string' &&
                consoleData.data[0].indexOf('The above error occurred') !== -1
              ) {
                // Don't show React error addendum because
                // we have a custom error overlay.
                return false;
              }
              return true;
            })
            .map((consoleData) => {
              return {
                ...consoleData,
                data: formatStr(...consoleData.data),
              };
            });
>>>>>>> cb9854a54984ef1288a8a2b8754897b15e75f433
          let messages = [...prev, ...newLogs];
          while (messages.length > MAX_MESSAGE_COUNT) {
            messages.shift();
          }
          return messages;
        });
      }
    });

    return () => {
      unsubscribe();
      isActive = false;
    };
  }, [listen]);

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  if (!visible || logs.length === 0) {
    return null;
  }

  return (
    <div className="absolute dark:border-gray-700 bg-white dark:bg-gray-95 border-t bottom-0 w-full dark:text-white">
      <div className="flex justify-between">
        <button
          className="flex items-center p-1"
          onClick={() => setIsExpanded(!isExpanded)}>
          <IconChevron displayDirection={isExpanded ? 'down' : 'right'} />
          <span className="pl-1 text-sm">Console ({logs.length})</span>
        </button>
        <button
          className="p-1"
          onClick={() => {
            setLogs([]);
          }}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </button>
      </div>
      {isExpanded && (
        <div className="w-full h-full border-t bg-white dark:border-gray-700 dark:bg-gray-95 min-h-[28px] console">
          <div className="max-h-40 h-auto overflow-auto" ref={wrapperRef}>
            {logs.map(({data, id, method}) => {
              return (
                <div
                  key={id}
                  className={cn(
<<<<<<< HEAD
                    'last:border-none border-b dark:border-gray-700 text-md p-1 pl-2 leading-6 font-mono',
                    `console-${getType(method)}`
=======
                    'first:border-none border-t dark:border-gray-700 text-md p-1 pl-2 leading-6 font-mono min-h-[32px] whitespace-pre-wrap',
                    `console-${getType(method)}`,
                    getColor(method)
>>>>>>> cb9854a54984ef1288a8a2b8754897b15e75f433
                  )}>
                  <span className={cn('console-message')}>
                    {data.map((msg, index) => {
                      if (typeof msg === 'string') {
                        return <span key={`${msg}-${index}`}>{msg}</span>;
                      }

                      let children;
                      if (msg != null && typeof msg['@t'] === 'string') {
                        // CodeSandbox wraps custom types
                        children = msg['@t'];
                      } else {
                        try {
                          children = JSON.stringify(msg, null, 2);
                        } catch (error) {
                          try {
                            children = Object.prototype.toString.call(msg);
                          } catch (err) {
                            children = '[' + typeof msg + ']';
                          }
                        }
                      }

                      return (
                        <span
                          className={cn('console-span')}
                          key={`${msg}-${index}`}>
                          <SandpackCodeViewer
                            initMode="user-visible"
                            showTabs={false}
                            // fileType="js"
                            code={children}
                          />
                        </span>
                      );
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
