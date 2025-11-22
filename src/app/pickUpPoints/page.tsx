import PickUpPointsMap from "./pickUpPoints/PickUpPointsMap";
import styles from "./pickUpPoints.module.css";

export default async function PickUpPoints() {
  return (
    <div className={styles.container}>
      <PickUpPointsMap />
    </div>
  );
}
