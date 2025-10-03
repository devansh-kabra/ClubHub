export default function ErrorPage(props) {
    return (
        <div className="min-h-full" id="page-container">
            <h1>{props.errorCode} <br/> {props.comment}</h1>
        </div>
    )
}