import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const RoleRedirect = ({ children }) => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Nếu user đã đăng nhập, redirect về dashboard của họ
      switch (user.role?.trim().toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "partner":
          navigate("/partner/dashboard", { replace: true });
          break;
        default:
          // Customer thì ở lại trang hiện tại
          break;
      }
    }
  }, [user, loading, navigate]);

  // Nếu đang loading hoặc user là customer, hiển thị children
  if (loading) {
    return null; // hoặc <Loading />
  }

  // Chỉ hiển thị nếu không phải admin/partner
  if (!user || user.role?.trim().toLowerCase() === "customer") {
    return children;
  }

  // Admin/Partner sẽ bị redirect, không hiển thị gì
  return null;
};

export default RoleRedirect;
