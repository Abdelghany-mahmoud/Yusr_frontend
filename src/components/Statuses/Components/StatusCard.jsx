import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { DeleteGlobal } from "../../DeleteGlobal/DeleteGlobal";
import { format } from "date-fns";
import { Button } from "../../Button/Button";
import { FaEdit } from "react-icons/fa";
import { useHasPermission } from "../../../hooks/useHasPermission";

export const StatusCard = ({ status, index, onEdit }) => {
  const { t } = useTranslation("layout");
  const canUpdateStatus = useHasPermission("update-status");
  const canDeleteStatus = useHasPermission("delete-status");
  return (
    <tr
      key={status.id}
      className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
    >
      <td className="p-3 max-w-2">{index + 1}</td>
      <td className="p-3">{status?.name || "-"}</td>
      <td className="p-3">
        {format(new Date(status?.created_at), "yyyy-MM-dd hh:mm") || "-"}
      </td>
      <td className="p-3">
        {format(new Date(status?.updated_at), "yyyy-MM-dd hh:mm") || "-"}
      </td>
      <td className="flex gap-2 items-center p-3 justify-center">
        {canUpdateStatus && (
          <Button
            onClick={() => onEdit(status)}
            className="btn-sm bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] border-none"
            tooltipText={t("edit_status")}
            text={t("edit_status")}
          >
            <FaEdit />
          </Button>
        )}
        {canDeleteStatus && (
          <DeleteGlobal
            endpoint={`statuses/${status?.id}`}
            queryKey={["statuses"]}
            text={t("delete_status")}
            tooltipText={t("delete_status")}
            deleteTitle={t("delete_status")}
          />
        )}
      </td>
    </tr>
  );
};

StatusCard.propTypes = {
  status: PropTypes.object,
  index: PropTypes.number,
  onEdit: PropTypes.func,
};
