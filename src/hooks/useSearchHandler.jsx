import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchKeysAtom } from "../store/searchKeysAtom/searchKeysAtom";
import { searchAtom } from "../store/searchAtom/searchAtom";
import { useTranslation } from "react-i18next";

export const useSearchHandler = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation("layout");
  const [searchKeys, setSearchKeys] = useRecoilState(searchKeysAtom);
  const [isSearchInCurrentPage, setIsSearchInCurrentPage] = useState(false);
  const searchValue = useRecoilValue(searchAtom);
  const ifSend =
    searchValue?.key !== undefined &&
    searchValue?.searchValue !== "" &&
    searchValue?.searchValue !== null;

  const filterQuery = ifSend
    ? `&${searchValue?.key}=${searchValue?.searchValue}`
    : "";
  const filterValue = searchValue?.searchValue;
  useEffect(() => {
    setSearchKeys([
      { key: "transaction_id", value: t("transaction_id") },
      { key: "name", value: t("name") },
      { key: "phone", value: t("phone_number") },
    ]);

    setIsSearchInCurrentPage(true); // always allow search
  }, [pathname, setSearchKeys, t]);
  return { searchKeys, isSearchInCurrentPage, filterValue, filterQuery };
};
