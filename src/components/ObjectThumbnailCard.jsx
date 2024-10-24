import { Link } from "react-router-dom"

const ObjectThumbnailCard = (props) => {
    const object = props.object
    return (
        <>
        <Link to={`/objects/${object.object_id}`}>
        <li className="object-thumbnail" key={object.object_id}>
              <img
                src={`${object.primary_image}`}
                alt={`A thumbnail image of object titled ${object.title}`}
                width="200"
                height="200"
              />
            </li>
        </Link>
        </>
    )
}

export default ObjectThumbnailCard