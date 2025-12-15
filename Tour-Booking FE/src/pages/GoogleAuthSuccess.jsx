import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { userService } from "../services/api";
import Loading from "../components/Loading";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      try {
        // Lấy thông tin user từ cookie JWT đã được set
        const res = await userService.getMe();
        const user = res.data.data.data;
        
        if (user) {
          // Redirect theo role
          switch (user.role?.trim().toLowerCase()) {
            case "admin":
              navigate("/admin/dashboard", { replace: true });
              break;
            case "partner":
              navigate("/partner/dashboard", { replace: true });
              break;
            default:
              navigate("/", { replace: true });
              break;
          }
        }
      } catch (error) {
        console.error("Google auth error:", error);
        navigate("/login?error=google_auth_failed", { replace: true });
      }
    };

    fetchUserAndRedirect();
  }, [navigate]);

  return <Loading />;
};

export default GoogleAuthSuccess;
