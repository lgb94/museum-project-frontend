import spinnerIcon from "../../assets/spinner-icon.png"

const LoadingSpinner = () => {
    return (
        <div className="above-screen-wrapper">
            <img className="spinner" src={spinnerIcon} alt="A statue of a woman in an energetic pose" />
            <p>Working...</p>
        </div>
    )
}

export default LoadingSpinner