import { useRecoilValue } from "recoil";
import { currentRole } from "../store/currentRoleAtom/currentRoleAtom";
import { tokenAtom } from "../store/tokenAtom/tokenAtom";

export const useHasPermission = (permission) => {
  const currentUserRole = useRecoilValue(currentRole);
  const token = useRecoilValue(tokenAtom);
  if (!currentUserRole) return false;

  const isSuperAdmin = token?.user?.roles.map((role) => role.name).includes("SuperAdmin");
  if (isSuperAdmin) return true;

  const allPermissions = currentUserRole?.userPermissions?.all_permissions;

  if (!Array.isArray(allPermissions)) return false;

  return allPermissions.some((perm) => perm?.name == permission);
};
