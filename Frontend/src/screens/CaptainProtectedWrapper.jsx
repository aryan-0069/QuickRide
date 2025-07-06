import axios from "axios";
import { useEffect ,useState} from "react";
import { useNavigate } from "react-router-dom";
import { useCaptain } from "../contexts/CaptainContext";
import Console from "../utils/console";
import VerifyEmail from "../components/VerifyEmail";

function CaptainProtectedWrapper({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = useCaptain();

  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/captain/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/captain/profile`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const captain = response.data.captain;
          setCaptain(captain);
          localStorage.setItem(
            "userData",
            JSON.stringify({ type: "captain", data: captain, }));
        }
        setIsVerified(captain.emailVerified)
      })
      .catch((err) => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/captain/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) return null; // or a loading spinner

  if (!isVerified) {
    return <VerifyEmail user={captain} role={"captain"} />; // or navigate to /verify-email
  }

  return <>{children}</>;
}

export default CaptainProtectedWrapper;
