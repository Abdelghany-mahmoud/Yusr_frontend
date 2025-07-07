import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModelPagination } from "../../../../components";
import { MdHistory } from "react-icons/md";
import { useGetData } from "../../../../hooks/useGetData";
import { Loading, IsEmpty } from "../../../../components"; // ensure Pagination is imported here
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";

function ActivityLog({ customer }) {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [token] = useRecoilState(tokenAtom);
  console.log(token?.user?.id, "token");
  const { data, isLoading } = useGetData({
    endpoint: `users/activity-logs?user_id=${customer?.user_id}&causer_id=${token?.user?.id}&page=${page}`,
    queryKey: ["activity-log", customer?.user_id, page],
    enabledKey: isOpen,
  });

  const ActivityItem = ({ activity }) => (
    <div className="border-b border-[var(--border-color)] p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-[var(--main-text-color)]">
            {activity.description}
          </h4>
          <p className="text-sm text-[var(--secondary-text-color)]">
            {activity.causer_type} #{activity.causer_id}
          </p>

          {/* Render all properties key-values */}
          {activity.properties && (
            <div className="mt-1 text-sm text-[var(--secondary-text-color)] italic space-y-1">
              {Object.entries(activity.properties).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-sm text-[var(--secondary-text-color)]">
          {new Date(activity.created_at).toLocaleString()}
        </span>
      </div>
    </div>
  );

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("activity_log")}
        >
          <MdHistory />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("activity_log")}
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      <div className="mt-4">
        {isLoading ? (
          <Loading />
        ) : data?.data?.data?.length === 0 ? (
          <IsEmpty text={t("no_activity_found")} />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            {data?.data?.data?.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <ModelPagination
          totalPages={data?.data?.last_page}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </Modal>
  );
}

export default ActivityLog;
