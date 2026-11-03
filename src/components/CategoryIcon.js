import { FiCamera, FiFilm, FiMic, FiMusic, FiEdit3 } from "react-icons/fi";
const MAP = { camera: FiCamera, film: FiFilm, mic: FiMic, music: FiMusic, brush: FiEdit3 };
export default function CategoryIcon({ name, size = 24 }) {
  const I = MAP[name] || FiCamera;
  return <I size={size} />;
}
