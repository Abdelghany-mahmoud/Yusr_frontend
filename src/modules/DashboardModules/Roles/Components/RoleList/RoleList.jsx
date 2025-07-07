import PropTypes from "prop-types";
import { RolePermissionsCard } from "../RolePermissionsCard/RolePermissionsCard";

export const RoleList = ({ roles }) => {
  return (
    <div>
      {roles?.map((role) => {
        return <RolePermissionsCard key={role.id} roleData={role} />;
      })}
    </div>
  );
};
RoleList.propTypes = {
  roles: PropTypes.array,
};
