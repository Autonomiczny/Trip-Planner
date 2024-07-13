import MapFromCords from "./components/MapFromCords";
import MapFromLocation from "./components/MapFromLocation";

const loc = { lat: -33.867, lng: 151.195 };
const place = "Museum of Contemporary Art Australia";
const cords = { lat: 52.1354, lng: 21.0023 };

export default function Home() {
  return (
    <>
      <MapFromCords cords={cords}></MapFromCords>
      <MapFromLocation location={loc} place={place}></MapFromLocation>
    </>
  );
}
