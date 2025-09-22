import { useEffect, useState, useContext } from "react";
import { Container, Spinner } from "react-bootstrap";
import UserContext from "../UserContext";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";

const API_BASE = process.env.REACT_APP_API_URL;

export default function Movies() {
  const { user } = useContext(UserContext);
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/movies/getMovies`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setMoviesData(Array.isArray(data.movies) ? data.movies : []);
    } catch (err) {
      console.error("Unable to fetch movies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;

  // ✅ Check if user exists before rendering
  if (!user) return <Spinner animation="border" variant="primary" />;

  return user.isAdmin
    ? <AdminView moviesData={moviesData} fetchData={fetchData} />
    : <UserView moviesData={moviesData} />;
}