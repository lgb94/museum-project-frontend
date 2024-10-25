import spinnerIcon from "../../assets/spinner-icon.png"

const LoadingSpinner = () => {
    return (
        <div className="spinner-wrapper">
            <img className="spinner" src={spinnerIcon} alt="A statue of a woman in an energetic pose" />
            <p>Page loading...</p>
        </div>
    )
}

export default LoadingSpinner