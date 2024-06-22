export default function Square({ value, setSquareValue }) {
  return (
    <>
      <button
        style={{ color: value ? "#fff" : "#F95950" }}
        onClick={setSquareValue}
      >
        {value ? value : "-"}
      </button>
    </>
  );
}
