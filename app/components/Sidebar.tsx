import React from "react";
import { useApiKey } from "../providers/ApiKeyProvider";
import classNames from "classnames";

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const { apiKey, setApiKey } = useApiKey();
  const [tempApiKey, setTempApiKey] = React.useState(apiKey);

  return (
    <div
      className={classNames(
        "tw-bg-white dark:tw-bg-gray-800 tw-w-64 tw-p-4 tw-border-r",
        "tw-transition-all tw-duration-300 tw-ease-in-out",
        "tw-flex tw-flex-col tw-h-full",
        open ? "tw-block" : "tw-hidden"
      )}
    >
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <div className="space-y-2 tw-flex-grow tw-overflow-y-auto"></div>

      <div className="tw-mt-auto tw-pt-4 tw-px-4 tw-border-t tw-border-gray-200 dark:tw-border-gray-600 -tw-mx-4">
        <label
          htmlFor="apiKey"
          className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300"
        >
          Mistral API key
        </label>
        <div className="tw-mt-1 tw-flex">
          <input
            type="text"
            name="apiKey"
            id="apiKey"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            className={classNames(
              "tw-block tw-px-2 tw-py-1 tw-w-full tw-border-y tw-border-l tw-rounded-l-md focus:tw-outline-none tw-text-sm",
              "tw-text-gray-900 tw-bg-white tw-border-gray-300",
              "dark:tw-text-white dark:tw-bg-gray-700 dark:tw-border-gray-600",
              "focus:tw-ring-orange-500 focus:tw-border-orange-500"
            )}
            placeholder="Enter your key"
          />
          <button
            onClick={() => setApiKey(tempApiKey)}
            className={classNames(
              "tw-inline-flex tw-items-center tw-px-3 tw-py-2 tw-border tw-border-transparent tw-text-sm tw-leading-4 tw-font-medium tw-rounded-r-md tw-shadow-sm tw-text-white",
              "tw-bg-orange-600 hover:tw-bg-orange-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-orange-500"
            )}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
