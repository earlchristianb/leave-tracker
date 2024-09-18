/** @format */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Paginate = ({
  itemsPerPage,
  totalItems,
  paginate,
  previousPage,
  nextPage,
  currentPage,
  showSkipMultiple = true,
}: {
  itemsPerPage: number;
  totalItems: number;
  paginate: (page: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  currentPage: number;
  showSkipMultiple?: boolean;
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full">
      <ul className="flex w-full items-center justify-center space-x-3">
        {showSkipMultiple && (
          <li
            onClick={() => paginate(1)}
            className="relative flex cursor-pointer items-center p-3"
          >
            <div className="w-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full">
                <FontAwesomeIcon fontSize="small" icon={faBackwardStep} />
              </div>
            </div>
            <div className="w-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full">
                <FontAwesomeIcon fontSize="small" icon={faBackwardStep} />
              </div>
            </div>
          </li>
        )}

        <li onClick={previousPage} className="cursor-pointer">
          <FontAwesomeIcon fontSize="small" icon={faBackwardStep} />
        </li>
        <label>
          {currentPage}/{pageNumbers.length}
        </label>
        <li onClick={nextPage} className="cursor-pointer">
          <FontAwesomeIcon fontSize="small" icon={faForwardStep} />
        </li>
        {showSkipMultiple && (
          <li
            onClick={() => paginate(pageNumbers.length)}
            className="relative flex cursor-pointer items-center justify-start p-3"
          >
            <div className="w-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full">
                <FontAwesomeIcon fontSize="small" icon={faForwardStep} />
              </div>
            </div>
            <div className="w-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full">
                <FontAwesomeIcon fontSize="small" icon={faForwardStep} />
              </div>
            </div>
          </li>
        )}
      </ul>
      <p className="w-full text-center text-sm">Records found: {totalItems}</p>
    </div>
  );
};

export default Paginate;
