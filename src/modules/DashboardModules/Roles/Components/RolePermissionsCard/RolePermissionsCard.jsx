import PropTypes from "prop-types";
import { Shield, Calendar, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DeleteGlobal, IsEmpty } from "../../../../../components";
import { UpdateRole } from "../UpdateRole/UpdateRole";
import { AssignPermissions } from "../AssignPermissions/AssignPermissions";

export const RolePermissionsCard = ({ roleData }) => {
  const { t } = useTranslation("layout");
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case "create":
        return "text-emerald-600";
      case "read":
        return "text-blue-600";
      case "update":
        return "text-amber-600";
      case "delete":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const groupedPermissions = roleData.permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  return (
    <div className="py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-4 border-b border-[var(--secondary-text-color)]">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[var(--secondary-color)] rounded-lg">
            <Shield className="text-[var(--primary-color)]" />
          </div>
          <div>
            <h2 className="text-2xl mb-1 font-bold text-[var(--primary-color)]">
              {t(roleData.name)}
            </h2>
          </div>
        </div>
        <div className="text-right text-sm text-[var(--secondary-text-color)]">
          <div className="flex items-center gap-1 mb-1">
            <Calendar />
            <span>Created: {formatDate(roleData.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar />
            <span>Updated: {formatDate(roleData.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Permissions Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--primary-color)]">
            {t("permissions_overview")}
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
            {roleData.permissions.length} {t("total_permissions")}
          </span>
        </div>
      </div>

      {/* Detailed Permissions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--primary-color)] mb-4">
            {t("detailed_permissions")}
          </h3>
          <div className="flex items-center justify-between gap-2">
            {/* <DeleteGlobal
              endpoint={`roles/${roleData?.id}`}
              queryKey={["roles"]}
              text={t("role")}
              tooltipText={t("delete_role")}
              deleteTitle={t("delete_role")}
            /> */}
            {/* <UpdateRole role={roleData} /> */}
            <AssignPermissions
              role={roleData}
              permissionsSet={roleData?.permissions}
            />
          </div>
        </div>

        {roleData.permissions.length == 0 ? (
          <IsEmpty height={"30vh"} text={t("permissions")} />
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(
              // eslint-disable-next-line no-unused-vars
              ([_, permissions], index) => (
                <div
                  key={index}
                  className="bg-[var(--secondary-bg-color)] rounded-lg p-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {permissions.map((permission) => {
                      const action = permission.name.split("-")[0];
                      const resource = permission.name
                        .split("-")
                        .slice(1)
                        .join("-");
                      return (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 p-2 bg-white rounded border"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div className="text-sm">
                            <span
                              className={`font-medium capitalize ${getActionColor(
                                action
                              )}`}
                            >
                              {action}
                            </span>
                            <span className="text-gray-600 ml-1">
                              {resource}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

RolePermissionsCard.propTypes = {
  roleData: PropTypes.object,
};
