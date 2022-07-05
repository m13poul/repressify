import "./SubmissionButton.styles.scss";

function SubmissionButton({ value }: { value: string }) {
  return (
    <div>
      <input type="submit" value={value} className="submission-button" />
    </div>
  );
}

export default SubmissionButton;
