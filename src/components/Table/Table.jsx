import { PropTypes } from "prop-types";

export const Table = ({ tableHead, body }) => {
  return (
    <div className="overflow-x-auto last:bottom-0 shadow-md rounded-xl">
      <div>
        <table className={` w-full`}>
          <thead className="border-b bg-[var(--secondary-color)]  text-[var(--main-text-color)]">
            <tr>
              {tableHead?.map((th, index) => {
                return (
                  <th
                    className={`${index == 0 ? "min-w-9" : "min-w-24"} p-4`}
                    key={index}
                  >
                    {th}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="text-[var(--primary-color)]">{body}</tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  tableHead: PropTypes.array,
  body: PropTypes.node,
};
