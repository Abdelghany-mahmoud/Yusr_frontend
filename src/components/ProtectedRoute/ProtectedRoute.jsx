import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";

export const ProtectedRoute = ({ children }) => {
  const token = useRecoilValue(tokenAtom);

  if (token?.token) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};
ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
