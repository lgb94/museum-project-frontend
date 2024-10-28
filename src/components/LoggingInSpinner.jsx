import spinnerIcon from "../../assets/spinner-icon.png"

const LoggingInSpinner = () => {
    return (
        <div className="above-screen-wrapper">
            <img className="spinner" src={spinnerIcon} alt="A statue of a woman in an energetic pose" />
            <p>Logging you in...</p>
        </div>
    )
}

export default LoggingInSpinner