import { useState } from "react";
import PropTypes from "prop-types";
import { useField, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { FaUserCircle } from "react-icons/fa";
import { useGetData } from "../../../../hooks/useGetData";
import { DropDownMenu, ModelPagination } from "../../../../components";

const UserDropdownWithPagination = ({ name }) => {
  const [field, , helpers] = useField(name);
  const { t } = useTranslation("layout");
  const { setFieldValue } = useFormikContext();

  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetData({
    endpoint: `users/without-client?page=${page}`,
    queryKey: ["users", page],
  });

  const users = data?.data?.data || [];
  const totalPages = data?.data?.last_page || 1;

  const handleSelectUser = (user) => {
    setFieldValue(name, user.id);
    helpers.setTouched(true);
  };

  const selectedUser = users.find((u) => u.id === field.value);

  return (
    <div className="space-y-2">
      <label className="block font-semibold">{t("client_user")}</label>
      <DropDownMenu
        menuTitle={
          selectedUser
            ? `${selectedUser.name} (${selectedUser.email})`
            : t("select_user")
        }
        MenuIcon={<FaUserCircle />}
        className="w-full"
      >
        <div className="max-h-[250px] overflow-y-auto w-full z-50">
          {isLoading && <div className="p-2">{t("loading")}</div>}
          {isError && (
            <div className="p-2 text-red-500">{t("error_loading_users")}</div>
          )}
          {!isLoading && !isError && users.length === 0 && (
            <div className="p-2 text-gray-500">{t("no_users_found")}</div>
          )}
          {!isLoading &&
            users.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  user.id === field.value ? "bg-gray-200 font-bold" : ""
                }`}
              >
                {user.name} ({user.email})
              </li>
            ))}
        </div>
        <ModelPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </DropDownMenu>
    </div>
  );
};

UserDropdownWithPagination.propTypes = {
  name: PropTypes.string.isRequired,
};

export default UserDropdownWithPagination;
