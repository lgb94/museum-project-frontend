import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const removeExhibitObjectWithExhibitObjectId = (exhibit_object_id) => {
    return museumApi
    .delete(`/exhibitobjects/${exhibit_object_id}`)
    .then((res) => {
        return res.data;
    })
};
